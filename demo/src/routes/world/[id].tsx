import { App } from "../../App";

export interface PathInfo<TData = Record<string, string>> {
  params: Record<string, string>;
  data?: TData;
}

export interface DataModule<
  TPathData extends Record<string, unknown> = Record<string, string>,
  TRouteData extends Record<string, unknown> = Record<string, string>
> {
  getStaticPaths: () =>
    | Promise<{ paths: Array<PathInfo<TPathData>> }>
    | { paths: Array<PathInfo<TPathData>> };
  getRouteData?: () => Promise<TRouteData>;
}
type DataType<Mod extends DataModule> =
  StaticPaths<Mod>["paths"][number]["params"];

type StaticPaths<Mod extends DataModule> = (ReturnType<
  Mod["getStaticPaths"]
> extends PromiseLike<any>
  ? Awaited<ReturnType<Mod["getStaticPaths"]>>
  : ReturnType<Mod["getStaticPaths"]>) &
  (unknown & {});

export default function Hello({
  url,
  params,
}: {
  url: string;
  params: DataType<typeof import("./[id].data")>;
}) {
  return (
    <App title={params.title}>
      <div>Hello {url}!</div>
    </App>
  );
}
