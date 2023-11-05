import express from "express";
import { createServer as createViteServer } from "vite";
import { routerForModules } from "./core";
import { ServerEntry } from "./types";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderLinkTagsForModuleNode } from "./shared";

function isDynamicRoute(route: string) {
  return route.includes("/[");
}

function stripExtension(path: string) {
  return path.replace(/\.[^/.]+$/, "");
}

function shallowCompare(
  obj1?: Record<string, unknown>,
  obj2?: Record<string, unknown>
): boolean {
  // Check if both objects are null or undefined
  if (obj1 == obj2) {
    return true;
  }

  if (!obj1 || !obj2) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

/**
 * We can't use the vite dev server directly, because we need to do SSR.
 * Because of this, we create a custom server and use the vite server as middleware.
 */
export async function createServer() {
  console.log("Starting dev server!");
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const template = await readFileSync(
        resolve(vite.config.root, "index.html"),
        "utf-8"
      );

      const { render, routeModules, dataModules } = (await vite.ssrLoadModule(
        "/src/entry-server"
      )) as ServerEntry;

      const router = routerForModules(routeModules);

      const result = router.lookup(req.baseUrl);

      if (!result) {
        res.status(404).end("404");
        return;
      }

      const mod = routeModules[result.chunk];
      const baseRoute = stripExtension(result.chunk);
      // Try and find a data module for this route
      const dataMod =
        dataModules[`${baseRoute}.data.ts`] ||
        dataModules[`${baseRoute}.data.js`];

      const { getStaticPaths, getRouteData } = (await dataMod?.()) || {};

      const routeData = await getRouteData?.();

      let data: Awaited<
        ReturnType<typeof getStaticPaths>
      >["paths"][number]["data"];

      if (isDynamicRoute(result.chunk)) {
        const { paths } = (await getStaticPaths?.()) || {};
        const matched = paths?.find((p) =>
          shallowCompare(p.params, result.params)
        );
        data = matched?.data;
        console.log({ matched });

        if (!matched) {
          console.log("No match for dynamic route", result.chunk, paths);
          res.status(404).end("404");
          return;
        }
      }

      const context = {
        path: req.originalUrl,
        routeData,
        chunk: result.chunk,
        params: result.params,
        data,
      };

      const { body, head } = await render(context, mod, []);
      const node = vite.moduleGraph.urlToModuleMap.get(
        result.chunk.replace(/^\.\//, "/src/")
      );
      const links = node ? renderLinkTagsForModuleNode(node) : "";
      const transformed = await vite.transformIndexHtml(
        req.originalUrl,
        template
          .replace("<!--head-content-->", head + links)
          .replace("<!--app-content-->", body)
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(5173);
  console.log("Listening on http://localhost:5173");
}
