import Link from "next/link";
import { FooterMenuProps, FooterColumns, ThemeOptions } from "@/types/theme/theme-customization";
import { isArray } from "@/utils/type-guards";
import { normalizeStoreHref, safeParse } from "@/utils/helper";

const FooterMenuItem = ({ item }: { item: ThemeOptions }) => {
  const href = normalizeStoreHref(item.url);
  const isExternal = href.startsWith("http");

  return (
    <li className="text-selected-black dark:text-selected-white">
      <Link
        aria-label={item?.title}
        title={item?.title}
        className="block px-0 py-1 md:p-2 text-nowrap text-sm underline-offset-4 text-selected-black dark:text-selected-white hover:text-black hover:underline md:inline-block dark:hover:text-neutral-300"
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {item.title}
      </Link>
    </li>
  );
};

export default function FooterMenu({ menu }: FooterMenuProps) {
  if (!menu || menu.length === 0) return null;

  const firstMenu = menu[0]?.node;
  const firstTranslation = firstMenu?.translations?.edges?.[0]?.node;
  const channels = (typeof firstTranslation?.options === 'string'
    ? safeParse<FooterColumns>(firstTranslation.options)
    : firstTranslation?.options) as FooterColumns | null | undefined;

  return (
    <div className="flex justify-between gap-x-8 lg:gap-x-[50px]">
      {channels && isArray(channels.column_1) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]" aria-label="Layanan">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Layanan
          </p>
          <ul>
            {channels.column_1.map((item: ThemeOptions, index: number) => (
              <FooterMenuItem key={item.url ?? index} item={item} />
            ))}
          </ul>
        </nav>
      ) : null}

      {channels && isArray(channels.column_2) ? (
        <nav className="w-full lg:min-w-[160px] xl:min-w-[200px]" aria-label="Perusahaan">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Perusahaan
          </p>
          <ul>
            {channels.column_2.map((item: ThemeOptions, index: number) => (
              <FooterMenuItem key={index} item={item} />
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
