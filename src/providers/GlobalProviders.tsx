import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";
import { ApolloWrapper } from "./ApolloWrapper";
import { NextAuthProvider } from "./NextAuthProvider";
import { SessionSync } from "./SessionSync";
import { ChannelBrandingProvider } from "./ChannelBrandingProvider";
import type { StoreBranding } from "@/types/channel/type";

export function GlobalProviders({
  children,
  branding,
}: {
  children: ReactNode;
  branding: StoreBranding;
}) {
  return (
    <ChannelBrandingProvider value={branding}>
      <NextAuthProvider>
        <ThemeProvider>
          <ReduxProvider>
            <SessionSync />
            <ToastProvider>
              <ApolloWrapper>{children}</ApolloWrapper>
            </ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </NextAuthProvider>
    </ChannelBrandingProvider>
  );
} 