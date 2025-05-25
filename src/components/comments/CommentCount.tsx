"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommentCountProps {
  blogId: string;
  onViewCommentsClick?: () => void;
}

const CommentCount: React.FC<CommentCountProps> = ({
  blogId,
  onViewCommentsClick,
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        // Use the Firestore collection count to get the comment count
        const response = await fetch(`/api/comments/count?blogId=${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comment count");
        }

        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching comment count:", error);
        // Just set to 0 instead of showing an error
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentCount();
  }, [blogId]);

  const handleClick = () => {
    if (onViewCommentsClick) {
      onViewCommentsClick();
    } else {
      // Default behavior: scroll to comments section
      const commentsSection = document.getElementById("comments-section");
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
      aria-label={`View ${count} comments`}
    >
      <MessageSquare className="h-4 w-4" />
      <span className="text-sm">
        {count} {count === 1 ? "comment" : "comments"}
      </span>
    </button>
  );
};

export default CommentCount;
