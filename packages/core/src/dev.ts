import express from "express";
import { createServer as createViteServer } from "vite";
import { routerForModules } from "./core";
import { ServerEntry } from "./types";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function isDynamicRoute(route: string) {
  return route.includes("/[");
}

function stripExtension(path: string) {
  return path.replace(/\.[^/.]+$/, "");
}

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
        "/src/entry-server.tsx"
      )) as ServerEntry;

      const router = routerForModules(routeModules);

      const result = router.lookup(req.originalUrl);

      if (!result) {
        res.status(404).end("404");
        return;
      }

      const mod = routeModules[result.chunk];
      const baseRoute = stripExtension(result.chunk);
      const dataMod =
        dataModules[`${baseRoute}.data.ts`] ||
        dataModules[`${baseRoute}.data.js`];

      const { getStaticPaths, getRouteData } = (await dataMod?.()) || {};

      const routeData = await getRouteData?.();

      if (isDynamicRoute(result.chunk)) {
        const paths = await getStaticPaths?.();
      }

      const context = {
        url: req.originalUrl,
        routeData,
        chunk: result.chunk,
        params: result.params,
        // data: path.data,
      };

      const { body, head } = await render(context, mod, []);

      const transformed = await vite.transformIndexHtml(
        req.originalUrl,
        template
          .replace("<!--head-content-->", head)
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
