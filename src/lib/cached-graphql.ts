/**
 * Single GraphQL cache layer, built on the Next.js Cache Components model.
 *
 * This is the ONE place caching happens for read queries: the `'use cache'`
 * directive together with `cacheLife()` and `cacheTag()`. Those APIs are
 * strictly server-only at *import* time, so this module must only ever be
 * imported from Server Components / server modules — never from a Client
 * Component, or the build will fail. (`useCache.ts` keeps the client-safe cache
 * *config*; `graphql-fetch.ts` keeps the uncached path and shared utilities.)
 *
 * Use these helpers for deterministic, non-personalized data (catalog,
 * navigation, CMS content). Nothing called inside a `'use cache'` scope may read
 * request-time APIs such as `cookies()` or `headers()`.
 */
import { cacheLife, cacheTag } from "next/cache";
import { gql, type DocumentNode, type OperationVariables } from "@apollo/client";
import { print } from "graphql";
import { getRevalidateTime, type CacheLifeOption } from "@/lib/graphql-fetch";
import makeClient from "@/lib/apollo-client";
import {
  getCategoryCacheConfig,
  getPageCacheConfig,
  getProductCacheConfig,
  type PAGE_CACHE_CONFIG,
} from "@/utils/hooks/useCache";
import { type FilterAttribute } from "@components/catalog/type";

/**
 * Maps this project's {@link CacheLifeOption} onto the Cache Components
 * `cacheLife()` API. Building an explicit `{ stale, revalidate, expire }`
 * profile avoids depending on built-in profile names and keeps
 * `expire >= revalidate >= stale` (required by Next); "max"/falsey means
 * effectively never revalidate.
 */
function applyCacheLife(life?: CacheLifeOption): void {
  const revalidate = getRevalidateTime(life);

  if (revalidate === false) {
    const year = 60 * 60 * 24 * 365;
    cacheLife({ stale: year, revalidate: year, expire: year });
    return;
  }

  cacheLife({ stale: revalidate, revalidate, expire: revalidate });
}

/**
 * Core cached GraphQL request. The `'use cache'` directive turns the whole
 * function body into a cache entry keyed by its serializable arguments, which is
 * why the Apollo client is created inside. `cacheLife()` sets the freshness
 * profile and `cacheTag()` registers tags for on-demand revalidation
 * (`revalidateTag`).
 */
export async function graphqlRequestCached<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  queryString: string,
  variables: TVariables | undefined,
  options: { tags?: string[]; life?: CacheLifeOption },
): Promise<TData> {
  "use cache";

  applyCacheLife(options.life);

  if (options.tags) {
    for (const tag of options.tags) {
      cacheTag(tag);
    }
  }

  const client = makeClient();

  try {
    const result = await client.query({
      query: gql(queryString),
      variables,
      fetchPolicy: "network-only",
    });

    return result.data as TData;
  } catch (error) {
    console.error("GraphQL cache request failed:", error);
    return null as TData;
  }
}

export async function cachedGraphQLRequest<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  page: keyof typeof PAGE_CACHE_CONFIG,
  query: DocumentNode,
  variables?: TVariables,
): Promise<TData> {
  const config = getPageCacheConfig(page);
  return graphqlRequestCached<TData, TVariables>(print(query), variables, config);
}

export async function cachedProductRequest<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  productId: string,
  query: DocumentNode,
  variables?: TVariables,
): Promise<TData> {
  const config = getProductCacheConfig(productId);
  return graphqlRequestCached<TData, TVariables>(print(query), variables, config);
}

export async function cachedCategoryRequest<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  categoryId: string,
  query: DocumentNode,
  variables?: TVariables,
): Promise<TData> {
  const config = getCategoryCacheConfig(categoryId);
  return graphqlRequestCached<TData, TVariables>(print(query), variables, config);
}

/**
 * Cached storefront filter attributes. Disabled for BMS service catalog.
 */
export async function getFilterAttributes(): Promise<FilterAttribute[]> {
  // BMS sells services, not physical products — color/size/brand filters are not applicable.
  return [];
}
