import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECHOES — Talk with San Luis Obispo's History",
  description:
    "Converse with Myron Angel, the father of Cal Poly and chronicler of San Luis Obispo — an AI simulation grounded in historical sources.",
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
