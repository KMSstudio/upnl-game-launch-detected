/* @/app/layout.js */

import { Inter } from "next/font/google";
import "@/styles/index.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UPnL launch game",
  description: "Union of Popo & Lpg의 게임 발사대",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}