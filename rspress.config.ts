import * as path from "path";
import { defineConfig } from "rspress/config";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "ajh's Blog",
  icon: "/fufu.jpeg",
  base: "./",
  description: "FE Blog Powered by Rspress",
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/aojunhao123",
      },
    ],
    outlineTitle: "目录",
  },
  globalStyles: path.join(__dirname, "./docs/global.css"),
  builderConfig: {},
});
