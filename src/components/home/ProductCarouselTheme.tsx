import Link from "next/link";
import { ProductCard } from "@components/catalog/product/ProductCard";
import { ProductsSectionProps } from "@components/catalog/type";
import { baseUrl, CURRENCY_CODE, getImageUrl, NOT_IMAGE } from "@utils/constants";
import { resolveCardPrice } from "@utils/helper";

const Theme = ({ title, description, products, viewAllHref }: ProductsSectionProps) => {
  return (
    <section className="pt-6 sm:pt-12 lg:pt-20">
      <div className="md:max-w-4.5xl mx-auto mb-6 w-full px-0 text-center md:text-start xss:mb-10">
        <h2 className="mb-4 font-outfit text-xl md:text-4xl font-semibold text-black dark:text-white">
          {title}
        </h2>
        <p className="text-sm md:text-lg font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>

      <div className="w-full pb-2 pt-1">
        <ul className="m-0 grid grid-cols-2 justify-center gap-5 lg:gap-11.5 p-0 xss:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item, index) => {
            const imageUrl = getImageUrl(
              item?.baseImageUrl,
              baseUrl,
              NOT_IMAGE,
            );
            const ProductPrice = resolveCardPrice(item);

            return (
              <ProductCard
                key={item.id ?? index}
                currency={CURRENCY_CODE}
                imageUrl={imageUrl || ""}
                price={String(ProductPrice)}
                product={{
                  urlKey: item.urlKey || item.sku,
                  name: item?.name || item.sku,
                  id: item.id,
                  type: item.type,
                  isSaleable: item.isSaleable,
                }}
                specialPrice={""}
                priority={index < 4}
              />
            );
          })}
        </ul>
      </div>

      {viewAllHref && (
        <div className="mt-8 flex justify-center md:justify-start">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            Lihat Semua Layanan
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Theme;
