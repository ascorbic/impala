import { Plugin, ResolvedConfig, Manifest } from "vite";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
interface ASTNode {
  type: string;
  start: number;
  end: number;
  body?: Array<ASTNode>;
  id?: ASTNode;
  expression?: ASTNode;
  declaration?: ASTNode;
  declarations?: Array<ASTNode>;
  name?: string;
  specifiers?: Array<ASTNode>;

  value?: string;
  exported?: ASTNode;
}

/**
 * Checks if the node has a string literal at the top level that matches the statement
 */
const hasPragma = (ast: ASTNode, statement: string) =>
  ast.body?.some((node) => {
    return (
      node.type === "ExpressionStatement" &&
      node.expression?.type === "Literal" &&
      node.expression.value === statement
    );
  });

const getExports = (ast: ASTNode) => {
  const exports: Array<string> = [];
  ast.body?.forEach((node) => {
    if (node.type === "ExportDefaultDeclaration") {
      exports.push("default");
    }
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration?.type === "VariableDeclaration") {
        node.declaration?.declarations?.forEach((declaration) => {
          const name = declaration?.id?.name;
          if (name) {
            exports.push(name);
          }
        });
        return;
      }

      if (node.declaration?.type === "FunctionDeclaration") {
        const name = node.declaration?.id?.name;
        if (name) {
          exports.push(name);
        }
        return;
      }

      if (node.specifiers?.length) {
        node.specifiers.forEach((specifier) => {
          const name = specifier?.exported?.name;
          if (name) {
            exports.push(name);
          }
        });
      }
    }
  });
  return exports;
};

export default function plugin({
  serverDist = "dist/server",
  clientDist = "dist/static",
}: {
  serverDist?: string;
  clientDist?: string;
}): Plugin {
  const clientPragma = "use client";
  const serverPragma = "use server";
  let externals = new Set<string>();
  let config: ResolvedConfig;
  let isSsr: boolean;
  let isBuild: boolean;
  let manifest: Manifest = {};

  const bundleMap = new Map();
  const clientModuleId = "virtual:client-bundle-map";
  const resolvedClientModuleId = "\0" + clientModuleId;
  const serverModuleId = "virtual:server-bundle-map";
  const resolvedServerModuleId = "\0" + serverModuleId;

  const clientBundleMapFilename = "client-bundle-map.json";
  const serverBundleMapFilename = "server-bundle-map.json";

  return {
    name: "vite-plugin-extract-server-components",

    config(config) {
      config.build ||= {};
      if (config.build.ssr) {
        const manifestPath = path.join(
          config.root || "",
          clientDist,
          "manifest.json"
        );
        if (existsSync(manifestPath)) {
          manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
        }
        config.build.rollupOptions ||= {};
        config.build.rollupOptions.external = (id) => externals.has(id);
      }
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isSsr = !!config.build.ssr;
      isBuild = config.command === "build";
    },
    resolveId(id, source) {
      if (id === clientModuleId) {
        return resolvedClientModuleId;
      }
      if (id === serverModuleId) {
        return resolvedServerModuleId;
      }
    },
    load(id) {
      if (id === resolvedClientModuleId) {
        return `export default ${JSON.stringify(
          // Yes the client bundle map is in the server dist because
          // it's the SSR build that generates the client bundle map
          path.join(config.root || "", serverDist, clientBundleMapFilename)
        )}`;
      }
      if (id === resolvedServerModuleId) {
        return `export default ${JSON.stringify(
          path.join(config.root || "", clientDist, serverBundleMapFilename)
        )}`;
      }
    },
    transform(code, id) {
      // Short circuit if the file doesn't have the literal string
      if (!code?.includes(clientPragma)) {
        return;
      }
      // Check properly for the pragma
      const ast = this.parse(code, { sourceType: "module" });
      const localId = path.relative(config.root || "", id);
      if (hasPragma(ast, clientPragma)) {
        if (isSsr) {
          const bundlePath = pathToFileURL(
            path.join(config.root, clientDist, manifest[localId].file)
          );
          externals.add(bundlePath.href);
          if (manifest[localId]) {
            const exports = getExports(ast);
            const exportProxies = exports
              .map((name) => {
                const symbolName = `${manifest[localId].file}#${name}`;
                bundleMap.set(symbolName, {
                  id: symbolName,
                  chunks: [],
                  name,
                  async: true,
                });
                const localName = name === "default" ? "DefaultExport" : name;

                return `
                import { ${
                  name === "default" ? "default as DefaultExport" : name
                } } from ${JSON.stringify(
                  bundlePath.href
                )};${localName}.$$typeof = Symbol.for("react.client.reference");${localName}.$$id=${JSON.stringify(
                  symbolName
                )}; export ${
                  name === "default" ? "default DefaultExport" : `{ ${name} }`
                } `;
              })
              .join("\n");
            return {
              code: exportProxies,
              map: { mappings: "" },
            };
          }
        } else {
          this.emitFile({
            type: "chunk",
            id,
            preserveSignature: "allow-extension",
          });
        }
      }

      // todo, work out how to handle server only code
      // if (hasPragma(ast, serverPragma)) {
      // }
    },
    generateBundle() {
      if (isBuild && isSsr) {
        this.emitFile({
          type: "asset",
          fileName: serverBundleMapFilename,
          source: JSON.stringify(Object.fromEntries(bundleMap)),
        });
      }
    },
  };
}
