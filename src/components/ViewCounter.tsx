"use client";

import { useEffect } from "react";
import { incrementViews } from "@/app/actions/incrementViews";
import { usePathname } from "next/navigation";

interface ViewCounterProps {
  blogId: string;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ blogId }) => {
  const pathname = usePathname();

  useEffect(() => {
    // Use a session storage flag to avoid counting multiple views in the same session
    const viewFlag = `blog-${blogId}-viewed`;

    if (!sessionStorage.getItem(viewFlag)) {
      const updateViewCount = async () => {
        try {
          // Only increment the view if the user has been on the page for at least 10 seconds
          // This helps filter out accidental clicks and bots
          setTimeout(async () => {
            await incrementViews(blogId, pathname);
            // Set the flag in session storage to prevent duplicate counts
            sessionStorage.setItem(viewFlag, "true");
          }, 10000);
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      };

      updateViewCount();
    }
  }, [blogId, pathname]);

  // This component doesn't render anything visible
  return null;
};

export default ViewCounter;
