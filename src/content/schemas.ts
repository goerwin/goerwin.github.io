import { z } from 'zod';
import { getExperiences } from '@/utils/content';

const dateSchema = z.unknown().pipe(z.coerce.date());

export const LanguageSchema = z.object({ name: z.string(), level: z.string() });

export const GeneralGrayMatterSchema = z
  .object({ content: z.string() })
  .passthrough();

export const InfoSchema = z.object({
  name: z.string(),
  image: z.string(),
  birthplace: z.string(),
  birthdate: z.string(),
  phone: z.string(),
  email: z.string(),
  github: z.string(),
  linkedin: z.string(),
  website: z.string(),
  content: z.string(),
  languages: z.array(LanguageSchema),
  links: z.array(
    z.intersection(
      z.object({
        href: z.string(),
        title: z.string().optional(),
        target: z.string().optional(),
        download: z.boolean().optional(),
      }),
      z.union([
        z.object({
          type: z.literal('text'),
          label: z.string(),
          iconRight: z.string().optional(),
        }),
        z.object({
          type: z.literal('icon'),
          icon: z.string(),
        }),
      ]),
    ),
  ),
});

export type Info = z.infer<typeof InfoSchema>;

export const ProjectSchema = z.object({
  name: z.string(),
  slug: z.string(),
  images: z.array(z.string()).optional(),
  company: z.string(),
  description: z.string().optional(),
  content: z.string(),
  skills: z.array(z.string()),
});

export const ProjectsSchema = z
  .array(ProjectSchema)
  .superRefine(async (items, ctx) => {
    const experiences = await getExperiences();
    const allCompanies = experiences.map((it) => it.company);
    const uniqueCompanies = allCompanies.filter(
      (item, idx) => allCompanies.indexOf(item) === idx,
    );

    if (items.some((it) => !uniqueCompanies.includes(it.company))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'A company included in "projects" was not found in "experiences"',
      });

      return z.NEVER;
    }
  });

export type Project = z.infer<typeof ProjectSchema>;

export const WorkExperienceSchema = z.object({
  type: z.literal('work'),
  position: z.string(),
  company: z.string(),
  description: z.string().optional(),
  location: z.string(),
  link: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
});

export type WorkExperience = z.infer<typeof WorkExperienceSchema>;

export const EducationExperienceSchema = WorkExperienceSchema.omit({
  position: true,
}).extend({
  type: z.literal('education'),
  title: z.string(),
});

export type EducationExperience = z.infer<typeof EducationExperienceSchema>;

export const ExperiencesSchema = z.array(
  z.union([WorkExperienceSchema, EducationExperienceSchema]),
);
