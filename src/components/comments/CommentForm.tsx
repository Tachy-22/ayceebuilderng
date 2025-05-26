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
import { getVisitorId } from "@/lib/visitorId";
import RefreshNameButton from "./RefreshNameButton";

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
  const { toast } = useToast(); // Set up user identity based on IP
  useEffect(() => {
    const setupUserIdentity = async () => {
      try {
        // Get the visitor ID using the shared function
        const visitorId = getVisitorId();
        setUserIdentifier(visitorId);

        // Make sure the visitor_id and ip_based_id are in sync
        localStorage.setItem("ip_based_id", visitorId);

        // If we already have a stored name for this user, use it
        const storedName = localStorage.getItem(`user_name_${visitorId}`);
        if (storedName) {
          setUserName(storedName);
          return;
        }

        // Generate a new random name if we don't have one
        const randomName = generateRandomName();
        setUserName(randomName);
        localStorage.setItem(`user_name_${visitorId}`, randomName);
      } catch (error) {
        console.error("Error in user identity setup:", error);
        // Fallback to a basic random name if there's an error
        const fallbackName = generateRandomName();
        setUserName(fallbackName);
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
      const visitorId = getVisitorId(); // Get the visitor ID using the shared function
      console.log("Submitting comment with visitorId:", visitorId);
      console.log("Submitting comment with userIdentifier:", userIdentifier);

      const result = await addComment(
        blogId,
        content,
        userName, // Use the generated username as author
        visitorId, // Use the visitor ID as the user ID
        visitorId, // Use the same visitor ID as visitorId
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
      {" "}
      <div>
        {userName && (
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <span>
              Posting anonymously as{" "}
              <span className="font-medium">{userName}</span>
            </span>
            <RefreshNameButton
              userIdentifier={userIdentifier}
              onNameRefreshed={(newName) => setUserName(newName)}
            />
            <span className="ml-2 text-xs text-gray-400">
              (No account or email required)
            </span>
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
