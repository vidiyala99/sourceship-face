import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SourceShip — Follow up this event",
  description: "Assign follow-up. Walk away. Come back to a done pack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
