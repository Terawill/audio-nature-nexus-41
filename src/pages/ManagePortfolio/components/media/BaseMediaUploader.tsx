
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Upload, Loader2 } from "lucide-react";
import { FileUploadService, FileUploadResult } from "@/services/fileUpload";
import { Progress } from "@/components/ui/progress";

export interface BaseMediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  children?: React.ReactNode;
  onFileUploaded?: (url: string, path: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
}

export const BaseMediaUploader: React.FC<BaseMediaUploaderProps> = ({
  type,
  currentUrl,
  file,
  setFile,
  toast,
  children,
  onFileUploaded,
  onUploadStart,
  onUploadError
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || "");
  const [uploadedPath, setUploadedPath] = useState<string>("");
  
  // Initialize uploadedUrl when currentUrl changes
  React.useEffect(() => {
    if (currentUrl && currentUrl !== uploadedUrl) {
      setUploadedUrl(currentUrl);
      console.log(`📂 ${type} uploader initialized with existing URL:`, currentUrl);
    }
  }, [currentUrl, type]);
  
  const getAcceptTypes = () => {
    switch (type) {
      case "image": return "image/*";
      case "audio": return "audio/*,.wav,.mp3,.ogg,.m4a,.aac,.flac,.webm";
      case "video": return "video/*";
      default: return "";
    }
  };
  
  const getMaxSize = () => {
    switch (type) {
      case "image": return 10; // 10MB
      case "audio": return 500; // 500MB
      case "video": return 500; // 500MB
      default: return 10;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case "image": return "Cover Image";
      case "audio": return "Audio File";
      case "video": return "Video File";
      default: return "File";
    }
  };
  
  const getDescription = () => {
    switch (type) {
      case "image": return "Upload a cover image for your portfolio item (JPG, PNG, WebP, GIF)";
      case "audio": return "Upload an audio preview (MP3, WAV, OGG, M4A, AAC, FLAC, WebM)";
      case "video": return "Upload a video preview (MP4, WebM, MOV)";
      default: return "";
    }
  };
  
  const validateFileType = (selectedFile: File): boolean => {
    const fileType = selectedFile.type;
    const fileName = selectedFile.name.toLowerCase();
    
    if (type === "image" && !fileType.startsWith("image/")) {
      return false;
    }
    
    if (type === "audio") {
      // Accept both MIME type and file extension for audio files
      const audioMimeTypes = [
        'audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav',
        'audio/ogg', 'audio/vorbis', 'audio/mp4', 'audio/aac',
        'audio/flac', 'audio/x-flac', 'application/x-flac', 'audio/webm'
      ];
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];
      const hasValidMime = audioMimeTypes.includes(fileType);
      const hasValidExtension = audioExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidMime && !hasValidExtension) {
        return false;
      }
    }
    
    if (type === "video" && !fileType.startsWith("video/")) {
      return false;
    }
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    if (!validateFileType(selectedFile)) {
      const errorMsg = `Please select a valid ${type} file. ${type === 'audio' ? 'Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC, WebM' : ''}`;
      toast({
        title: "Invalid File Type",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }
    
    const fileSizeInMB = selectedFile.size / 1024 / 1024;
    const maxSize = getMaxSize();
    
    if (fileSizeInMB > maxSize) {
      toast({
        title: "File Too Large",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} files must be smaller than ${maxSize}MB. Selected file is ${fileSizeInMB.toFixed(2)}MB.`,
        variant: "destructive"
      });
      return;
    }
    
    const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    setFileName(sanitizedFileName);
    setFile(selectedFile);
    // Clear previous upload state when new file is selected
    setUploadedUrl("");
    setUploadedPath("");
    
    console.log(`📎 File selected: ${sanitizedFileName} (${selectedFile.type})`);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: sanitizedFileName
    });
  };
  
  const handleUploadFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Notify upload start
    if (onUploadStart) {
      onUploadStart();
    }
    
    try {
      console.log(`🚀 Starting ${type} upload:`, file.name);
      
      const result: FileUploadResult = await FileUploadService.uploadFile(
        file,
        type,
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );
      
      if (result.success && result.url && result.path) {
        setUploadedUrl(result.url);
        setUploadedPath(result.path);
        
        console.log(`✅ ${type} upload successful:`, result.url);
        
        // Notify parent component immediately with URL
        if (onFileUploaded) {
          onFileUploaded(result.url, result.path);
        }
        
        toast({
          title: "File Uploaded Successfully",
          description: `${fileName} has been uploaded and is ready to use.`,
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      console.error(`❌ ${type} upload error:`, error);
      
      // Notify error
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
    setUploadedUrl("");
    setUploadedPath("");
    setUploadProgress(0);
  };
  
  const isUploaded = uploadedUrl !== "";
  const hasCurrentMedia = currentUrl && currentUrl.trim() !== '';
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-2">{getTitle()}</h3>
        <p className="text-sm text-nature-bark mb-4">{getDescription()}</p>
        
        {/* Show current media info if it exists */}
        {hasCurrentMedia && !file && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Current {type} file is available</p>
                <p className="text-green-700 break-all">{currentUrl}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor={`${type}-upload`}>Select {getTitle()}</Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileChange}
            className="cursor-pointer"
            disabled={isUploading}
          />
          
          {file && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-nature-forest flex-grow">
                {fileName} 
                {isUploaded && <span className="text-green-500 ml-2">(✓ Uploaded & Ready)</span>}
              </span>
              <div className="flex space-x-2">
                {!isUploaded && !isUploading && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleUploadFile}
                    className="bg-nature-forest hover:bg-nature-leaf"
                  >
                    <Upload className="mr-1 h-3 w-3" />
                    Upload
                  </Button>
                )}
                {isUploading && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    disabled
                    className="bg-nature-forest"
                  >
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Uploading...
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700"
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-xs text-nature-bark mt-1">{uploadProgress.toFixed(0)}% uploaded</p>
            </div>
          )}
          
          <div className={`flex items-start gap-2 mt-1 text-xs ${isUploaded ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'} p-2 rounded`}>
            {isUploaded ? (
              <>
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">File uploaded and ready</p>
                  <p>The file has been saved and will be included when you save the portfolio item.</p>
                  {uploadedUrl && (
                    <p className="text-xs text-green-800 mt-1 break-all">URL: {uploadedUrl}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Ready to upload</p>
                  <p>Select a file and click 'Upload' to save it to Supabase Storage.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};
