import type { Metadata } from "next";

import { Providers } from "./providers";
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
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}
