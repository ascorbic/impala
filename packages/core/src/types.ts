export type ModuleImports<TModule = unknown> = Record<
  string,
  () => Promise<TModule>
>;

export interface Context<TData = unknown> {
  url: string;
  chunk: string;
  data?: TData;
  routeData?: Record<string, string>;
  params?: Record<string, string>;
}

export interface RouteModule<TElement = HTMLElement> {
  default: TElement;
}

export interface DataModule<
  TPathData extends Record<string, unknown> = Record<string, string>,
  TRouteData extends Record<string, unknown> = Record<string, string>
> {
  getStaticPaths: () => Promise<{ paths: Array<PathInfo<TPathData>> }>;
  getRouteData: () => Promise<TRouteData>;
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
