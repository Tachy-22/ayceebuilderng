"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";

export function TestmonyModal({ children }: { children: React.ReactElement }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white rounded-xl hover:bg-black/80"
        >
          Share Your Testimony
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-7xl z-50 rounded bg-white">
        <AlertDialogHeader className="w-full !flex justify-between">
          <AlertDialogTitle className="w-full flex justify-between items-center">
            Share Your Testimony
            <AlertDialogCancel
              onClick={() => setIsOpen(false)}
              className="w-fit aspect-square rounded-full"
            >
              <X />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="max-h-[80vh] overflow-auto">
          {React.cloneElement(children, { onClose: () => setIsOpen(false) })}
        </div>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TestmonyModal;
