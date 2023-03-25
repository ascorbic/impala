export function getStaticPaths() {
  return {
    paths: [
      { params: { id: "1", title: "One" } },
      { params: { id: "2", title: "Two" } },
      { params: { id: "3", title: "Three" } },
    ],
  };
}
