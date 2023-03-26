export function getStaticPaths() {
  return {
    paths: [
      { params: { id: "1" }, data: { title: "One", description: "Page one" } },
      { params: { id: "2" }, data: { title: "Two", description: "Page two" } },
      {
        params: { id: "3" },
        data: { title: "Three", description: "Page three" },
      },
    ],
  };
}
