import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מרכז חדשות טק",
  description: "לוח בקרה לחדשות טכנולוגיה בעברית",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
