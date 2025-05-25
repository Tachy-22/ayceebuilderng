"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { CommentT } from "@/lib/types/blog";
import { formatDistanceToNow } from "date-fns";
import { getComments } from "@/app/actions/comments";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface FeaturedCommentsProps {
  blogId: string;
  maxComments?: number;
}

const FeaturedComments: React.FC<FeaturedCommentsProps> = ({
  blogId,
  maxComments = 2,
}) => {
  const [comments, setComments] = useState<CommentT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopComments = async () => {
      try {
        const allComments = await getComments(blogId);

        // Filter to only root comments (not replies)
        const rootComments = allComments.filter((c) => !c.parentId);

        // Sort by likes and limit to maxComments
        const topComments = rootComments
          .sort((a, b) => b.likes - a.likes)
          .slice(0, maxComments);

        setComments(topComments);
      } catch (error) {
        console.error("Error fetching featured comments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load featured comments.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopComments();
  }, [blogId, maxComments, toast]);

  if (isLoading) {
    return (
      <div className="animate-pulse h-20 w-full bg-gray-100 rounded-lg"></div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <MessageSquare className="h-4 w-4 mr-1" />
        Featured Comments
      </h4>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-gray-700 line-clamp-2">{comment.content}</p>
          </div>
        ))}
        <Link
          href={`/blog/${blogId}#comments-section`}
          className="text-primary text-xs hover:underline block mt-2"
        >
          View all comments
        </Link>
      </div>
    </div>
  );
};

export default FeaturedComments;
