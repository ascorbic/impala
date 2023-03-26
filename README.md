# Impala

<p align="center">
<img src="https://user-images.githubusercontent.com/213306/227727009-a4dc391f-efb1-4489-ad73-c3d3a327704a.png" width="100" />
</p>

## Very simple Vite static site generator

Impala is a bare-bones static-site generator, powered by [Vite](https://github.com/vitejs/vite). It currently supports just [React](https://github.com/facebook/react). Features include:

- SSG-only, MPA-only. It's iMPAla, not iSPAla.
- File-based routing, with a syntax like [Astro](https://github.com/withastro/astro) and [Solid Start](https://github.com/solidjs/solid-start)
- Static and dynamic routes
- Astro and [Next.js](https://github.com/vercel/next.js/)-inspired data fetching in `getStaticPaths`, and `getRouteData`
- Route-level code-splitting
- Optionally JS-free

## Usage

## Routing

Create pages in `src/routes` and they will be available as routes in your site. For example, `src/routes/about.tsx` will be available at `/about`. You can also create dynamic routes, like `src/routes/blog/[slug].tsx`, but you'll need to add a `[slug].data.ts` file with a `getStaticPaths` function to tell Impala what paths to generate and the data to use.

You can also do catch-all routes, like `src/routes/blog/[...slug].tsx`, which also needs a `[...slug].data.ts` file with a `getStaticPaths` function.

## Data fetching

For dynamic routes you should fetch data in `getStaticPaths`. For static routes you should fetch data in `getRouteData`. For example, if you have a route at `src/routes/blog/[slug].tsx`, you should create a `src/routes/blog/[slug].data.ts` file with a `getStaticPaths` function. This function should return an array of paths to generate, and the data to use for each path.

See the demo site for more.

## FAQ

### Why did you build this?

Mainly to learn, but also because there's no statically-rendered [create-react-app](https://github.com/facebook/create-react-app) equivalent. I often want a simple React site with static rendering but no SSR. Astro is awesome, but I want something that's just React.

### Should I use this in production?

Dear god no. Don't use it at all yet. It's not even alpha.

### Does it support SSR

Deliberately not. If you want SSR, use Astro.

### Does it support client-side navigation?

Deliberately not. If you want client-side navigation, use one of the many other SPA frameworks.

### Does it support other frontend frameworks?

I started with React because it's the one most obviously lacking a basic SSG, but the React-specific code is in a separate package and I want to add support for other frameworks.

## License

Copyright © 2023 Matt Kane. Licenced under the MIT licence.

Impala logo created by [Freepik - Flaticon](https://www.flaticon.com/free-icons/impala)
