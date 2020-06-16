# midway easy glob tools

实现一个基础轻量的 globby，为了兼容 faas-glob 语法，引入纯 js 版的 picomatch 库，除此之外，无其他依赖。

## API

```ts
import { run } from '@midwayjs/glob';

const result = await run(['**/*.md', '!**/bbbb/**'], {
  cwd: join(__dirname, './fixtures/first'),
  ignore: [
    '**/c.md'
  ]
});
console.log(result); // Output: [ '/Users/harry/project/glob/test/fixtures/first/a.md' ]

```