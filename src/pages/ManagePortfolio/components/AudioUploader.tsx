
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@/data/portfolio";
import { AlertCircle } from "lucide-react";

interface AudioUploaderProps {
  currentItem: PortfolioItem;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFileName: string;
  setAudioFileName: React.Dispatch<React.SetStateAction<string>>;
  toast: any;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  currentItem,
  audioFile,
  setAudioFile,
  audioFileName,
  setAudioFileName,
  toast
}) => {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, FLAC, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size
      const fileSizeInMB = file.size / 1024 / 1024;
      if (fileSizeInMB > 500) {
        toast({
          title: "Audio file too large",
          description: "Please use an audio file smaller than 500MB",
          variant: "destructive"
        });
        return;
      }
      
      // Sanitize filename to remove problematic characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      setAudioFile(file);
      setAudioFileName(sanitizedFileName);
      
      toast({
        title: "Audio file selected",
        description: "Click 'Save Changes' to update the portfolio item with this audio file.",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="audio">Audio File</Label>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-grow">
          <Input
            id="audio"
            className="cursor-pointer"
            type="file"
            accept="audio/*,.wav,.mp3,.ogg,.m4a,.aac,.flac,.webm"
            onChange={handleAudioUpload}
          />
        </div>
        {audioFileName && (
          <div className="text-sm text-nature-forest">
            {audioFileName}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-amber-600">
        <AlertCircle className="h-4 w-4" />
        <span>
          After uploading, you'll need to manually copy this file to your public/audio/ directory
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Upload MP3, WAV, FLAC, or other audio files (max 500MB)
      </p>
      {currentItem.audioUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium">Current Audio:</p>
          <p className="text-xs text-nature-forest">{currentItem.audioUrl}</p>
          <audio 
            controls 
            className="w-full mt-2 h-10" 
            src={encodeURI(currentItem.audioUrl)}
            onError={(e) => {
              console.error("Error loading audio:", currentItem.audioUrl);
              e.currentTarget.parentElement?.classList.add("opacity-50");
              const errorMsg = document.createElement("div");
              errorMsg.className = "text-xs text-red-500 mt-1";
              errorMsg.innerText = "Could not load audio file. It may be missing.";
              e.currentTarget.parentElement?.appendChild(errorMsg);
            }}
          />
        </div>
      )}
    </div>
  );
};
