"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onLike: () => Promise<void>;
  size?: "sm" | "md" | "lg";
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  count,
  onLike,
  size = "md",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await onLike();
    } catch (error) {
      console.error("Error liking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your like. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate sizes based on the size prop
  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <button
      className={`flex items-center gap-1 transition-colors ${
        isLiked ? "text-red-500" : "text-gray-600 hover:text-red-400"
      } ${isProcessing ? "opacity-70" : ""}`}
      onClick={handleClick}
      disabled={isProcessing}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart
        className={`${iconSize} ${
          isLiked ? "fill-red-500" : ""
        } transition-all ${isProcessing ? "animate-pulse" : ""}`}
      />
      {count > 0 && <span className={textSize}>{count}</span>}
    </button>
  );
};

export default LikeButton;
