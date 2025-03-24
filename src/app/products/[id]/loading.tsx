import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col">
      <main className="flex-grow pt-20">
        {/* Breadcrumb skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4 mx-2 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 mx-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 mx-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image Column Skeleton */}
            <div className="space-y-4">
              {/* Main Product Image Skeleton */}
              <div className="bg-secondary/20 rounded-xl overflow-hidden aspect-[4/3]">
                <Skeleton className="w-full h-full" />
              </div>

              {/* Image Thumbnails Skeleton */}
              <div className="flex flex-wrap gap-2 justify-start">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="w-20 h-20 rounded" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex items-center mt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 mx-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 mx-2 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>

              {/* Features List Skeleton */}
              <div className="pt-4 border-t">
                <Skeleton className="h-5 w-28 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="flex items-start">
                      <Skeleton className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-12 flex-1" />
                </div>

                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 flex-shrink-0" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            {/* Tabs Skeleton */}
            <div className="border-b">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            {/* Tab Content Skeleton */}
            <div className="mt-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Loading;