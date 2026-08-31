import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://otty.run",
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "OTTY Documentation",
      pagefind: true,
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
