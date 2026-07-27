"use client";

import Image from "next/image";
import Link from "next/link";
import { useBodyScrollLock } from "@utils/hooks/useBodyScrollLock";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { IMAGES } from "@/utils/constants";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

interface CategoriesPageClientProps {
  categories: { id: string; name: string; slug: string }[];
}

const RightArrow = () => (
  <Image src={IMAGES.arrowRight} alt="" width={24} height={24} className="h-6 w-6 shrink-0 invert dark:invert-0" />
);

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  useBodyScrollLock(true);

  const items = categories.filter((item) => item.slug !== "");

  return (
    <>
      <HideMainNavOnMobile />

      {/* Mobile drawer */}
      <div
        className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col overflow-hidden bg-white dark:bg-surface-darkest lg:hidden drawer-scrollbar-hidden"
        style={{
          top: "0px",
          bottom: "64px",
          height: "calc(var(--visual-viewport-height) - 64px)",
        }}
      >
        <MobileNavHeader hideBack={true} />
        <div className="h-full overflow-y-auto px-4 pt-5 pb-4 drawer-scrollbar-hidden">
          <h1 className="mt-0 px-2 text-2xl font-semibold text-black dark:text-white">
            Kategori Layanan
          </h1>
          <ul className="mt-2 flex w-full flex-col">
            {items.map((item) => (
              <li key={item.id + item.name} className="w-full">
                <Link
                  href={item.slug ? `/search/${item.slug}` : "/search"}
                  aria-label={item.name}
                  className="group flex h-13 w-full items-center justify-between gap-2.5 rounded-md p-3 font-outfit text-lg text-black transition-all dark:text-white"
                >
                  <span className="truncate whitespace-nowrap leading-7">{item.name}</span>
                  <RightArrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop page */}
      <section className="mx-auto hidden w-full max-w-screen-2xl px-4 py-10 lg:block xss:px-7.5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-white">Kategori Layanan</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Pilih kategori yang sesuai kebutuhan bisnis Anda.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.slug ? `/search/${item.slug}` : "/search"}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h2 className="text-xl font-semibold text-black group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {item.name}
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Lihat semua layanan di kategori ini →
              </p>
            </Link>
          ))}
          <Link
            href="/search"
            className="group rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 transition hover:border-blue-300 hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-900/50"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">Semua Layanan</h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Jelajahi seluruh katalog layanan BMS Services →
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
