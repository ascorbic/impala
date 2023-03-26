export type ModuleImports<TModule = unknown> = Record<
  string,
  () => Promise<TModule>
>;

export interface Context<TData = unknown, TRouteData = unknown> {
  path: string;
  chunk: string;
  data?: TData;
  routeData?: TRouteData;
  params?: Record<string, string>;
}

export interface RouteModule<TElement = HTMLElement> {
  default: TElement;
}

export interface StaticDataModule<TRouteData = unknown> {
  getRouteData?: () => Promise<TRouteData> | TRouteData;
}

export interface DynamicDataModule<
  TPathData extends Record<string, unknown> = Record<string, string>,
  TRouteData extends Record<string, unknown> = Record<string, string>
> extends StaticDataModule<TRouteData> {
  getStaticPaths: () =>
    | Promise<{ paths: Array<PathInfo<TPathData>> }>
    | { paths: Array<PathInfo<TPathData>> };
}

export interface PathInfo<TData = Record<string, string>> {
  params: Record<string, string>;
  data?: TData;
}

export type RouteModuleFunction<TElement = HTMLElement> = () => Promise<
  RouteModule<TElement>
>;

export interface ServerEntry<TElement = HTMLElement> {
  routeModules: ModuleImports<RouteModule<TElement>>;
  dataModules: ModuleImports<DataModule>;
  render(
    context: Context,
    mod: RouteModuleFunction<TElement>,
    bootstrapModules?: Array<string>
  ): Promise<{
    body: string;
    head: string;
  }>;
}

export type DataModule = DynamicDataModule;

export type DataType<Mod extends DynamicDataModule> =
  StaticPaths<Mod>["paths"][number];

export type ReturnTypeIfDefined<T extends ((...args: any) => any) | undefined> =
  T extends undefined ? undefined : ReturnType<Exclude<T, undefined>>;

export type AwaitedIfPromise<T> = T extends PromiseLike<any> ? Awaited<T> : T;
export type StaticPaths<Mod extends DynamicDataModule> = AwaitedIfPromise<
  ReturnTypeIfDefined<Mod["getStaticPaths"]>
>;

export type RouteData<Mod extends StaticDataModule> = AwaitedIfPromise<
  ReturnTypeIfDefined<Mod["getRouteData"]>
>;

export interface StaticRouteProps<
  Mod extends StaticDataModule | undefined = undefined
> {
  path: string;
  routeData?: Mod extends undefined
    ? undefined
    : RouteData<Exclude<Mod, undefined>>;
}

export interface DynamicRouteProps<Mod extends DynamicDataModule>
  extends StaticRouteProps<Mod> {
  params: DataType<Mod>["params"];
  data: DataType<Mod>["data"];
}
