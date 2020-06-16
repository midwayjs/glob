# midway easy glob tools

实现一个基础轻量的 globby，为了兼容 faas-glob 语法，引入纯 js 版的 picomatch 库，除此之外，无其他依赖。

## API

```ts
import { run } from '@midwayjs/glob';

const result = run(['**/*.md'], {
  cwd: join(__dirname, './fixtures/first'),
  ignore: [
    '**/c.md',
    '**/bbbb/**'
  ]
});
console.log(result); // Output: [ '/Users/harry/project/glob/test/fixtures/first/a.md' ]

```