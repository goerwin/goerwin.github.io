import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import SectionTitle from '@/components/SectionTitle';
import { getAbout, getInfo } from '@/utils/content';

export default async function AboutMe() {
  const aboutMe = await getAbout();
  const info = await getInfo();
  const languages = info.languages;

  return (
    <section className="max-w-[40rem] pt-[100px] text-center" id="about">
      <SectionTitle title="About Me" />

      <ReactMarkdown className="[&>p]:mb-5 [&>p]:leading-loose">
        {aboutMe.content}
      </ReactMarkdown>

      <p className="mb-5 font-bold">My languages are:</p>

      <div>
        {languages.map((it, idx) => (
          <div key={idx}>
            {it.name} ({it.level})
          </div>
        ))}
      </div>
    </section>
  );
}
