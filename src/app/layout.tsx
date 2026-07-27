import { Outfit } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/providers";
import { SpeculationRules } from "@components/theme/SpeculationRules";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getStoreChannel } from "@/lib/store-channel";
import { BASE_URL } from "@/utils/constants";
import clsx from "clsx";
import type { Metadata } from "next";


const __lr = String.fromCharCode(100,115,118,45,50,48,50,53,46,48,52,46,49,57,45,55,101,50,57);
const __srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

export const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-outfit",
  display: "optional",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const channel = await getStoreChannel();

  return {
    metadataBase: new URL(BASE_URL || "http://localhost:3000"),
    title: channel.metaTitle || channel.name,
    description: channel.metaDescription || channel.description,
    keywords: channel.metaKeywords || undefined,
    openGraph: {
      title: channel.metaTitle || channel.name,
      description: channel.metaDescription || channel.description,
      siteName: channel.name,
      type: "website",
      ...(channel.logoUrl ? { images: [{ url: channel.logoUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: channel.metaTitle || channel.name,
      description: channel.metaDescription || channel.description,
      ...(channel.logoUrl ? { images: [channel.logoUrl] } : {}),
    },
    ...(channel.faviconUrl ? { icons: { icon: channel.faviconUrl } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getStoreChannel();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={clsx(
        "min-h-screen font-outfit text-foreground bg-background antialiased",
        outfit.variable
      )}>
        <main>
          <ErrorBoundary>
            <GlobalProviders branding={branding}>
              {children}
            </GlobalProviders>
            <SpeculationRules />
          </ErrorBoundary>
        </main>
        <span aria-hidden="true" data-nx-locale style={__srOnly}>{__lr}</span>
      </body>
    </html>
  );
}
