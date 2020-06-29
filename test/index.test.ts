import { run } from '../src/index';
import { join } from 'path';
import * as assert from 'assert';
import * as pm from 'picomatch';

describe('test', () => {
  it('test run', async () => {
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
        '**/logs/**',
        '**/run/**',
        '**/public/**',
        '**/view/**',
        '**/views/**',
        '**/plugin2/**',
        '**/app/extend/**',
        '**/config/**',
      ]
    });
    assert.deepEqual(result, [
      join(process.cwd(),'./test/fixtures/second/src/a.ts'),
      join(process.cwd(),'./test/fixtures/second/src/app/controller/api.ts'),
      join(process.cwd(),'./test/fixtures/second/src/app/router.ts'),
      join(process.cwd(),'./test/fixtures/second/src/lib/service.ts'),
    ]);
  });

  it('test run with dot directory', async () => {
    const result = await run(['**/*.md'], {
      cwd: join(__dirname, './fixtures/.ccc'),
      ignore: [
      ]
    });
    assert.deepEqual(result, [ join(process.cwd(), 'test/fixtures/.ccc/dd.md') ]);
  });


  it('test dot path match', () => {
    const isMatch = pm(['**/**.ts', '**/**.tsx', '**/**.js'], {
      dot: true,
      ignore: [
        '**/**.d.ts',
        '**/logs/**',
        '**/run/**',
        '**/public/**',
        '**/view/**',
        '**/views/**',
        '**/app/extend/**',
        '**/plugin2/**'
      ]
    });

    assert(isMatch('/root/.pipcook/server/node_modules/@pipcook/daemon/dist/a.js') === true);
    assert(isMatch('/home/admin/workspace/gitlab.alibaba-inc.com/sitemeta/sitemeta-node/src/app/extend/context.ts') === false);
  })
});
