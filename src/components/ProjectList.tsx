import Image from 'next/image';
import Link from 'next/link';
import placeholderImg from '@/assets/placeholder.jpeg';
import type { Project } from '@/content/schemas';
import { getDateRange } from '@/utils/date';

export interface Props {
  projects: Project[];
}

export default function ProjectList({ projects }: Props) {
  return (
    <div>
      {projects.map((it) => (
        <Link
          key={it.slug}
          href={`/project/${it.slug}`}
          className="group relative mx-auto mb-10 block max-w-2xl cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-300/20 p-4 shadow-md hover:bg-gray-300/40 md:p-8 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="md:w-[55%] md:group-even:ml-auto">
            <h3 className="break-all font-bold text-xl">{it.name}</h3>
            <h3 className="font-bold text-sm italic">{it.company}</h3>
            <h3 className="mb-2 text-sm italic">
              {getDateRange(it.startDate, it.endDate)}
            </h3>
            <p>{it.description}</p>

            <div className="mt-2 flex flex-wrap gap-1 md:mt-5">
              {it.skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-2xl bg-black/70 p-1 px-3 text-white text-xs dark:bg-white/70 dark:text-gray-700"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <Image
            src={it.images?.[0] ?? placeholderImg}
            className="absolute top-8 left-[55%] ml-8 hidden h-[350px] w-[350px] rounded-2xl object-cover object-top shadow-2xl transition group-even:right-[55%] group-even:left-auto group-even:mr-8 group-even:ml-auto group-even:group-hover:rotate-2 group-odd:group-hover:-rotate-2 md:block"
            width={it.images?.[0] ? 350 : undefined}
            height={it.images?.[0] ? 350 : undefined}
            quality={90}
            alt={it.name}
          />
        </Link>
      ))}
    </div>
  );
}
