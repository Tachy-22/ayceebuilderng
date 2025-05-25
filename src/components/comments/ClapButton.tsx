"use client";

import React, { useState, useEffect, useRef } from "react";
import { getClaps, addClap, getVisitorClaps } from "@/app/actions/claps";
import { getVisitorId } from "@/lib/visitorId";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";

interface ClapButtonProps {
  blogId: string;
  initialClaps?: number;
}

const ClapButton: React.FC<ClapButtonProps> = ({
  blogId,
  initialClaps = 0,
}) => {
  const [claps, setClaps] = useState(initialClaps);
  const [visitorClaps, setVisitorClaps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClapping, setIsClapping] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { toast } = useToast();
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchClaps = async () => {
      try {
        const visitorId = getVisitorId();
        const [totalClaps, userClaps] = await Promise.all([
          getClaps(blogId),
          getVisitorClaps(blogId, visitorId),
        ]);

        setClaps(totalClaps);
        setVisitorClaps(userClaps);
      } catch (error) {
        console.error("Error fetching claps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaps();

    // Cleanup animation timeout
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [blogId]);

  const handleClap = async () => {
    if (isClapping) return;

    setIsClapping(true);
    setShowAnimation(true);

    try {
      const visitorId = getVisitorId();
      const result = await addClap(blogId, visitorId, 1);

      if (result.success) {
        setClaps(result.totalClaps || claps + 1);
        setVisitorClaps((prev) => prev + 1);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to add clap",
        });
      }
    } catch (error) {
      console.error("Error adding clap:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add clap. Please try again.",
      });
    } finally {
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Set a new timeout
      animationTimeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
        setIsClapping(false);
      }, 800);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16 w-16 rounded-full border border-gray-200">
        <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="sm"
        className={`rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 transition-all 
          ${visitorClaps > 0 ? "border-primary text-primary" : ""} 
          ${showAnimation ? "scale-110" : ""}`}
        onClick={handleClap}
        disabled={isClapping}
      >
        <Clapperboard />
        {/* Floating +1 animation */}
        {showAnimation && (
          <span
            className="absolute -top-4 text-primary font-medium"
            style={{
              animation: "float-up 0.8s ease-out forwards",
            }}
          >
            +1
          </span>
        )}

        <style jsx>{`
          @keyframes float-up {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
        `}</style>

        <span className="text-xs font-medium">{claps}</span>
      </Button>

      {visitorClaps > 0 && (
        <div className="text-xs text-gray-500 mt-2">
          You clapped {visitorClaps} {visitorClaps === 1 ? "time" : "times"}
        </div>
      )}
    </div>
  );
};

export default ClapButton;
