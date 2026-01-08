import { useState, useRef, DragEvent } from "react";
import { X, Music, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface FileMetadata {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface FileInputProps {
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFileSize?: number; // in MB 10
  onUploadComplete?: (files: FileMetadata[]) => void;
  onError?: (error: string) => void;
  className?: string;
  initialFiles?: string[];
}

interface FileWithProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

const isImageType = (type: string) => type.startsWith("image/");
const isAudioType = (type: string) => type.startsWith("audio/");
const isPDFType = (type: string) => type === "application/pdf";

const FileTypeIcon = ({ file }: { file: File }) => {
  //console.log("file", file);
  if (isAudioType(file.type)) {
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg">
        <Music className="w-6 h-6 text-purple-500" />
      </div>
    );
  }
  if (isPDFType(file.type)) {
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-lg">
        <FileText className="w-6 h-6 text-red-500" />
      </div>
    );
  }
  return null;
};

const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "mp3":
    case "wav":
      return "audio/mpeg";
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export function FileInput({
  multiple = false,
  accept = "*/*",
  maxSize = 5,
  maxFileSize = 50, // default 50MB per file
  onUploadComplete,
  onError,
  className,
  initialFiles = [],
}: FileInputProps) {
 // console.log({ maxSize });
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>(() =>
    initialFiles.map((url) => {
      const filename = url.split("/").pop() || "file";
      const type = getFileTypeFromUrl(url);
      // Create a blob with some content to give it a size
      const blob = new Blob([""], { type });
      const file = new File([blob], filename, {
        type,
        lastModified: Date.now(),
      });
      return {
        file,
        progress: 100,
        url,
      };
    })
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const removeFile = (fileToRemove: FileWithProgress) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file));
    // Get remaining files and notify parent
    const remainingFiles = files
      .filter((f) => f.file !== fileToRemove.file && f.url)
      .map((f) => ({
        url: f.url as string,
        name: f.file.name,
        size: f.file.size,
        type: f.file.type,
        lastModified: f.file.lastModified,
      }));
    onUploadComplete?.(remainingFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";

    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      const kb = bytes / 1024;
      return kb < 10 ? `${kb.toFixed(2)} KB` : `${Math.round(kb)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      const mb = bytes / (1024 * 1024);
      return mb < 10 ? `${mb.toFixed(2)} MB` : `${Math.round(mb)} MB`;
    } else {
      const gb = bytes / (1024 * 1024 * 1024);
      return gb < 10 ? `${gb.toFixed(2)} GB` : `${Math.round(gb)} GB`;
    }
  };
  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB`;
    }
    if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB`;
    }
    if (
      accept !== "*/*" &&
      !accept.split(",").some((type) => file.type.match(type))
    ) {
      return "File type not accepted";
    }
    return null;
  };
  // Use environment variables for Cloudinary configuration
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleFiles = async (newFiles: FileList) => {
    // Debug: Logging incoming files for debugging
   // console.log("Debug: Starting upload process for files:", newFiles);
    const filesToUpload = Array.from(newFiles).map((file) => ({
      file,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...filesToUpload]);

    for (const fileData of filesToUpload) {
      const error = validateFile(fileData.file);
      if (error) {
        onError?.(error);
        setFiles((prev) =>
          prev.map((f) => (f.file === fileData.file ? { ...f, error } : f))
        );
        continue;
      }
      try {
        // Debug: Attempting file upload to Cloudinary
       // console.log(
        //   "Debug: Attempting upload for file:",
        //   fileData.file.name,
        //   "Size:",
        //   formatFileSize(fileData.file.size)
        // );
        // Initialize progress at 0
        let currentProgress = 0;

        // Create a more predictable progress simulation
        const progressInterval = setInterval(
          () => {
            // Increment by 1 until 90%
            if (currentProgress < 90) {
              currentProgress += Math.min(
                5,
                Math.max(1, Math.floor(fileData.file.size / (1024 * 1024)))
              );
              if (currentProgress > 90) currentProgress = 90;

              setFiles((prev) =>
                prev.map((f) =>
                  f.file === fileData.file
                    ? { ...f, progress: currentProgress }
                    : f
                )
              );
            }
          },
          fileData.file.size > 1024 * 1024 ? 200 : 100
        ); // Adjust interval based on file size// SIMPLIFIED DIRECT UPLOAD - using unsigned upload
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("upload_preset", "yq52t7yn"); // Your unsigned upload preset

        // Add folder structure to better organize uploads
        formData.append("folder", "blog_images");

        // API endpoint for Cloudinary upload - note we're using 'auto' for automatic resource type detection
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

       // console.log(
        //   "Debug: Starting upload with preset 'yq52t7yn' to:",
        //   uploadUrl
        // );

        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Debug: Upload response error:", errorData);

          // Extract more detailed error message if available
          let errorMessage = "Upload failed";
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.error) {
            errorMessage =
              typeof errorData.error === "string"
                ? errorData.error
                : JSON.stringify(errorData.error);
          } else if (res.statusText) {
            errorMessage = `Upload failed: ${res.statusText}`;
          }

          throw new Error(errorMessage);
        }

        const data = await res.json();
       // console.log("Debug: Upload successful, response:", data);
        clearInterval(progressInterval);

        // Set to 100% when complete
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileData.file
              ? {
                ...f,
                url: data.secure_url,
                progress: 100,
              }
              : f
          )
        );

        const completedFiles = files
          .filter((f) => f.url)
          .map((f) => ({
            url: f.url as string,
            name: f.file.name,
            size: f.file.size,
            type: f.file.type,
            lastModified: f.file.lastModified,
          }));

        const newFileMetadata: FileMetadata = {
          url: data.secure_url,
          name: fileData.file.name,
          size: fileData.file.size,
          type: fileData.file.type,
          lastModified: fileData.file.lastModified,
        };

        onUploadComplete?.([...completedFiles, newFileMetadata]);
      } catch (err) {
        // Debug: File upload error
        console.error("Debug: Upload failed with error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileData.file
              ? { ...f, error: errorMessage, progress: 0 }
              : f
          )
        );
        onError?.(errorMessage);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  //console.log({files})

  return (
    <div className="space-y-4">
      <div
        className={` border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${className} ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <p>Drag and drop files here, or click to select files</p>
        <p className="text-sm text-gray-500">
          {multiple
            ? `Upload multiple files `
            : `Upload a file , max size ${maxFileSize}
          mb`}
          {accept !== "*/*" && ` (${accept})`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {" "}
                {isImageType(file.file.type) && file.url ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 relative">
                    <img
                      src={file.url}
                      alt={file.file.name}
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <FileTypeIcon file={file.file} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium truncate">{file.file.name}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{formatFileSize(file.file.size)}</span>
                        <span>•</span>
                        <span>{file.file.type || "Unknown type"}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {file.progress < 100 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`  h-full transition-all duration-300
                              ${file.error ? "bg-red-500" : "bg-blue-500"}`}
                              style={{
                                width: `${Math.min(
                                  Math.round(file.progress),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[3ch]">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {file.error && (
                    <p className="text-sm text-red-500 mt-2">{file.error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
