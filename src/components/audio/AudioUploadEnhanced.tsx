
import React, { useState, useCallback } from "react";
import { BaseMediaUploader } from "@/pages/ManagePortfolio/components/media/BaseMediaUploader";
import AudioPlayerManager from "@/components/audio/AudioPlayerManager";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Upload, FileAudio } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AudioUploadEnhancedProps {
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onUploadComplete?: (url: string, path: string) => void;
  onUploadStatusChange?: (isUploading: boolean, hasUploaded: boolean) => void;
}

export const AudioUploadEnhanced: React.FC<AudioUploadEnhancedProps> = ({
  currentUrl,
  file,
  setFile,
  toast,
  onUploadComplete,
  onUploadStatusChange
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUploaded = useCallback((url: string, path: string) => {
    console.log('🎵 Audio upload completed:', { url, path });
    setUploadedUrl(url);
    setUploadError("");
    setUploadProgress(0);
    
    // Notify parent components immediately
    if (onUploadComplete) {
      onUploadComplete(url, path);
    }
    
    // Update upload status
    if (onUploadStatusChange) {
      onUploadStatusChange(false, true);
    }
    
    toast({
      title: "Audio Upload Complete",
      description: "Your audio file is ready to be saved with the portfolio item.",
    });
  }, [onUploadComplete, onUploadStatusChange, toast]);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
    setUploadError("");
    setUploadProgress(0);
    
    if (onUploadStatusChange) {
      onUploadStatusChange(true, false);
    }
  }, [onUploadStatusChange]);

  const handleUploadProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const handleUploadError = useCallback((error: string) => {
    setIsUploading(false);
    setUploadError(error);
    setUploadProgress(0);
    
    if (onUploadStatusChange) {
      onUploadStatusChange(false, false);
    }
  }, [onUploadStatusChange]);

  const hasValidAudio = uploadedUrl && uploadedUrl.trim() !== '';

  return (
    <div className="space-y-4">
      <BaseMediaUploader
        type="audio"
        currentUrl={currentUrl}
        file={file}
        setFile={setFile}
        toast={toast}
        onFileUploaded={handleFileUploaded}
        onUploadStart={handleUploadStart}
        onUploadError={handleUploadError}
      >
        {/* Enhanced Upload Status */}
        <div className="mt-4 space-y-3">
          {/* Progress indicator during upload */}
          {isUploading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
                <div>
                  <p className="font-medium text-blue-800">Uploading Audio...</p>
                  <p className="text-sm text-blue-600">Please wait while we process your file</p>
                </div>
              </div>
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-blue-600">{Math.round(uploadProgress)}% uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Upload Error</p>
                  <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                  <div className="mt-2 text-xs text-red-600">
                    <p><strong>Supported formats:</strong> MP3, WAV, OGG, M4A, AAC, FLAC, WebM</p>
                    <p><strong>Max file size:</strong> 500MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success state with preview */}
          {hasValidAudio && !isUploading && (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="font-medium text-green-800">Audio Ready</p>
                    <p className="text-sm text-green-700 mt-1">Your audio file has been uploaded and is ready to save.</p>
                    {file && (
                      <div className="mt-2 text-xs text-green-600">
                        <p><strong>File:</strong> {file.name}</p>
                        <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>Type:</strong> {file.type}</p>
                      </div>
                    )}
                  </div>
                  <FileAudio className="h-5 w-5 text-green-600" />
                </div>
              </div>

              {/* Audio Preview */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileAudio className="h-4 w-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">Audio Preview</h4>
                </div>
                <AudioPlayerManager
                  audioUrl={uploadedUrl}
                  title="Uploaded Audio"
                  variant="compact"
                />
              </div>
            </div>
          )}
        </div>
      </BaseMediaUploader>
    </div>
  );
};
