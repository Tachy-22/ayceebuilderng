"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Reply, Trash, MoreHorizontal } from "lucide-react";
import { CommentT } from "@/lib/types/blog";
import { getVisitorId } from "@/lib/visitorId";
import { likeComment, deleteComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import { useToast } from "@/hooks/use-toast";

interface CommentProps {
  comment: CommentT;
  replies?: CommentT[];
  onReply: (parentId: string, comment: CommentT) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  likedComments: Set<string>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  replies = [],
  onReply,
  onDelete,
  onLike,
  likedComments,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { toast } = useToast();
  const visitorId = getVisitorId();
  const isAuthor = comment.visitorId === visitorId;
  const isLiked = likedComments.has(comment.id);

  const handleSubmitReply = async (
    content: string,
    author: string,
    email: string
  ) => {
    try {
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post your reply. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteComment(comment.id, visitorId);
      if (result.success) {
        onDelete(comment.id);
        toast({
          title: "Comment deleted",
          description: "Your comment has been removed.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete comment",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    }
  };

  const handleLike = async () => {
    try {
      await likeComment(comment.id, visitorId);
      onLike(comment.id);
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like comment. Please try again.",
      });
    }
  };

  const formattedDate = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-medium">{comment.userName}</div>
            <div className="text-xs text-gray-500">{formattedDate}</div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>{" "}
        <div className="text-gray-800 mb-3 whitespace-pre-wrap">
          {comment.content}
        </div>
        <div className="flex gap-4 text-xs text-gray-600">
          <LikeButton
            isLiked={isLiked}
            count={comment.likes || 0}
            onLike={handleLike}
            size="sm"
          />
          <button
            className="flex items-center gap-1"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <Reply className="h-4 w-4" />
            Reply
          </button>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-2 pl-6">
          <CommentForm
            blogId={comment.blogId}
            parentId={comment.id}
            onSubmit={(newComment) => {
              onReply(comment.id, newComment);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            submitLabel="Reply"
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="pl-6 mt-2 space-y-3">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              likedComments={likedComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
