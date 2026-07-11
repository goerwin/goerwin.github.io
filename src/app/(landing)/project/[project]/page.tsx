import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { metadata } from '@/app/layout';
import Carousel from '@/components/Carousel';
import TagList from '@/components/TagList';
import { getProjects } from '@/utils/content';
import { getDateRange } from '@/utils/date';

// todo: add the grider page from goerwin.co/grider
// todo: move expenser app to also a page in here

type Props = {
  // NOTE: so sad this can't be automatic
  params: { project: string };
};

export default async function ProjectPage({ params }: Props) {
  const projects = await getProjects();
  const project = projects.find((it) => it.slug === params.project);

  if (!project) {
    return notFound();
  }

  return (
    <main className="mx-auto flex max-w-[58rem] flex-col items-center px-4 pt-32 text-center">
      <h1 className="font-bold text-4xl">{project.name}</h1>
      <p>{project.company}</p>
      <p className="text-sm opacity-70 dark:opacity-100">
        {getDateRange(project.startDate, project.endDate)}
      </p>
      <p className="mt-4">{project.description}</p>
      {project.images ? (
        <div className="mt-8 max-w-[600px]">
          <Carousel
            duration={5000}
            items={project.images.map((src, idx) => (
              <Image
                // NOTE: because next complains if I dont set these
                width="100"
                height="100"
                key={idx}
                src={src}
                alt={project.name}
                className="h-[400px] w-full rounded-lg object-cover"
              />
            ))}
          />
        </div>
      ) : (
        <div className="my-14 h-16 w-1 rounded-full bg-gray-400" />
      )}
      <ReactMarkdown className="prose lg:prose-xl mt-16 text-left dark:text-gray-100">
        {project.content}
      </ReactMarkdown>

      <h2 className="mt-10 mb-4 font-bold text-2xl">Skills</h2>
      <TagList tags={project.skills.map((name) => ({ label: name }))} />
    </main>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const projects = await getProjects();
  const project = projects.find((it) => it.slug === props.params.project);

  if (!project) return {};

  return {
    title: project.name + (metadata.title ? ` - ${metadata.title}` : ''),
    description: project.description,
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((it) => ({ project: it.slug }));
}
