import { baseUrl } from "@/utils/constants";
import { normalizeStoreHref } from "@/utils/helper";

interface StaticContentProps {
  options: {
    html: string;
    css?: string;
  };
}

function resolveAssetUrl(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanBase = (baseUrl || "").replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
}

function prepareStaticHtml(html: string): string {
  return html
    .replace(/\bsrc=""\s+data-src="([^"]+)"/g, (_, path: string) => {
      return `src="${resolveAssetUrl(path)}"`;
    })
    .replace(/data-src="([^"]+)"/g, (_, path: string) => {
      return `src="${resolveAssetUrl(path)}"`;
    })
    .replace(
      /\bhref="(?!https?:\/\/|\/|#|mailto:|tel:)([^"]+)"/g,
      (_, slug: string) => `href="${normalizeStoreHref(slug)}"`,
    );
}

export default function StaticContent({ options }: StaticContentProps) {
  if (!options?.html) return null;

  const html = prepareStaticHtml(options.html);

  return (
    <div className="static-content-wrapper">
      {options.css && (
        <style dangerouslySetInnerHTML={{ __html: options.css }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
