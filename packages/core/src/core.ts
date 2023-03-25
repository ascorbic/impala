export * from "./types";

export function convertPathToPattern(input: string): string {
  return input
    .replace(/^\.\/routes/, "")
    .replace(/(\/index)?\.[jt]sx?$/, "")
    .replace(/(?:\[(\.{3})?(\w+)\])/g, (_match, isCatchAll, paramName) => {
      if (isCatchAll) {
        return `:${paramName}*`;
      } else {
        return `:${paramName}`;
      }
    });
}
