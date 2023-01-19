# vite-plugin-remark-rehype

## tl;dr

This plugin allows you to import markdown files, add remark/rehype plugins to process the markdown files prior import as well as viewing markdown files directly from the vite dev server.

## How to use

```ts
import { defineConfig } from "vite";
import remarkRehypePlugin from "vite-plugin-remark-rehype";

export default defineConfig({
  plugins: [
    remarkRehypePlugin(),
  ],
});
```

## Adding type support

In your `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-remark-rehype/types"]
  }
}
```

Or you can add a `.d.ts` file in your project root containing

```ts
declare module "*.md" {
  const html: string;
  export default html;
}
```

## Configuring Remark/Rehype

```ts
import { defineConfig } from "vite";
import remarkRehypePlugin from "vite-plugin-remark-rehype";

import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import rehypeSanitize from "rehype-sanitize";

export default defineConfig({
  plugins: [
    remarkRehypePlugin({
      remarkPlugins: [remarkA11yEmoji],
      rehypePlugins: [rehypeSanitize],
    }),
  ],
});
```

### Using the markdown

```ts
import html from './test.md'
document.getElementById('markdown').innerHTML = html
```

### Previewing markdown

You can directly browse `http://localhost:5173/markdown.md` and it will be processed and served.
