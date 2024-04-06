/// <reference types="@rsbuild/core/types" />
import Theme from "rspress/theme";
import img from "./assets/fufu.jpeg";

const Layout = () => (
  <Theme.Layout
    beforeNavTitle={<img className="w-30 h-30 mr-4" src={img} />}
  />
);

export default {
  ...Theme,
  Layout,
};

export * from "rspress/theme";
