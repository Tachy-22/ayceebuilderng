"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, getComments } from "@/app/actions/commentActions";
import {
  getUserIP,
  generateRandomName,
  generateUserIdentifier,
} from "@/lib/userIdentification";
import { useToast } from "@/components/ui/use-toast";
import { getClaps } from "@/app/actions/claps";
import SocialInteractions from "./SocialInteractions";
import CommentsList from "./CommentsList";
import CommentHighlighter from "./CommentHighlighter";

interface BlogEngagementProps {
  blogId: string;
  title: string;
}

const BlogEngagement: React.FC<BlogEngagementProps> = ({ blogId, title }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentT[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userName, setUserName] = useState("");
  const [totalClaps, setTotalClaps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const clapsCount = await getClaps(blogId);
        setTotalClaps(clapsCount);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load engagement data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      const fetchedComments = await getComments(blogId);
      setComments(fetchedComments);
    };

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

    fetchEngagementData();
    fetchComments();
    setupUserIdentity();
  }, [blogId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new comment using the anonymous identity
      await addComment({
        blogId,
        blogTitle: title,
        content: comment,
        userId: userIdentifier,
        userName: userName,
      });

      // Refresh comments
      const updatedComments = await getComments(blogId);
      setComments(updatedComments);
      setComment("");

      toast({
        title: "Comment added successfully!",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to add comment",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construct the full URL for sharing
  const blogUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${blogId}`
      : `https://ayceebuildernext.com/blog/${blogId}`;
  return (
    <div className="mt-12">
      {/* Comment section highlighter */}
      <CommentHighlighter />

      {/* Social interactions section */}
      <SocialInteractions
        blogId={blogId}
        title={title}
        url={blogUrl}
        initialClaps={totalClaps}
      />

      {/* Comments section */}
      <div id="comments-section" className="border-t border-gray-200 pt-8">

        {/* <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">
                Posting anonymously as{" "}
                <span className="font-medium">{userName}</span>
                <span className="ml-2 text-xs text-gray-400">
                  (No account or email required)
                </span>
              </div>
              <Textarea
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="px-4 py-2">
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div> */}

        <CommentsList blogId={blogId} />
      </div>
    </div>
  );
};

export default BlogEngagement;
