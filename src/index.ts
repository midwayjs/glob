import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import * as pm from 'picomatch';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export const run = async (pattern: string| string[], options: {cwd: string} = {cwd: process.cwd()}) => {
  const entryDir = options.cwd;
  const isMatch = pm(pattern);
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