
export interface AudioValidationResult {
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

export class AudioValidationUtils {
  private static readonly VALID_MIME_TYPES = [
    'audio/mpeg',      // .mp3
    'audio/wav',       // .wav
    'audio/wave',      // .wav (alternative)
    'audio/ogg',       // .ogg
    'audio/vorbis',    // .ogg (alternative)
    'audio/mp4',       // .m4a
    'audio/aac',       // .aac
    'audio/flac',      // .flac
    'audio/x-flac',    // .flac (alternative)
    'application/x-flac', // .flac (another alternative)
    'audio/webm'       // .webm audio
  ];

  private static readonly VALID_EXTENSIONS = [
    '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'
  ];

  private static readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

  static validateAudioUrl(url?: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
    
    // Check for valid audio file extensions
    const hasValidExtension = this.VALID_EXTENSIONS.some(ext => 
      trimmed.toLowerCase().includes(ext)
    );
    
    // Check for valid URL format
    const isValidUrl = trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:');
    
    return hasValidExtension || isValidUrl;
  }

  static formatAudioUrl(url: string): string {
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return encodeURI(url);
  }

  static normalizeMimeType(originalType: string, fileName: string): string {
    const lowerFileName = fileName.toLowerCase();
    
    // Handle problematic MIME types
    if (originalType === 'audio/x-wav' || lowerFileName.endsWith('.wav')) {
      return 'audio/wav';
    }
    
    if (originalType === 'audio/x-m4a' || lowerFileName.endsWith('.m4a')) {
      return 'audio/mp4';
    }
    
    if (originalType === 'audio/x-flac' || originalType === 'application/x-flac' || lowerFileName.endsWith('.flac')) {
      return 'audio/flac';
    }
    
    return originalType;
  }

  static validateAudioFile(file: File): AudioValidationResult {
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
        error: `Unsupported audio format. Supported formats: ${this.VALID_EXTENSIONS.join(', ')}`,
        fileInfo
      };
    }

    return {
      isValid: true,
      normalizedMimeType,
      fileInfo
    };
  }

  static getAudioFileInfo(file: File) {
    const validation = this.validateAudioFile(file);
    return {
      ...validation.fileInfo,
      isValid: validation.isValid,
      error: validation.error,
      normalizedMimeType: validation.normalizedMimeType,
      sizeFormatted: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };
  }
}
