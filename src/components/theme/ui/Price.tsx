import { CURRENCY_CODE, CURRENCY_LOCALE } from "@/utils/constants";

export const Price = ({
  amount,
  className,
  currencyCode = CURRENCY_CODE,
  ...rest
}: {
  amount: string | number | undefined;
  className?: string;
  currencyCode?: string;
} & React.ComponentProps<"p">) => (
  <p className={className} suppressHydrationWarning={true} {...rest}>
    {`${new Intl.NumberFormat(CURRENCY_LOCALE, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    }).format(parseFloat(String(amount ?? 0)))}`}
  </p>
);
