import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import * as pm from 'picomatch';

export interface RunOptions {
  cwd: string;
  ignore?: string[];
}

export const run = (pattern: string[], options: RunOptions = { cwd: process.cwd(), ignore: [] }) => {
  const entryDir = options.cwd;
  const isMatch = pm(pattern, {
    ignore: options.ignore || []
  });
  return globDirectory(entryDir, isMatch, options);
}

const globDirectory = (dirname: string, isMatch, options?) => {
  if (!existsSync(dirname)) {
    return [];
  }
  const list = readdirSync(dirname);
  const result = [];

  for( let file of list) {
    const resolvePath = resolve(dirname, file);
    const fileStat = statSync(resolvePath);
    if (fileStat.isDirectory() && isMatch(resolvePath)) {
      const childs = globDirectory(resolvePath, isMatch, options);
      result.push(...childs);
    } else if(fileStat.isFile() && isMatch(resolvePath)) {
      result.push(resolvePath);
    }
  }

  return result;
};