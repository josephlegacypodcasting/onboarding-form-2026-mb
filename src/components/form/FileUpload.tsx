import { useCallback } from "react";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types/form";

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  isUploading: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

const FileUpload = ({
  files,
  onFilesChange,
  isUploading,
  maxFiles = 5,
  maxSizeMB = 100,
}: FileUploadProps) => {
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      const validFiles = selectedFiles
        .filter((file) => file.size <= maxSizeBytes)
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          name: file.name,
          size: file.size,
          file,
        }));

      onFilesChange([...files, ...validFiles]);
      e.target.value = "";
    },
    [files, maxFiles, maxSizeMB, onFilesChange]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
    },
    [files, onFilesChange]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || files.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center ${
            files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          <span className="text-sm text-muted-foreground">
            {isUploading
              ? "Uploading..."
              : files.length >= maxFiles
              ? "Maximum files reached"
              : "Click to upload or drag and drop"}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Max {maxSizeMB}MB per file
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
