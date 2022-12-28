import type { Plugin as VitePlugin } from "vite";
import type { Pluggable } from "unified";

import { readFile } from "fs/promises";
import { join } from "path";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

type ViteUnifiedPluginOptions = {
  remarkPlugins?: Pluggable[];
  rehypePlugins?: Pluggable[];
};

export default function vitePlugin({
  remarkPlugins = [],
  rehypePlugins = [],
}: ViteUnifiedPluginOptions = {}): VitePlugin {
  // unified plugin stack
  const unifiedPlugins = [
    remarkParse,
    ...remarkPlugins,
    remarkRehype,
    ...rehypePlugins,
    rehypeStringify,
  ];

  const compiler = unified().use(unifiedPlugins);

  let rootPath = process.cwd();

  return {
    name: "vite-remark-rehype-server",

    configResolved(config) {
      rootPath = config.root;
    },

    async transform(code, id) {
      if (id.endsWith(".md")) {
        const htmlContent = await compiler.process(code);

        return {
          code: `export default ${JSON.stringify(
            htmlContent.toString("utf8")
          )}`,
          map: { mappings: "" },
        };
      }
    },

    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.endsWith(".md")) {
          return next();
        }

        try {
          const fileContent = await readFile(join(rootPath, req.url));
          const htmlContent = await compiler.process(fileContent);

          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(htmlContent.toString("utf-8"));
        } catch {
          next();
        }
      });
    },
  };
}
