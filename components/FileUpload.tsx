import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  id: string;
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  value?: FileList | null;
  onChange: (files: FileList | null) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  name,
  label,
  accept = "image/*",
  multiple = true,
  maxFiles = 5,
  maxFileSize = 5, // 5MB default
  value,
  onChange,
  error,
  className = "",
  required = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert FileList to File array for easier manipulation
  React.useEffect(() => {
    if (value) {
      setSelectedFiles(Array.from(value));
    } else {
      setSelectedFiles([]);
    }
  }, [value]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`;
    }

    // Check file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return `File "${file.name}" is not a valid image file.`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    // Check total file count
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
      return;
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Combine with existing files
    const newFiles = [...selectedFiles, ...validFiles];
    
    // Create new FileList-like object
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));
    
    onChange(dt.files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    
    if (newFiles.length === 0) {
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      const dt = new DataTransfer();
      newFiles.forEach(file => dt.items.add(file));
      onChange(dt.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-secondary-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-secondary-300 bg-secondary-50 hover:border-primary-400 hover:bg-primary-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={name}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          required={required && selectedFiles.length === 0}
        />
        
        <div className="space-y-3">
          <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-secondary-400'}`} />
          <div>
            <p className="text-sm font-medium text-secondary-700">
              {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              {accept.includes('image') ? 'Images only' : 'Files'} • Max {maxFileSize}MB each • Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-700">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white border border-secondary-200 rounded-md">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <PhotoIcon className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-700 truncate">{file.name}</p>
                    <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-2 p-1 text-secondary-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
