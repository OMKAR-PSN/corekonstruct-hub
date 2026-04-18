import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://corekonstruct.com"),
  title: {
    default: "CoreKonstruct - Construction Intelligence",
    template: "%s | CoreKonstruct",
  },
  description:
    "CoreKonstruct centralizes construction intelligence across progress, labor, budgets, and executive reporting.",
  openGraph: {
    type: "website",
    title: "CoreKonstruct - Construction Intelligence",
    description:
      "A premium construction intelligence platform for supervisors, executives, and clients.",
    url: "https://corekonstruct.com",
    siteName: "CoreKonstruct",
    images: [
      {
        url: "/images/downloaded/construction-team.avif",
        width: 2000,
        height: 1333,
        alt: "Construction and architecture context for CoreKonstruct",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
