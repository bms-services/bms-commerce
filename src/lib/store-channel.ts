import { cache } from "react";
import { GET_DEFAULT_CHANNEL } from "@/graphql/channel/queries";
import { cachedGraphQLRequest } from "@/lib/cached-graphql";
import {
  ChannelHomeSeo,
  ChannelsResponse,
  StoreBranding,
} from "@/types/channel/type";

const DEFAULT_BRANDING: StoreBranding = {
  name: "Store",
  description: "",
  logoUrl: null,
  faviconUrl: null,
  metaTitle: "Store",
  metaDescription: "",
  metaKeywords: "",
};

function parseHomeSeo(homeSeo: ChannelHomeSeo | Record<string, unknown> | null | undefined) {
  if (!homeSeo || typeof homeSeo !== "object") {
    return {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    };
  }

  return {
    metaTitle:
      (homeSeo as ChannelHomeSeo).meta_title ||
      (homeSeo as { metaTitle?: string }).metaTitle ||
      "",
    metaDescription:
      (homeSeo as ChannelHomeSeo).meta_description ||
      (homeSeo as { metaDescription?: string }).metaDescription ||
      "",
    metaKeywords:
      (homeSeo as ChannelHomeSeo).meta_keywords ||
      (homeSeo as { metaKeywords?: string }).metaKeywords ||
      "",
  };
}

export const getStoreChannel = cache(async (): Promise<StoreBranding> => {
  const data = await cachedGraphQLRequest<ChannelsResponse>(
    "static",
    GET_DEFAULT_CHANNEL,
  );

  const channel = data?.channels?.edges?.[0]?.node;
  if (!channel) {
    return DEFAULT_BRANDING;
  }

  const translation = channel.translation;
  const seo = parseHomeSeo(translation?.homeSeo);

  return {
    name: translation?.name || DEFAULT_BRANDING.name,
    description: translation?.description || "",
    logoUrl: channel.logoUrl ?? null,
    faviconUrl: channel.faviconUrl ?? null,
    metaTitle: seo.metaTitle || translation?.name || DEFAULT_BRANDING.metaTitle,
    metaDescription: seo.metaDescription || translation?.description || "",
    metaKeywords: seo.metaKeywords,
  };
});
