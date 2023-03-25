import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { compile } from "path-to-regexp";
import { convertPathToPattern } from "./core";
import { Context, RouteModuleFunction, ServerEntry } from "./types";

function isDynamicRoute(route: string) {
  return route.includes("/[");
}

function stripExtension(path: string) {
  return path.replace(/\.[^/.]+$/, "");
}
export async function prerender(root: string) {
  const manifestPath = path.resolve(root, "dist/static/manifest.json");
  if (!existsSync(manifestPath)) {
    console.error(
      `Cannot find manifest.json at ${manifestPath}. Did you build the site?`
    );
    return;
  }
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));

  const main = manifest["src/entry-client.tsx"].file;

  const { render, routeModules, dataModules } = (await import(
    path.resolve(root, "./dist/server/entry-server.js")
  )) as ServerEntry;

  async function prerenderRoute(context: Context, mod: RouteModuleFunction) {
    const appHtml = await render(context, mod, [main]);

    const filePath = `dist/static${
      context.url === "/" ? "/index" : context.url
    }.html`;

    const dir = path.dirname(path.resolve(root, filePath));
    if (!existsSync(dir)) {
      await fs.mkdir(dir, {
        recursive: true,
      });
    }
    if (!(await fs.stat(dir)).isDirectory()) {
      console.error(`Cannot create directory: ${dir}`);
      return;
    }

    await fs.writeFile(filePath, appHtml);
    console.log("pre-rendered:", filePath);
  }

  for (const route in routeModules) {
    if (Object.hasOwnProperty.call(routeModules, route)) {
      const mod = routeModules[route];
      const baseRoute = stripExtension(route);
      const dataMod =
        dataModules[`${baseRoute}.data.ts`] ||
        dataModules[`${baseRoute}.data.js`];

      const { getStaticPaths, getRouteData } = (await dataMod?.()) || {};

      const routeData = await getRouteData?.();
      const routePattern = convertPathToPattern(route) || "/";

      if (isDynamicRoute(route)) {
        console.log(`pre-rendering dynamic route: ${route}`);
        if (!dataMod) {
          console.warn(`No data module found for dynamic route: ${route}`);
          console.warn(
            `You should export 'getStaticPaths' from ${baseRoute}.data.ts`
          );
          continue;
        }

        if (!getStaticPaths) {
          console.warn(
            `No 'getStaticPaths' export found in ${baseRoute}.data.ts. No pages will be generated.`
          );
          continue;
        }

        const toPath = compile(routePattern, { encode: encodeURIComponent });

        const { paths } = await getStaticPaths();

        await Promise.all(
          paths.map((path) => {
            const url = toPath(path.params);
            if (!url) {
              console.error(`Invalid path params for route: ${route}`);
              return;
            }
            return prerenderRoute(
              {
                url,
                routeData,
                chunk: route,
                params: path.params,
                data: path.data,
              },
              mod
            );
          })
        );
      } else {
        await prerenderRoute(
          { url: routePattern, chunk: route, routeData },
          mod
        );
      }
    }
  }
}
