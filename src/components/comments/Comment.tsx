"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Reply,
  Trash,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import { useToast } from "@/hooks/use-toast";
import { getUserIP, generateUserIdentifier } from "@/lib/userIdentification";

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
  const [userIdentifier, setUserIdentifier] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Default to hiding replies
  const [showReplies, setShowReplies] = useState(false);
  // Animation states
  const [replyAnimationClass, setReplyAnimationClass] = useState("");
  const { toast } = useToast();
  const visitorId = getVisitorId();
  // Fetch the user's IP-based identifier
  useEffect(() => {
    const setupUserIdentity = async () => {
      try {
        // First check if we already have the IP-based ID stored
        const storedId = localStorage.getItem("ip_based_id");
        if (storedId) {
          setUserIdentifier(storedId);
          return;
        }

        // If not, generate it fresh
        const ip = await getUserIP();
        const identifier = generateUserIdentifier(ip);
        setUserIdentifier(identifier);

        // Store it for future use
        localStorage.setItem("ip_based_id", identifier);
      } catch (error) {
        console.error("Error setting up user identity:", error);
      }
    };

    setupUserIdentity();
  }, []);
  // Check if user is the author using either visitorId or userId
  const isAuthor =
    comment.visitorId === visitorId ||
    comment.userId === visitorId ||
    (userIdentifier && comment.userId === userIdentifier) ||
    (userIdentifier && comment.visitorId === userIdentifier);

  const isLiked = likedComments.has(comment.id);
  const handleSubmitReply = async (newComment: CommentT) => {
    try {
      onReply(comment.id, newComment);
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
    setIsDeleting(true);
    try {
      // Add fade-out animation before actual deletion
      const commentElement = document.getElementById(`comment-${comment.id}`);
      if (commentElement) {
        commentElement.classList.add("comment-fade-out");
        // Wait for animation to complete
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Log the IDs for debugging
      console.log("Deleting comment with following IDs:");
      console.log("Comment visitorId:", comment.visitorId);
      console.log("Comment userId:", comment.userId);
      console.log("Current visitorId:", visitorId);
      console.log("Current userIdentifier:", userIdentifier);

      // Try to delete using both IDs
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
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
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
    : ""; // Handle animation when showReplies changes
  useEffect(() => {
    if (replies.length > 0) {
      if (showReplies) {
        // When showing replies, add the expand animation class
        setReplyAnimationClass("replies-expand");
      } else if (replyAnimationClass === "replies-expand") {
        // Only start collapse animation if the element was previously expanded
        setReplyAnimationClass("replies-collapse");

        // Set a timeout to clean up the animation class after it completes
        const timer = setTimeout(() => {
          // We keep the class but the display:none will hide it
          setReplyAnimationClass("");
        }, 300); // 300ms matches the animation duration

        return () => clearTimeout(timer);
      }
    }
  }, [showReplies, replies.length, replyAnimationClass]);

  return (
    <div className="mb-6" id={`comment-${comment.id}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        {" "}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-medium flex items-center">
              {comment.author}
              {isAuthor && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
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
                {" "}
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
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
        </div>{" "}
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

          {/* Show replies toggle button (only if there are replies) */}
          {replies.length > 0 && (
            <button
              className="flex items-center gap-1 text-green-500"
              onClick={() => setShowReplies(!showReplies)}
            >
              <span className="flex items-center">
                {showReplies ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
                {" replies "}
                <span className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {replies.length}
                </span>
              </span>
            </button>
          )}

          {/* Show delete button directly in the actions for easier access */}
          {isAuthor && (
            <button
              className="flex items-center gap-1 text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>{" "}
      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-2 pl-6">
          <CommentForm
            blogId={comment.blogId}
            parentId={comment.id}
            onSubmit={(newComment) => {
              onReply(comment.id, newComment);
              setShowReplyForm(false);
              // Automatically show replies when a new reply is added
              setShowReplies(true);
            }}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            submitLabel="Reply"
          />
        </div>
      )}{" "}
      {/* Replies - only show when showReplies is true */}
      {replies.length > 0 && (
        <div
          className={`pl-6 mt-2 space-y-3 border-l-2 border-gray-100 ${replyAnimationClass}`}
          style={{ display: showReplies ? "block" : "none" }}
        >
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
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Comment;
