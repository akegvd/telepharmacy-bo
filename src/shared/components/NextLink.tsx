"use client";

import Link from "next/link";

// Next.js 16 cannot serialize `next/link` when it is passed to a MUI `component`
// prop from a Server Component. Re-exporting it from a client module turns it
// into a client reference, which is serializable.
// https://mui.com/material-ui/integrations/nextjs/#nextjs-v16-client-component-restriction
export default Link;
