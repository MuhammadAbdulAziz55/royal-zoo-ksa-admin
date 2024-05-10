"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  console.dir(error);

  return (
    <div>
      <Dialog defaultOpen>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Oops!</DialogTitle>
            <DialogDescription>Something went wrong</DialogDescription>
          </DialogHeader>
          <div>{error.message}</div>
          <DialogFooter>
            <Button onClick={() => reset()}>TRY AGAIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
