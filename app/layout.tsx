// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bridgeocean — Emergency Response Infrastructure for Africa",
  description:
    "Bridgeocean builds Africa's emergency response infrastructure. Nexus Emergency Platform: AI + satellite-powered coordination for ambulances, hospitals, and first responders in Nigeria.",
  openGraph: {
    title: "Bridgeocean — Emergency Response Infrastructure for Africa",
    description:
      "AI-powered emergency coordination platform connecting ambulances, hospitals, and first responders across Nigeria.",
    url: "https://www.bridgeocean.xyz",
    siteName: "Bridgeocean",
    type: "website",
  },
};

const GA_ID = "G-HCLC085EK6";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
