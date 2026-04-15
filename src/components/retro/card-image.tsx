"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CardImageProps {
  url: string;
  alt?: string;
}

export function CardImage({ url, alt = "Card photo" }: CardImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-2 block rounded-md overflow-hidden border border-border max-w-[200px] cursor-zoom-in"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Image
          src={url}
          alt={alt}
          width={200}
          height={150}
          className="w-full h-auto max-h-[150px] object-cover"
          unoptimized={url.includes("localhost")}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 sm:max-w-2xl">
            <DialogClose className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1.5 backdrop-blur">
              <X className="h-4 w-4" />
            </DialogClose>
            <img
              src={url}
              alt={alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
