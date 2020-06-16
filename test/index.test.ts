import { run } from '../src/index';
import { join } from 'path';
import * as assert from 'assert';

describe('test', () => {
  it.only('test run', async () => {
    const result = await run(['**/*.md'], {
      cwd: join(__dirname, './fixtures/first'),
      ignore: [
        '**/bbbb/**',
        '**/c.md'
      ]
    });
    assert.deepEqual(result, [ join(process.cwd(), 'test/fixtures/first/a.md') ]);
  });

  it('test run midway app', async () => {
    const result = await run(['**/**.ts', '**/**.tsx', '**/**.js'], {
      cwd: join(__dirname, './fixtures/second/src'),
      ignore: [
        '**/**.d.ts',
        '**/node_modules/**',
        '**/logs/**',
        '**/run/**',
        '**/public/**',
        '**/view/**',
        '**/views/**',
        '**/plugin2/**'
      ]
    });
    assert.deepEqual(result, [
      join(process.cwd(),'./test/fixtures/second/src/a.ts'),
      join(process.cwd(),'./test/fixtures/second/src/app/controller/api.ts'),
      join(process.cwd(),'./test/fixtures/second/src/app/router.ts'),
      join(process.cwd(),'./test/fixtures/second/src/config/config.default.ts'),
      join(process.cwd(),'./test/fixtures/second/src/config/config.unittest.ts'),
      join(process.cwd(),'./test/fixtures/second/src/config/plugin.ts'),
      join(process.cwd(),'./test/fixtures/second/src/lib/service.ts'),
    ]);
  });
});