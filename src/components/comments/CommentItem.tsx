"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageCircle, ThumbsUp, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentT } from "@/lib/types/blog";
import CommentForm from "./CommentForm";
import { cn } from "@/lib/utils";
import {
  getInitials,
  getColorFromString,
  getUserIP,
  generateUserIdentifier,
} from "@/lib/userIdentification";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommentItemProps {
  comment: CommentT;
  replies: CommentT[];
  onReply: (parentId: string, reply: CommentT) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  likedComments: Set<string>;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  onReply,
  onDelete,
  onLike,
  likedComments,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
  const maxDepth = 3; // Maximum nesting level for replies

  // Get user identifier on component mount
  React.useEffect(() => {
    const getIdentifier = async () => {
      const ip = await getUserIP();
      const identifier = generateUserIdentifier(ip);
      setUserIdentifier(identifier);
    };

    getIdentifier();
  }, []);

  // Parse date properly
  const commentDate =
    typeof comment.createdAt === "string"
      ? new Date(comment.createdAt)
      : comment.createdAt;

  const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true });
  const isOwnComment = userIdentifier === comment.userId;
  const isLiked = likedComments.has(comment.id);

  // Get background color for avatar based on username
  const bgColor = getColorFromString(comment.userName);
  const initials = getInitials(comment.userName);

  const handleReply = (reply: CommentT) => {
    onReply(comment.id, reply);
    setShowReplyForm(false);
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-sm bg-white/80 backdrop-blur-sm",
        depth > 0 && "ml-6 md:ml-12 mt-4"
      )}
    >
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start space-y-0">
        <Avatar
          className="h-10 w-10 mr-3 ring-2 ring-white shadow-sm"
          style={{ backgroundColor: bgColor }}
        >
          <AvatarFallback className="text-black font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center w-full">
            <div className="font-semibold">{comment.userName}</div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
          {isOwnComment && (
            <Badge className="w-fit text-xs px-2 py-0 mt-1 text-white">
              You
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-4 ml-[52px]">
        <div className="text-gray-800 whitespace-pre-line">
          {comment.content}
        </div>
      </CardContent>

      <CardFooter className="px-4 pt-0 pb-3 ml-[52px] flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-gray-500 hover:text-primary",
              isLiked && "text-primary"
            )}
            onClick={() => onLike(comment.id)}
          >
            <ThumbsUp
              className={cn("h-4 w-4 mr-1", isLiked ? "fill-primary" : "")}
            />
            <span className="text-xs">{comment.likes || 0}</span>
          </Button>

          {depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-primary"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          )}
        </div>

        {isOwnComment && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-red-500"
            onClick={() => onDelete(comment.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Delete</span>
          </Button>
        )}
      </CardFooter>

      {/* Reply form */}
      {showReplyForm && (
        <div className="px-4 pb-4 ml-[52px]">
          <div className="bg-gray-50 rounded-lg p-3">
            <CommentForm
              blogId={comment.blogId}
              parentId={comment.id}
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              submitLabel="Reply"
            />
          </div>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="pb-1">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]} // Nested replies are not supported yet
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              likedComments={likedComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentItem;
