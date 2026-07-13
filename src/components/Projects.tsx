import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { getProjects } from '@/utils/content';
import ProjectList from './ProjectList';

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section className="max-w-200 pt-25" id="projects">
      <SectionTitle title="My Projects"></SectionTitle>

      <ProjectList projects={projects.slice(0, 3)} />

      <div className="text-center">
        <Link
          href="/projects"
          className="text-base underline underline-offset-4"
        >
          View all ({projects.length})
        </Link>
      </div>
    </section>
  );
}
