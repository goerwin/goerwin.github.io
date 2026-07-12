'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

export interface Props {
  duration?: number;
  items: ReactNode[];
}

export default function Carousel(props: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const itemsLength = props.items.length;
  const isOnlyOne = itemsLength === 1;
  const intervalRef = useRef<number | undefined>(undefined);

  const setNextActiveSlide = () => {
    setActiveSlide((prev) => (prev + 1) % itemsLength);
  };

  const setPrevActiveSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? itemsLength - 1 : prev - 1));
  };

  const removeInterval = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const setNextActiveSlide = () => {
      setActiveSlide((prev) => (prev + 1) % itemsLength);
    };

    intervalRef.current = window.setInterval(
      setNextActiveSlide,
      props.duration ?? 5000,
    );
    return removeInterval;
  }, [props.duration, itemsLength, removeInterval]);

  return (
    <div className="relative mx-auto overflow-hidden shadow-2xl">
      {isOnlyOne ? null : (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-2 z-20 mt--5 text-10 text-gray-400 leading-none hover:scale-110"
            aria-label="previous"
            onClick={() => {
              removeInterval();
              setPrevActiveSlide();
            }}
          >
            <FaChevronLeft />
          </button>

          <button
            type="button"
            className="absolute top-1/2 right-2 z-20 mt--5 text-10 text-gray-400 leading-none hover:scale-110"
            aria-label="next"
            onClick={() => {
              removeInterval();
              setNextActiveSlide();
            }}
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-xl bg-gray-900/40 px-4 py-1">
            {props.items.map((_, idx) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: Static list with no reordering.
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => {
                  setActiveSlide(idx);
                  removeInterval();
                }}
                className={twMerge(
                  'pointer-events-none h-4 w-4 rounded-full border-4 border-white/40 bg-gray-900 transition-all duration-300 sm:pointer-events-auto',
                  activeSlide === idx && 'border-white',
                )}
              />
            ))}
          </div>
        </>
      )}

      {props.items.map((it, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static list with no reordering.
        <div key={idx}>
          {/* placeholder item to keep the height automatic */}
          <div
            aria-hidden
            className={`invisible ${idx !== activeSlide ? 'hidden' : ''}`}
          >
            {it}
          </div>
          <div
            className={`absolute inset-0 flex justify-center transition-opacity duration-500 ${
              idx !== activeSlide ? 'opacity-0' : 'z-10 opacity-1'
            }`}
          >
            {it}
          </div>
        </div>
      ))}
    </div>
  );
}
