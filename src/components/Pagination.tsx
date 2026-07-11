import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type GetPaginationInfoProps<T> = {
  getItemsFn: () => Promise<T[]>;
  page?: string | number;
  itemsPerPage?: number;
};

export async function getPaginationInfo<T>(props: GetPaginationInfoProps<T>) {
  const items = await props.getItemsFn();

  const itemsPerPage = props.itemsPerPage ?? 10;
  const itemsLength = items.length;
  const numberOfPages = Math.ceil(itemsLength / itemsPerPage);
  const parsedPage = parseInt(String(Number(props.page)), 10) || 1;
  const activePageIdx = parsedPage <= numberOfPages ? parsedPage - 1 : 0;

  const visibleItemsStartIdx = activePageIdx * itemsPerPage;
  const visibleItems = items.slice(
    visibleItemsStartIdx,
    visibleItemsStartIdx + itemsPerPage,
  );

  return { visibleItems, activePageIdx, numberOfPages };
}

type Props = {
  activepageIdx: number;
  numberOfPages: number;
  basePathname: string;
};

export default async function Pagination(props: Props) {
  return props.numberOfPages > 1 ? (
    <div className="flex flex-wrap gap-2">
      {new Array(props.numberOfPages).fill(0).map((_, idx) => (
        <Link
          key={idx}
          href={`${props.basePathname}/${idx === 0 ? '' : `${idx + 1}`}`}
          className={twMerge(
            'rounded-full bg-gray-400/50 px-4 py-2 text-gray-600 dark:text-white',
            props.activepageIdx === idx && 'bg-red-500 text-white',
          )}
        >
          {idx + 1}
        </Link>
      ))}
    </div>
  ) : null;
}
