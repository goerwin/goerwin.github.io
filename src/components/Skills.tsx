import SectionTitle from '@/components/SectionTitle';
import TagList from '@/components/TagList';
import { getProjects } from '@/utils/content';

export default async function Skills() {
  const projects = await getProjects();

  const skillsMap = projects.reduce<Record<string, number>>((acc, proj) => {
    proj.skills.forEach((sk) => (acc[sk] ? (acc[sk] += 1) : (acc[sk] = 1)));
    return acc;
  }, {});

  const skills = Object.keys(skillsMap)
    .map<[string, number]>((k) => [k, skillsMap[k] ?? 0])
    .sort((a, b) => {
      return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
    });

  return (
    <section className="max-w-200 pt-25" id="skills">
      <SectionTitle title="My Skills" />
      <TagList tags={skills.map(([name]) => ({ label: name }))} />
    </section>
  );
}
