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
  const { render, routeModules, dataModules } = (await import(
    path.resolve(root, "./dist/server/entry-server.js")
  )) as ServerEntry;

  const template = await fs.readFile(
    path.resolve(root, "./dist/static/index.html"),
    "utf-8"
  );

  async function prerenderRoute(context: Context, mod: RouteModuleFunction) {
    const { body, head } = await render(context, mod, []);

    const appHtml = template
      .replace("<!--head-content-->", head)
      .replace("<!--app-content-->", body);

    const filePath = `dist/static${
      context.path === "/" ? "/index" : context.path
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
          paths.map((pathInfo) => {
            const path = toPath(pathInfo.params);
            if (!path) {
              console.error(`Invalid path params for route: ${route}`);
              return;
            }
            return prerenderRoute(
              {
                path,
                routeData,
                chunk: route,
                params: pathInfo.params,
                data: pathInfo.data,
              },
              mod
            );
          })
        );
      } else {
        await prerenderRoute(
          { path: routePattern, chunk: route, routeData },
          mod
        );
      }
    }
  }
}
