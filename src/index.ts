import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import * as pm from 'picomatch';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export interface RunOptions {
  cwd: string;
  ignore?: string[];
}

export const run = async (pattern: string[], options: RunOptions = { cwd: process.cwd(), ignore: [] }) => {
  const entryDir = options.cwd;
  const isMatch = pm(pattern, {
    ignore: options.ignore || []
  });
  return globDirectory(entryDir, isMatch, options);
}

const globDirectory = async (dirname: string, isMatch, options?) => {
  if (!fs.existsSync(dirname)) {
    return [];
  }
  const list = await readdir(dirname);
  const result = [];

  for( let file of list) {
    const resolvePath = resolve(dirname, file);
    const fileStat = await stat(resolvePath);
    if (fileStat.isDirectory() && isMatch(resolvePath)) {
      const childs = await globDirectory(resolvePath, isMatch, options);
      result.push(...childs);
    } else if(fileStat.isFile() && isMatch(resolvePath)) {
      result.push(resolvePath);
    }
  }

  return result;
};