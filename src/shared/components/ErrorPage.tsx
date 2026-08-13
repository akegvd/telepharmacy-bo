"use client";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Button } from "@mui/material";
import { useEffect } from "react";

import NextLink from "./NextLink";
import { StatusPage } from "./StatusPage";

interface IErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorPage({ error, reset }: IErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      tone="error"
      icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 48 }} />}
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or return to the dashboard."
      detail={error.digest ? `Reference: ${error.digest}` : undefined}
    >
      <Button variant="contained" color="error" onClick={reset}>
        Try again
      </Button>
      <Button variant="outlined" component={NextLink} href="/">
        Back to Dashboard
      </Button>
    </StatusPage>
  );
}
