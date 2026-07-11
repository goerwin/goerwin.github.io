import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import Pagination, { getPaginationInfo } from '@/components/Pagination';
import ProjectList from '@/components/ProjectList';
import SectionTitle from '@/components/SectionTitle';
import { getProjects } from '@/utils/content';

// NOTE: this should be provided by next.js! come on!
type Props = {
  params: Record<string, string[]>;
  searchParams: Record<string, string>;
};

export default async function ProjectsPage(props: Props) {
  const { activePageIdx, visibleItems, numberOfPages } =
    await getPaginationInfo({
      getItemsFn: getProjects,
      page: props.params.pageIdx?.[0],
    });

  return (
    <main className="flex flex-col items-center px-4 pt-32">
      <SectionTitle title="Projects" />
      <ProjectList projects={visibleItems} />

      <Pagination
        activepageIdx={activePageIdx}
        numberOfPages={numberOfPages}
        basePathname="/projects"
      />
    </main>
  );
}

// NOTE: You can't use searchParams to generate pagination (projects?page=2), instead
// you have to use optional catch-all segments ([[...pageIdx]]) and have it like (projects/2)
export async function generateStaticParams() {
  const { numberOfPages } = await getPaginationInfo({
    getItemsFn: getProjects,
  });

  return new Array(numberOfPages)
    .fill(0)
    .map((_, idx) => ({ pageIdx: [idx === 0 ? 'index' : String(idx + 1)] }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { activePageIdx, numberOfPages } = await getPaginationInfo({
    getItemsFn: getProjects,
    page: props.params.pageIdx?.[0],
  });

  const noIndexPageSubstr =
    numberOfPages > 1 && activePageIdx > 0
      ? ` - page ${activePageIdx + 1} of ${numberOfPages}`
      : '';

  return {
    title:
      'Projects' +
      noIndexPageSubstr +
      (metadata.title ? ` - ${metadata.title}` : ''),
    description: 'Projects page',
  };
}
