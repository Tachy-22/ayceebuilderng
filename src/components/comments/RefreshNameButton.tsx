"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { generateRandomName } from "@/lib/userIdentification";
import { useToast } from "@/hooks/use-toast";

interface RefreshNameButtonProps {
  userIdentifier: string;
  onNameRefreshed: (newName: string) => void;
}

const RefreshNameButton: React.FC<RefreshNameButtonProps> = ({
  userIdentifier,
  onNameRefreshed,
}) => {
  const { toast } = useToast();

  const handleRefreshName = () => {
    const newName = generateRandomName();
    localStorage.setItem(`user_name_${userIdentifier}`, newName);
    onNameRefreshed(newName);

    toast({
      title: "Name refreshed!",
      description: `You'll now appear as "${newName}" in comments.`,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs text-gray-500 px-2 h-6"
      onClick={handleRefreshName}
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      New name
    </Button>
  );
};

export default RefreshNameButton;
