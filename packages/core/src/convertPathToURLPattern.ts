export function convertPathToPattern(path: string): string {
  return path
    .replace(/(\/index)?\.[jt]sx?$/, "")
    .replace(/(?:\[(\.{3})?(\w+)\])/g, (_match, isCatchAll, paramName) => {
      if (isCatchAll) {
        return `:${paramName}*`;
      } else {
        return `:${paramName}`;
      }
    });
}

type Segment = {
  content: string;
  isDynamic: boolean;
  isCatchAll: boolean;
};

type Pattern = {
  segments: Array<Segment>;
  pattern: string;
};

function convertPatternToSegments(pattern: string): Array<Segment> {
  return pattern.split("/").map((content) => {
    const isDynamic = content.startsWith(":");
    const isCatchAll = isDynamic && content.endsWith("*");
    return {
      content,
      isDynamic,
      isCatchAll,
    };
  });
}

function comparePatterns(a: Pattern, b: Pattern): number {
  const length = Math.max(a.segments.length, b.segments.length);
  for (let index = 0; index < length; index++) {
    const p1 = a.segments[index];
    const p2 = b.segments[index];

    if (p1 === undefined) {
      // b is more specific
      return 1;
    }
    if (p2 === undefined) {
      // a is more specific
      return -1;
    }
    if (p1.isCatchAll && !p2.isCatchAll) {
      // b is more specific
      return 1;
    }
    if (p2.isCatchAll && !p1.isCatchAll) {
      // a is more specific
      return -1;
    }
    if (p1.isDynamic && !p2.isDynamic) {
      // b is more specific
      return 1;
    }
    if (p2.isDynamic && !p1.isDynamic) {
      // a is more specific
      return -1;
    }
  }
  // if we get here, fall back to string comparison
  return a.pattern.localeCompare(b.pattern);
}

function sortPatterns(patterns: Array<string>): Array<string> {
  return Array.from(new Set(patterns))
    .map((pattern) => {
      return {
        segments: convertPatternToSegments(pattern),
        pattern,
      };
    })
    .sort(comparePatterns)
    .map((pattern) => pattern.pattern);
}
