import { supabase } from "@/integrations/supabase/client";

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileUploadService {
  private static getBucketName(type: "image" | "audio" | "video" | "avatar"): string {
    switch (type) {
      case "image": return "portfolio-images";
      case "audio": return "portfolio-audio";
      case "video": return "portfolio-videos";
      case "avatar": return "avatars";
    }
  }

  private static generateFileName(originalName: string, userId?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const userFolder = userId || 'anonymous';
    return `${userFolder}/${timestamp}_${randomId}_${sanitizedName}`;
  }

  private static normalizeMimeType(file: File): string {
    const fileName = file.name.toLowerCase();
    const originalType = file.type;
    
    // Normalize problematic MIME types for audio
    if (originalType === 'audio/x-wav' || fileName.endsWith('.wav')) {
      return 'audio/wav';
    }
    
    if (originalType === 'audio/x-m4a' || fileName.endsWith('.m4a')) {
      return 'audio/mp4';
    }
    
    if (originalType === 'audio/x-flac' || originalType === 'application/x-flac' || fileName.endsWith('.flac')) {
      return 'audio/flac';
    }
    
    // Normalize problematic MIME types for video
    if (originalType === 'video/x-msvideo' || fileName.endsWith('.avi')) {
      return 'video/avi';
    }
    
    if (originalType === 'video/quicktime' || fileName.endsWith('.mov')) {
      return 'video/mov';
    }
    
    return originalType;
  }

  private static validateAudioFile(file: File): boolean {
    const normalizedMimeType = this.normalizeMimeType(file);
    
    // Accept common audio MIME types
    const validMimeTypes = [
      'audio/mpeg',      // .mp3
      'audio/wav',       // .wav (normalized)
      'audio/wave',      // .wav (alternative)
      'audio/ogg',       // .ogg
      'audio/vorbis',    // .ogg (alternative)
      'audio/mp4',       // .m4a (normalized)
      'audio/aac',       // .aac
      'audio/flac',      // .flac
      'audio/x-flac',    // .flac (alternative)
      'application/x-flac', // .flac (another alternative)
      'audio/webm'       // .webm audio
    ];

    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    console.log(`🎵 Validating audio file: ${file.name}`);
    console.log(`📋 Original MIME type: ${file.type}`);
    console.log(`📋 Normalized MIME type: ${normalizedMimeType}`);
    console.log(`📁 Extension: ${fileExtension}`);
    
    // Check both normalized MIME type and file extension
    const isValidMime = validMimeTypes.includes(normalizedMimeType);
    const isValidExtension = validExtensions.includes(fileExtension);
    
    if (isValidMime || isValidExtension) {
      console.log(`✅ Audio file validation passed`);
      return true;
    }
    
    console.log(`❌ Audio file validation failed`);
    console.log(`❌ Valid MIME types:`, validMimeTypes);
    console.log(`❌ Valid extensions:`, validExtensions);
    return false;
  }

  private static validateVideoFile(file: File): boolean {
    const normalizedMimeType = this.normalizeMimeType(file);
    
    // Accept common video MIME types
    const validMimeTypes = [
      'video/mp4',       // .mp4
      'video/webm',      // .webm
      'video/mov',       // .mov
      'video/quicktime', // .mov (alternative)
      'video/avi',       // .avi
      'video/ogg'        // .ogv
    ];

    const validExtensions = ['.mp4', '.webm', '.mov', '.avi', '.ogv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    console.log(`🎬 Validating video file: ${file.name}`);
    console.log(`📋 Original MIME type: ${file.type}`);
    console.log(`📋 Normalized MIME type: ${normalizedMimeType}`);
    console.log(`📁 Extension: ${fileExtension}`);
    
    // Check both normalized MIME type and file extension
    const isValidMime = validMimeTypes.includes(normalizedMimeType);
    const isValidExtension = validExtensions.includes(fileExtension);
    
    if (isValidMime || isValidExtension) {
      console.log(`✅ Video file validation passed`);
      return true;
    }
    
    console.log(`❌ Video file validation failed`);
    console.log(`❌ Valid MIME types:`, validMimeTypes);
    console.log(`❌ Valid extensions:`, validExtensions);
    return false;
  }

  private static async compressAudioIfNeeded(file: File): Promise<File> {
    // For files larger than 250MB, we should consider compression
    const maxSizeBeforeCompression = 250 * 1024 * 1024; // 250MB
    
    if (file.size > maxSizeBeforeCompression) {
      console.log(`🗜️ File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds threshold, considering compression`);
      // For now, just return the original file
      // In the future, we could implement audio compression here
    }
    
    return file;
  }

  private static async compressVideoIfNeeded(file: File): Promise<File> {
    // For files larger than 250MB, we should consider compression
    const maxSizeBeforeCompression = 250 * 1024 * 1024; // 250MB
    
    if (file.size > maxSizeBeforeCompression) {
      console.log(`🗜️ Video file size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds threshold, considering compression`);
      // For now, just return the original file
      // In the future, we could implement video compression here
    }
    
    return file;
  }

  static async uploadFile(
    file: File, 
    type: "image" | "audio" | "video" | "avatar",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      const bucketName = this.getBucketName(type);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: "Authentication required to upload files"
        };
      }

      // Special validation and processing for audio files
      if (type === 'audio') {
        if (!this.validateAudioFile(file)) {
          return {
            success: false,
            error: "Invalid audio file format. Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC, WebM"
          };
        }
        
        // Compress if needed
        file = await this.compressAudioIfNeeded(file);
      }

      // Special validation and processing for video files
      if (type === 'video') {
        if (!this.validateVideoFile(file)) {
          return {
            success: false,
            error: "Invalid video file format. Supported formats: MP4, WebM, MOV, AVI, OGV"
          };
        }
        
        // Compress if needed
        file = await this.compressVideoIfNeeded(file);
      }

      // Generate unique file name
      const fileName = this.generateFileName(file.name, user.id);

      console.log(`📤 Uploading ${type} file: ${file.name} (${file.type}) to ${bucketName}/${fileName}`);

      // Create a new File object with normalized MIME type for audio/video
      let uploadFile = file;
      if (type === 'audio' || type === 'video') {
        const normalizedType = this.normalizeMimeType(file);
        if (normalizedType !== file.type) {
          console.log(`🔄 Normalizing MIME type from ${file.type} to ${normalizedType}`);
          uploadFile = new File([file], file.name, { type: normalizedType });
        }
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: uploadFile.type
        });

      if (error) {
        console.error('Upload error:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log(`✅ File uploaded successfully: ${publicUrl}`);

      return {
        success: true,
        url: publicUrl,
        path: fileName
      };

    } catch (error) {
      console.error('File upload service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error'
      };
    }
  }

  static async deleteFile(
    path: string, 
    type: "image" | "audio" | "video" | "avatar"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const bucketName = this.getBucketName(type);
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log(`✅ File deleted successfully: ${path}`);
      return { success: true };

    } catch (error) {
      console.error('File delete service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown delete error'
      };
    }
  }

  static async replaceFile(
    oldPath: string,
    newFile: File,
    type: "image" | "audio" | "video" | "avatar",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Upload new file first
      const uploadResult = await this.uploadFile(newFile, type, onProgress);
      
      if (!uploadResult.success) {
        return uploadResult;
      }

      // Delete old file
      await this.deleteFile(oldPath, type);

      return uploadResult;

    } catch (error) {
      console.error('File replace service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown replace error'
      };
    }
  }
}
