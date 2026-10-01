import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Abhishek — Software Developer",
  description:
    "Abhishek — software developer. Low-level systems, AI, full-stack, and web3.",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>{children}</body>
    </html>
  );
}
