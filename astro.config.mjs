import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import { latestDownloadsMdx } from "./scripts/latest-downloads-mdx.mjs";

export default defineConfig({
  site: "https://otty.run",
  output: "static",
  trailingSlash: "always",
  markdown: {
    processor: unified({ remarkPlugins: [latestDownloadsMdx] }),
  },
  integrations: [
    starlight({
      title: "OTTY Documentation",
      customCss: ["./src/styles/site.css"],
      components: {
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
        ThemeProvider: "./src/components/starlight/DarkTheme.astro",
        ThemeSelect: "./src/components/starlight/ThemeSelect.astro",
        PageSidebar: "./src/components/starlight/PageSidebar.astro",
      },
      pagefind: true,
      sidebar: [{ autogenerate: { directory: "docs" } }],
      social: [
        {
          icon: "github",
          label: "OTTY on GitHub",
          href: "https://github.com/otty-shell/otty",
        },
      ],
    }),
  ],
});
