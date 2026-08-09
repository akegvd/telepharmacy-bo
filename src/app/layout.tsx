import type { Metadata } from "next";

import { Providers } from "./providers";
import { AppLayout } from "@/shared/components/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telepharmacy Task Dashboard",
  description: "Manage incoming telepharmacy consultation requests.",
};

export default function RootLayout({
  children,
  modal,
}: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
