import { Geist, Geist_Mono, Sour_Gummy, Londrina_Sketch } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourGummy = Sour_Gummy({
  variable: "--font-sour-gummy",
  subsets: ['latin'],
});

const sketch = Londrina_Sketch({
  weight: '400',
  variable: "--font-sketch",
  subsets: ['latin'],
});

export const metadata = {
  title: "Flash",
  description: "FlashCard App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          ${sourGummy.variable}
          ${sketch.variable}
          antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
