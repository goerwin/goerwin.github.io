import { Validator } from 'jsonschema';
import type { Layout } from '../types';

const CARD_URL_SEP = '_l_';

export function getQueryParamValue(search: string, query: string) {
  const urlparams = new URLSearchParams(search);
  const value = urlparams.get(query);

  return value !== null ? Number(value) : null;
}

export function getLayoutFromUrlQueryParams(search: string) {
  const urlParams = new URLSearchParams(search);

  const layoutItemSchema = {
    id: 'LayoutItem',
    type: 'object',
    i: { type: 'string' },
    x: { type: 'number' },
    y: { type: 'number' },
    w: { type: 'number' },
    h: { type: 'number' },
  };

  const layoutSchema = {
    id: 'Layout',
    type: 'array',
    items: { type: '/LayoutItem' },
    required: ['items'],
  };

  try {
    // todo: use Zod?
    const v = new Validator();
    const layoutParsed = decodeLayout(urlParams.get('layout') || '');
    const parsedCardUrls = decodeCardUrls(urlParams.get('cardUrls') || '');
    v.addSchema(layoutItemSchema);

    if (!v.validate(layoutParsed, layoutSchema).valid) {
      return null;
    }

    return (layoutParsed as Layout).map((el, idx) => ({
      ...el,
      i: `${idx}`,
      url: parsedCardUrls?.[idx] as string,
    }));
  } catch (_e) {
    return null;
  }
}

export function encodeLayout(layout: Layout) {
  return encodeURIComponent(
    JSON.stringify(
      layout.map((el) => ({
        x: el.x,
        y: el.y,
        h: el.h,
        w: el.w,
        i: el.i,
      })),
    )
      .replace(/\[/g, '_')
      .replace(/\]/g, 'b')
      .replace(/\{/g, 'c')
      .replace(/\}/g, 'd')
      .replace(/:/g, 'e')
      .replace(/,/g, 'f')
      .replace(/"/g, 'g'),
  );
}

export function decodeLayout(layout: string) {
  try {
    return JSON.parse(
      layout
        ?.replace(/_/g, '[')
        .replace(/b/g, ']')
        .replace(/c/g, '{')
        .replace(/d/g, '}')
        .replace(/e/g, ':')
        .replace(/f/g, ',')
        .replace(/g/g, '"'),
    );
  } catch (_err) {
    return null;
  }
}

export function encodeCardUrls(items: (string | undefined)[]) {
  return encodeURIComponent(
    items.reduce(
      (prev, curr, idx) =>
        `${prev}${idx === 0 ? '' : CARD_URL_SEP}${curr || 0}`,
      '',
    ) as string,
  );
}

export function decodeCardUrls(urlCards: string) {
  return decodeURIComponent(urlCards)
    .split(CARD_URL_SEP)
    .map((el) => (el === '0' ? undefined : el));
}
