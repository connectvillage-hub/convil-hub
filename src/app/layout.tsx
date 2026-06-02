import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "컨빌 자동화 허브",
  description: "컨빌이 만든 자동화 시스템, 스킬, 사이트를 한 곳에서.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
