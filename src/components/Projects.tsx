import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { getProjects } from '@/utils/content';
import ProjectList from './ProjectList';

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section className="max-w-[50rem] pt-[100px]" id="projects">
      <SectionTitle title="My Projects">
        <Link
          href="/projects"
          className="text-base underline underline-offset-4"
        >
          View all ({projects.length})
        </Link>
      </SectionTitle>

      <ProjectList projects={projects.slice(0, 3)} />
    </section>
  );
}
