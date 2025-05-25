"use client";

import React from "react";
import ClapButton from "./ClapButton";
import ShareButton from "./ShareButton";

interface SocialInteractionsProps {
  blogId: string;
  title: string;
  url: string;
  initialClaps?: number;
}

const SocialInteractions: React.FC<SocialInteractionsProps> = ({
  blogId,
  title,
  url,
  initialClaps = 0,
}) => {
  return (
    <div className="my-8 flex flex-col items-center border-t border-gray-200 pt-8">
      <h3 className="text-lg font-medium text-center mb-6">
        Share your appreciation
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <ClapButton blogId={blogId} initialClaps={initialClaps} />
        </div>

        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Share this article</p>
          <ShareButton title={title} url={url} />
        </div>
      </div>
    </div>
  );
};

export default SocialInteractions;
