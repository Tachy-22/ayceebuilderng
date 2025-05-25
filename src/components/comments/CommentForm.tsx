"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addComment } from "@/app/actions/comments";
import { CommentT } from "@/lib/types/blog";
import {
  getUserIP,
  generateRandomName,
  generateUserIdentifier,
} from "@/lib/userIdentification";

interface CommentFormProps {
  blogId: string;
  parentId?: string;
  onSubmit: (comment: CommentT) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  blogId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  submitLabel = "Submit",
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userName, setUserName] = useState("");
  const { toast } = useToast();

  // Set up user identity based on IP
  useEffect(() => {
    const setupUserIdentity = async () => {
      const ip = await getUserIP();
      const identifier = generateUserIdentifier(ip);
      setUserIdentifier(identifier);

      // If we already have a stored name for this user, use it
      const storedName = localStorage.getItem(`user_name_${identifier}`);
      if (storedName) {
        setUserName(storedName);
      } else {
        // Otherwise generate a new random name
        const randomName = generateRandomName();
        setUserName(randomName);
        localStorage.setItem(`user_name_${identifier}`, randomName);
      }
    };

    setupUserIdentity();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addComment(
        blogId,
        content,
        userName,          // Use the generated username
        userIdentifier,    // Use the user identifier as email (won't be displayed)
        userIdentifier,    // Use the same identifier as visitorId
        parentId
      );

      if (result.success && result.comment) {
        // Clear the form
        setContent("");

        // Notify parent component
        onSubmit(result.comment);

        toast({
          title: "Comment submitted",
          description: "Your comment has been posted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to submit comment",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {userName && (
          <div className="text-sm text-gray-500 mb-2">
            Posting anonymously as{" "}
            <span className="font-medium">{userName}</span>
         
          </div>
        )}
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !userName}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
