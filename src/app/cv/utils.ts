import { readFile } from 'node:fs/promises';
import path from 'node:path';
import imageSize from 'image-size';

const rootDir = path.join(process.cwd());
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');

export async function getResetStyles() {
  return readFile(path.join(srcDir, 'app/cv/reset.css'), 'utf-8');
}

export async function getStyles() {
  return readFile(path.join(srcDir, 'app/cv/styles.css'), 'utf-8');
}

export async function getImageInfo(publicPath: string, type: string) {
  const parsedPath = path.join(publicDir, publicPath);
  const file = await readFile(parsedPath);
  const imageInfo = imageSize(file);

  if (!imageInfo.width || !imageInfo.height)
    throw new Error(`No Image info: ${parsedPath}`);

  return {
    ...imageInfo,
    width: imageInfo.width,
    height: imageInfo.height,
    base64: `${type};base64,${Buffer.from(file).toString('base64')}`,
  };
}

export function getImageSizeForContainer(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
) {
  let imgWidth: number, imgHeight: number;
  const containerRatio = containerW / containerH;
  const imgRatio = imageW / imageH;

  if (containerRatio > imgRatio) {
    imgWidth = containerW;
    imgHeight = containerW / imgRatio;
  } else {
    imgWidth = containerH * imgRatio;
    imgHeight = containerH;
  }

  return {
    width: imgWidth,
    height: imgHeight,
    offsetX: -(imgWidth - containerW) / 2,
    offsetY: -(imgHeight - containerH) / 2,
  };
}
