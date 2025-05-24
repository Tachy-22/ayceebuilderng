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
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export function PreviewModal({
  content,
  author,
}: {
  content: string;
  author: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="rounded-full" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl z-50 rounded bg-white">
        <AlertDialogHeader className="w-full !flex justify-between">
          <AlertDialogTitle className="w-full flex justify-between items-center">
           By {author}
            <AlertDialogCancel className="w-fit aspect-square rounded-full">
              <X />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="max-h-[80vh] overflow-auto p-4">{content}</div>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
