"use client";

import { useState } from "react";
import { FileCategory } from "@/lib/file-validation";

interface UnsupportedFileModalProps {
  isOpen: boolean;
  fileName: string;
  fileType: FileCategory;
  onClose: () => void;
}

export function UnsupportedFileModal({
  isOpen,
  fileName,
  fileType,
  onClose,
}: UnsupportedFileModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (fileType) {
      case "audio":
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3.5m12 3.5V9m0 0l-6-6m6 6l6-6"
            />
          </svg>
        );
      case "video":
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4v2m0 5v1m-8.5-5h17"
            />
          </svg>
        );
    }
  };

  const getMessage = () => {
    switch (fileType) {
      case "audio":
        return "Audio files are not supported at this time.";
      case "video":
        return "Video files are not supported at this time.";
      default:
        return "This file type is not supported.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-sm w-full mx-4 p-6">
        <div className="flex justify-center mb-4 text-destructive">
          {getIcon()}
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          File Not Supported
        </h2>

        <p className="text-center text-sm text-muted-foreground mb-4">
          {getMessage()}
        </p>

        <p className="text-center text-xs text-muted-foreground mb-6 bg-secondary/50 rounded p-3">
          <span className="font-semibold">Supported formats:</span> Images
          (JPEG, PNG, GIF, WebP, SVG) and Text files (TXT, MD, PDF)
        </p>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
