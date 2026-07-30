import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "California Speaks — Local History, Made Conversational",
  description:
    "Source-grounded conversations with California historians — San Luis Obispo, San Francisco, San Diego, Santa Barbara, Lake Tahoe, and the San Ramon Valley. Every answer labeled by evidence.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
