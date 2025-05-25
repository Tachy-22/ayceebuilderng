"use client";

import React, { useEffect, useState } from "react";

const CommentHighlighter: React.FC = () => {
  const [shouldHighlight, setShouldHighlight] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if URL has a hash for comments section
      if (window.location.hash === "#comments-section") {
        // Set highlight state
        setShouldHighlight(true);

        // Remove highlight after animation completes
        const timer = setTimeout(() => {
          setShouldHighlight(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!shouldHighlight) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        animation: "fade-out 3s ease-out forwards",
        background:
          "radial-gradient(circle at center, rgba(50, 205, 150, 0.2) 0%, rgba(255, 255, 255, 0) 70%)",
        zIndex: 10,
      }}
    >
      <style jsx>{`
        @keyframes fade-out {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentHighlighter;
