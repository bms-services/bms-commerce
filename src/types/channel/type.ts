export interface ChannelHomeSeo {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ChannelTranslation {
  name?: string;
  description?: string;
  homeSeo?: ChannelHomeSeo | null;
}

export interface ChannelNode {
  id?: string;
  code?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  translation?: ChannelTranslation | null;
}

export interface ChannelsResponse {
  channels?: {
    edges?: Array<{
      node?: ChannelNode;
    }>;
  };
}

export interface StoreBranding {
  name: string;
  description: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
