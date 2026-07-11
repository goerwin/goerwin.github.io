import Image from 'next/image';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import type { EducationExperience, WorkExperience } from '@/content/schemas';
import {
  getAbout,
  getExperiences,
  getInfo,
  getProjects,
} from '@/utils/content';
import { getDateRange } from '@/utils/date';
import ExperienceBox from './ExperienceBox';
import {
  getImageInfo,
  getImageSizeForContainer,
  getResetStyles,
  getStyles,
} from './utils';

function beautifyUrl(url: string) {
  return url.replace(/https:\/\/(www\.)?/, '');
}

export default async function CVPage() {
  const projects = await getProjects();
  const aboutMe = await getAbout();
  const info = await getInfo();
  const experiences = await getExperiences();
  const resetStyles = await getResetStyles();
  const styles = await getStyles();

  const skillsMap = projects.reduce<Record<string, number>>((acc, proj) => {
    proj.skills.forEach((sk) => (acc[sk] ? (acc[sk] += 1) : (acc[sk] = 1)));
    return acc;
  }, {});

  const skills = Object.keys(skillsMap)
    .map<[string, number]>((k) => [k, skillsMap[k] ?? 0])
    .sort((a, b) => {
      return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
    });

  const workExperiences = [...experiences]
    .filter((it): it is WorkExperience => it.type === 'work')
    .reverse();

  const educationExperiences = [...experiences]
    .filter((it): it is EducationExperience => it.type === 'education')
    .reverse();

  const mainImageInfo = await getImageInfo(info.image, 'data:image/png');
  const imgContainerW = 200;
  const imgContainerH = 200;
  const imgSizeForContainer = getImageSizeForContainer(
    imgContainerW,
    imgContainerH,
    mainImageInfo.width,
    mainImageInfo.height,
  );

  return (
    <>
      <title>Erwin_Gaitan_CV</title>
      <style dangerouslySetInnerHTML={{ __html: resetStyles }}></style>
      <style dangerouslySetInnerHTML={{ __html: styles }}></style>

      <div className="cv-container">
        <section className="cv-container-header">
          <div
            className="cv-container-header-image-container"
            style={{ width: imgContainerW, height: imgContainerH }}
          >
            <Image
              alt="Profile picture"
              width={imgSizeForContainer.width}
              height={imgSizeForContainer.height}
              src={mainImageInfo.base64}
              style={{
                marginLeft: imgSizeForContainer.offsetX,
                marginTop: imgSizeForContainer.offsetY,
              }}
            />
          </div>

          <div className="cv-container-header-info">
            <h2>{info.name}</h2>
            <p>
              <b>Birthplace: </b>
              {info.birthplace}
            </p>
            <p>
              <b>Birthdate: </b>
              {info.birthdate}
            </p>
            <p>
              <b>Phone: </b>
              <a href={`tel:${info.phone}`}>{info.phone}</a>
            </p>
            <p style={{ fontWeight: 'bold' }}>
              <a href={`mailto:${info.email}`}>{info.email}</a>
              <span> 💻 </span>
              <a href={info.website}>{beautifyUrl(info.website)}</a>
            </p>

            <p style={{ fontWeight: 'bold' }}>
              <a href={info.linkedin}>{beautifyUrl(info.linkedin)}</a>
              <span> 💻 </span>
              <a href={info.github}>{beautifyUrl(info.github)}</a>
            </p>
          </div>
        </section>

        <section>
          <h1>Introduction</h1>
          <ReactMarkdown>{info.content}</ReactMarkdown>
        </section>

        <section>
          <h1>About me</h1>
          <ReactMarkdown>{aboutMe.content}</ReactMarkdown>
        </section>

        <section>
          <h1>Languages</h1>

          <ul>
            {info.languages.map((it, idx) => (
              <li key={idx}>
                {it.name} ({it.level})
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h1>Skills</h1>

          <p className="skills">
            {skills.map(([name], idx) => (
              <span key={idx}>{name} </span>
            ))}
          </p>
        </section>

        <section>
          <h1>Education</h1>
          {educationExperiences.map((it, idx) => (
            <ExperienceBox
              key={idx}
              title={it.company}
              subtitle={it.title}
              link={it.link}
              items={[it.location, getDateRange(it.startDate, it.endDate)]}
            />
          ))}
        </section>

        <section>
          <h1>Work experience</h1>

          {workExperiences.map((it, idx) => (
            <ExperienceBox
              key={idx}
              title={it.company}
              subtitle={it.position}
              link={it.link}
              items={[it.location, getDateRange(it.startDate, it.endDate)]}
            />
          ))}
        </section>

        <section>
          <h1>Projects</h1>
          {projects.map((it, idx) => (
            <ExperienceBox
              key={idx}
              title={it.name}
              subtitle={it.company}
              markdownContent={it.content}
              items={[
                ...(it.description ? [it.description] : []),
                getDateRange(it.startDate, it.endDate),
              ]}
            ></ExperienceBox>
          ))}
        </section>
      </div>
    </>
  );
}
