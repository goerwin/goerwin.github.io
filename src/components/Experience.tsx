import { LuGraduationCap } from 'react-icons/lu';
import { MdBusinessCenter } from 'react-icons/md';
import SectionTitle from '@/components/SectionTitle';
import { getExperiences } from '@/utils/content';
import { getDateRange } from '@/utils/date';

export default async function Experience() {
  const experiences = await getExperiences();

  return (
    <section className="max-w-240 pt-25" id="experience">
      <SectionTitle title="My Experience" />

      <div className='relative pt-8 pb-1 before:absolute before:top-0 before:left-[calc(var(--spacing-timeline-icon-size)/2)] before:-z-10 before:ml-[-2px] before:h-full before:w-1 before:rounded-lg before:bg-gray-200 before:content-[""] md:before:left-1/2'>
        {experiences.map((it, idx) => (
          <div
            key={idx}
            className="group mb-10 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] [&>*]:row-span-full"
          >
            <div className="relative ml-4 rounded border border-gray-300 bg-gray-200/50 p-4 md:mr-auto md:group-even:col-start-3 md:group-even:ml-8 md:group-odd:mr-8 md:group-odd:ml-auto dark:border-gray-700 dark:bg-gray-900">
              <div className="border-y-(length:--spacing-timeline-arrow-height) absolute top-[calc(var(--spacing-timeline-icon-size)/2-var(--spacing-timeline-arrow-height))] left--2.5 h-0 w-0 border-y-transparent border-r-2.5 border-r-gray-300 md:group-odd:right--2.5 md:group-odd:left-auto md:group-odd:border-r-0 md:group-odd:border-r-transparent md:group-odd:border-l-2.5 md:group-odd:border-l-gray-300 dark:border-r-gray-700 md:dark:group-odd:border-l-gray-700" />

              <h3 className="font-semibold text-base">
                {it.type === 'work' ? it.position : it.title}
              </h3>
              <h4 className="font-normal text-sm">
                {it.company}
                <span className="italic opacity-70"> - {it.location}</span>
              </h4>
              <h4 className="font-normal text-sm italic opacity-70 md:hidden">
                {getDateRange(it.startDate, it.endDate)}
              </h4>
              <p className="mt-1">{it.description}</p>
            </div>

            <div className="col-start-1 flex h-timeline-icon-size w-timeline-icon-size items-center justify-center rounded-full border-4 border-white bg-white text-[26px] text-gray-700 shadow-black/30 shadow-inner md:col-start-2">
              {it.type === 'education' ? (
                <LuGraduationCap />
              ) : (
                <MdBusinessCenter />
              )}
            </div>

            <div className="hidden h-timeline-icon-size items-center text-gray-600 italic group-odd:ml-2 group-even:col-start-1 group-even:mr-2 group-even:justify-self-end md:flex dark:text-gray-400">
              {getDateRange(it.startDate, it.endDate)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
