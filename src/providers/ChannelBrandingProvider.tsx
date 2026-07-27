"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StoreBranding } from "@/types/channel/type";

const ChannelBrandingContext = createContext<StoreBranding | null>(null);

export function ChannelBrandingProvider({
  value,
  children,
}: {
  value: StoreBranding;
  children: ReactNode;
}) {
  return (
    <ChannelBrandingContext.Provider value={value}>
      {children}
    </ChannelBrandingContext.Provider>
  );
}

export function useChannelBranding(): StoreBranding {
  const context = useContext(ChannelBrandingContext);

  return (
    context ?? {
      name: "Store",
      description: "",
      logoUrl: null,
      faviconUrl: null,
      metaTitle: "Store",
      metaDescription: "",
      metaKeywords: "",
    }
  );
}
