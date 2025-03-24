import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full">
      <main className="flex-grow pt-20">
        {/* Skeleton for Page Header */}
        <div className="bg-secondary/5 py-10">
          <div className="mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Skeleton className="h-10 w-52 sm:w-64" />
                  <Skeleton className="h-10 w-24" />
                </div>

                <div className="flex gap-3">
                  <Skeleton className="h-10 w-32 sm:w-[180px]" />
                  <Skeleton className="h-10 w-24 md:hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Skeleton for Filters - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="space-y-2">
                    {Array(6).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-5 w-full my-6" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </aside>

            {/* Skeleton for Product Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(12).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* Skeleton for product image */}
                    <Skeleton className="w-full h-60" />

                    {/* Skeleton for product content */}
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-5 w-1/2" />
                      <div className="pt-3">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton for Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-24" />
                  <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-md" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Loading;