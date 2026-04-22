import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "QalAmharic | Learn Amharic beautifully",
  description:
    "A premium Amharic learning platform with gamified lessons, pronunciation practice, spaced repetition, and culturally grounded design.",
  applicationName: "QalAmharic"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
