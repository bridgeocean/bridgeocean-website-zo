// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bridgeocean — Emergency Response Infrastructure for Africa",
  description:
    "Bridgeocean is building Africa's emergency response infrastructure. Nexus is the emergency coordination platform — connecting responders, hospitals, and organisations in real time.",
  openGraph: {
    title: "Bridgeocean — Emergency Response Infrastructure for Africa",
    description:
      "Nexus is Africa's emergency coordination platform — from incident to resolution, in real time.",
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
