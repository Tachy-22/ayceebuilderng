"use client";

import React from "react";
import parse from "html-react-parser";
import formatToMonthDayYear from "@/lib/formatToMonthDayYear";
import {
 
  getResponsiveSizes,
} from "@/lib/imageUtils";

const Blog = ({ blogData }: { blogData: BlogT }) => {
  const { title, author, date, content, category, imageUrls } = blogData;
  const parsedContent = parse(content);

  // Get dimensions for the image

  return (
    <article className="max-w-[65rem] mx-auto px-2 sm:px-4 py-6 sm:py-12 bg-white">
      <header className="mb-8 sm:mb-12 flex flex-col gap-5">
        <h2 className="text-lg text-orange-500 font-bold uppercase max-w-[30rem] mx-auto text-center">
          {category}{" "}
        </h2>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900 text-center mx-auto max-w-[90%] w-fit">
          {title || "Test Blog Title"}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-gray-600 text-sm sm:text-base">
          <span className="font-medium">{author || "John Doe"}</span>
          <span>•</span>
          <time className="text-gray-500">
            {formatToMonthDayYear(date as string)}
          </time>
        </div>
        <div className="h-[20rem] w-full relative">
          <img
            src={imageUrls[0]}
            alt={title}
            sizes={getResponsiveSizes("hero")}
            className="object-cover bg-gray-300 w-full h-[20rem]"
          />
        </div>
      </header>
      <div className="prose prose-lg max-w-none ">{parsedContent}</div>
    </article>
  );
};

export default Blog;
