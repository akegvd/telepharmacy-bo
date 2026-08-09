"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog open onClose={() => router.back()} fullWidth maxWidth="sm">
      <IconButton
        aria-label="Close"
        onClick={() => router.back()}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 5 }}>{children}</DialogContent>
    </Dialog>
  );
}
