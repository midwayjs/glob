import { run } from '../src/index';
import { join } from 'path';
import * as assert from 'assert';

describe('test', () => {
  it('test run', async () => {
    const result = await run(['**/*.md', '!**/bbbb/**'], {
      cwd: join(__dirname, './fixtures/first')
    });
    assert.deepEqual(result, [ join(process.cwd(), 'test/fixtures/first/a.md') ]);
  });
});