"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-[#DCE8E7] p-7">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="text-[19px] text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Delete &quot;{itemName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] leading-6 text-[#5C7377]">
            This action cannot be undone. This will permanently remove it from your business.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            className="h-11 rounded-lg border border-[#DCE8E7] bg-white text-[14px] font-medium text-[#14262A] hover:bg-[#F5F8F8]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 rounded-lg bg-[#B54634] text-[14px] font-medium text-white hover:bg-[#9A3A2A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}