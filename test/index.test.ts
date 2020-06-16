import { run } from '../src/index';
import { join } from 'path';
import * as assert from 'assert';

describe('test', () => {
  it('test run', async () => {
    const result = await run(['**/*.md', '!**/bbbb/**'], {
      cwd: join(__dirname, './fixtures/first')
    });
    assert.deepEqual(result, [ '/Users/harry/project/glob/test/fixtures/first/a.md' ]);
  });
});