"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getComments } from "@/app/actions/comments";
import { getVisitorId } from "@/lib/visitorId";
import { CommentT } from "@/lib/types/blog";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface CommentsListProps {
  blogId: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ blogId }) => {
  const [comments, setComments] = useState<CommentT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchComments = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsRefreshing(true);
      try {
        const commentsData = await getComments(blogId);
        setComments(commentsData);
        setLastRefreshed(new Date());
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load comments. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [blogId, toast]
  );
  useEffect(() => {
    fetchComments();

    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(() => {
      fetchComments(false); // Don't show loading state for auto-refresh
    }, 60000);

    // Set up the visitor ID for identifying user's comments
    const visitorId = getVisitorId();

    return () => clearInterval(refreshInterval);
  }, [fetchComments]);

  // Process comments to organize into parent-child relationships
  const rootComments = comments.filter((comment) => !comment.parentId);

  // Group replies by parent comment
  const getReplies = (parentId: string) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  // Handle adding a new comment
  const handleAddComment = (newComment: CommentT) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  // Handle adding a reply
  const handleAddReply = (parentId: string, reply: CommentT) => {
    setComments((prevComments) => [...prevComments, reply]);
  };
  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    // Find the comment and its replies
    const commentToDelete = comments.find((c) => c.id === commentId);

    // If no comment found, do nothing
    if (!commentToDelete) return;

    // Get all reply IDs to this comment
    const replyIds = comments
      .filter((c) => c.parentId === commentId)
      .map((c) => c.id);

    // Create an array of IDs to remove (the comment and all its replies)
    const idsToRemove = [commentId, ...replyIds];

    // Remove the comment and any replies from the state
    setComments((prevComments) =>
      prevComments.filter((comment) => !idsToRemove.includes(comment.id))
    );

    // Show a toast message
    toast({
      title: "Comment deleted",
      description: `Comment ${
        replyIds.length > 0 ? "and all replies have" : "has"
      } been removed.`,
    });
  };

  // Handle liking a comment
  const handleLikeComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          // Toggle like state
          const newLikeCount = likedComments.has(commentId)
            ? comment.likes - 1
            : comment.likes + 1;

          return { ...comment, likes: newLikeCount };
        }
        return comment;
      })
    );

    // Update liked comments set
    setLikedComments((prevLiked) => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId);
      } else {
        newLiked.add(commentId);
      }
      return newLiked;
    });
  };

  if (isLoading) {
    return <div className="my-8 text-center py-10">Loading comments...</div>;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchComments()}
          disabled={isRefreshing}
          className="text-gray-500 hover:text-primary"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {lastRefreshed && (
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </p>
      )}

      {/* Comment form */}
      <div className="mb-8">
        <CommentForm
          blogId={blogId}
          onSubmit={handleAddComment}
          placeholder="Share your thoughts..."
          submitLabel="Post Comment"
        />
      </div>

      {/* Comments list */}
      {rootComments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-lg">
          Be the first to comment on this post!
        </div>
      ) : (
        <div className="space-y-6">
          {rootComments.map((comment) => {
            // Parse date properly regardless of whether it's a string or Date
            const commentDate =
              typeof comment.createdAt === "string"
                ? new Date(comment.createdAt)
                : comment.createdAt;

            return (
              <Comment
                key={comment.id}
                comment={comment}
                replies={getReplies(comment.id)}
                onReply={handleAddReply}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
                likedComments={likedComments}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
