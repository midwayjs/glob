import { existsSync, readdirSync, statSync } from 'fs';
import { resolve, sep, posix } from 'path';
import * as pm from 'picomatch';
import { debuglog } from 'util';
import * as os from 'os';

const log = debuglog('midway:glob');

function formatWindowsPath(paths?: string[]) {
  if (os.platform() === 'win32' && paths) {
    return paths.map(p => p.split(sep).join(posix.sep));
  }
  return paths;
}

export interface RunOptions {
  cwd: string;
  ignore?: string[];
}

export const run = (pattern: string[], options: RunOptions = { cwd: process.cwd(), ignore: [] }) => {
  log(`midway glob pattern = ${pattern}, options = ${JSON.stringify(options)}`);
  const startTime = Date.now();
  const entryDir = options.cwd;
  pattern = formatWindowsPath(pattern) || [];
  log(`after format pattern = ${pattern}`);
  const isMatch = pm(pattern, {
    ignore: formatWindowsPath(options.ignore) || []
  });
  const ignoreMatch = pm('**', {
    ignore: formatWindowsPath(options.ignore) || []
  })

  function globDirectory(dirname: string, isMatch, ignoreDirMatch, options?) {
    if (!existsSync(dirname)) {
      return [];
    }
    const list = readdirSync(dirname);
    const result = [];

    for( let file of list) {
      const resolvePath = resolve(dirname, file);
      log(`resolvePath = ${resolvePath}`);
      const fileStat = statSync(resolvePath);
      if (fileStat.isDirectory() && ignoreDirMatch(resolvePath.replace(entryDir, ''))) {
        const childs = globDirectory(resolvePath, isMatch, ignoreDirMatch, options);
        result.push(...childs);
      } else if(fileStat.isFile() && isMatch(resolvePath.replace(entryDir, ''))) {
        result.push(resolvePath);
      }
    }

    return result;
  }

  const result = globDirectory(entryDir, isMatch, ignoreMatch, options);
  log(`midway glob timing ${Date.now() - startTime}ms`);
  return result;
}
