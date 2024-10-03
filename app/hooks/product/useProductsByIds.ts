import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch products by ids
 * @param ids - Array of product ids
 * @param fetchOnMount - Determines when to fetch
 * @returns array of product items
 * @example
 * ```js
 * const products = useProductsByIds(['gid://shopify/Product/12345', 'gid://shopify/Product/67890']);
 * ```
 */

export function useProductsByIds(
  ids: string[] = [],
  fetchOnMount = true,
): Product[] {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{products: Product[]}>({
    key: `products-from-handles:${ids.join(',')}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!fetchOnMount || !ids?.length || fetcher.data?.products) return;
    const searchParams = new URLSearchParams({
      query: ids
        .filter(Boolean)
        .map((id) => {
          return `id:${typeof id === 'number' ? id : id.split('/').pop()}`;
        })
        .join(' OR '),
      count: ids.length.toString(),
    });
    fetcher.load(`${pathPrefix}/api/products?${searchParams}`);
  }, [fetchOnMount, JSON.stringify(ids)]);

  return fetcher.data?.products?.filter(Boolean) || [];
}
