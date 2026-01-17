import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "NovelReader - Đọc truyện chữ Online",
  description: "Web đọc truyện chữ với trải nghiệm tốt nhất",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={cn("min-h-screen bg-white font-sans antialiased flex flex-col")}>
        {children}
      </body>
    </html>
  );
}
