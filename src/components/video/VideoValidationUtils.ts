export interface VideoValidationResult {
  isValid: boolean;
  error?: string;
  normalizedMimeType?: string;
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
}

export class VideoValidationUtils {
  private static readonly VALID_MIME_TYPES = [
    'video/mp4',       // .mp4
    'video/webm',      // .webm
    'video/mov',       // .mov
    'video/quicktime', // .mov (alternative)
    'video/avi',       // .avi
    'video/x-msvideo', // .avi (alternative)
    'video/ogg'        // .ogv
  ];

  private static readonly VALID_EXTENSIONS = [
    '.mp4', '.webm', '.mov', '.avi', '.ogv'
  ];

  private static readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

  static validateVideoUrl(url?: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
    
    // Check for valid video file extensions
    const hasValidExtension = this.VALID_EXTENSIONS.some(ext => 
      trimmed.toLowerCase().includes(ext)
    );
    
    // Check for valid URL format
    const isValidUrl = trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:');
    
    return hasValidExtension || isValidUrl;
  }

  static formatVideoUrl(url: string): string {
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return encodeURI(url);
  }

  static normalizeMimeType(originalType: string, fileName: string): string {
    const lowerFileName = fileName.toLowerCase();
    
    // Handle problematic MIME types
    if (originalType === 'video/x-msvideo' || lowerFileName.endsWith('.avi')) {
      return 'video/avi';
    }
    
    if (originalType === 'video/quicktime' || lowerFileName.endsWith('.mov')) {
      return 'video/mov';
    }
    
    return originalType;
  }

  static validateVideoFile(file: File): VideoValidationResult {
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const normalizedMimeType = this.normalizeMimeType(file.type, file.name);
    
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      extension: fileExtension
    };

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 500MB`,
        fileInfo
      };
    }

    // Check MIME type and extension
    const isValidMime = this.VALID_MIME_TYPES.includes(normalizedMimeType);
    const isValidExtension = this.VALID_EXTENSIONS.includes(fileExtension);

    if (!isValidMime && !isValidExtension) {
      return {
        isValid: false,
        error: `Unsupported video format. Supported formats: ${this.VALID_EXTENSIONS.join(', ')}`,
        fileInfo
      };
    }

    return {
      isValid: true,
      normalizedMimeType,
      fileInfo
    };
  }

  static getVideoFileInfo(file: File) {
    const validation = this.validateVideoFile(file);
    return {
      ...validation.fileInfo,
      isValid: validation.isValid,
      error: validation.error,
      normalizedMimeType: validation.normalizedMimeType,
      sizeFormatted: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };
  }
}
