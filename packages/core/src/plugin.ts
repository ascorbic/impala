import { Plugin, ResolvedConfig } from "vite";

export default function plugin(): Plugin {
  // const virtualModuleId = "virtual:route-manifest";

  let config: ResolvedConfig;
  // const resolvedVirtualModuleId = "\0" + virtualModuleId;
  // console.log("resolvedVirtualModuleId", resolvedVirtualModuleId);
  return {
    name: "impala-plugin",

    config(config) {
      config.build ||= {};
      config.build.manifest = true;

      if (config.build.ssr) {
        if (config.build.ssr === true) {
          config.build.ssr = "src/entry-server";
        }
        config.build.outDir ||= "dist/server";
      } else {
        config.build.outDir ||= "dist/static";
        config.build.ssrManifest = true;
        config.build.rollupOptions ||= {};
        config.build.rollupOptions.input ||= "index.html";
      }
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    // resolveId(id, source) {
    //   if (id === virtualModuleId) {
    //     return resolvedVirtualModuleId;
    //   }
    // },
    // load(id) {
    //   // if (id.endsWith("tsx")) {
    //   //   console.log("id", this.getModuleInfo(id));
    //   // }
    //   if (id === resolvedVirtualModuleId) {
    //     return `export const msg = "from virtual module"`;
    //   }
    // },
  };
}
