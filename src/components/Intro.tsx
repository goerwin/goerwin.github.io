'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';
import type { Info } from '@/content/schemas';

type Props = {
  info: Info;
};

export default function Intro(props: Props) {
  return (
    <section
      id="intro"
      className="mb-28 max-w-216 scroll-mt-400 text-center sm:mb-0"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <Image
              src="/assets/profilepic.jpg"
              alt="Erwin portrait"
              width="120"
              height="120"
              quality="95"
              priority={true}
              className="h-30 w-30 rounded-full border-[0.35rem] border-white object-cover shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute right-0 bottom-0 text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="!leading-normal mt-4 mb-10 px-4 font-medium text-2xl sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ReactMarkdown>{props.info.content}</ReactMarkdown>
      </motion.h1>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 px-4 font-medium text-lg sm:flex-row"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {props.info.links.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            title={it.title}
            target={it.target}
            prefetch={false}
            download={it.download}
            className={twMerge(
              'group flex items-center rounded-full bg-white text-gray-700 transition hover:scale-105 hover:text-gray-950 focus:scale-105 active:scale-105 dark:bg-gray-900 dark:text-white dark:hover:text-white',
              it.type === 'text' && 'gap-2 px-7 py-4 text-base',
              it.type === 'icon' && 'p-4 text-2xl',
            )}
          >
            {it.type === 'text' ? (
              <>
                {it.label}
                {it.iconRight === 'download' ? (
                  <HiDownload className="transition group-hover:translate-y-1" />
                ) : null}
              </>
            ) : null}

            {it.type === 'icon' ? (
              <>
                {it.icon === 'github' ? <FaGithub /> : null}
                {it.icon === 'linkedin' ? <FaLinkedin /> : null}
              </>
            ) : null}
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
