# Impala

<p align="center">
<img src="https://user-images.githubusercontent.com/213306/227727009-a4dc391f-efb1-4489-ad73-c3d3a327704a.png" width="100" />
</p>

## Very simple Vite static site generator

Impala is a bare-bones static-site generator, powered by Vite. It currently supports just React. Features include:

- SSG-only, MPA-only. It's iMPAla, not iSPAla.
- File-based routing, with a syntax like Astro and Solid Start
- Static and dynamic routes
- Astro and Next.js-inspired data fetching in `getStaticPaths`, and `getRouteData`
- Route-level code-splitting
- Optionally JS-free

## Usage

See the demo site for now

## FAQ

### Why did you build this?

Mainly to learn, but also because there's no statically-rendered create-react-app equivalent. I often want a simple React site with static rendering but no SSR. Astro is awesome, but I want something that's just React.

### Should I use this in production?

Dear god no. Don't use it at all yet. It's not even alpha.

### Does it support SSR

Deliberately not. If you want SSR, use Astro.

### Does it support client-side navigation?

Deliberately not. If you want client-side navigation, use one of the many other SPA frameworks.

### Does it support other frontend frameworks?

I started with React because it's the one most obviously lacking a basic SSG, but the React-specific code is in a separate package and I want to add support for other frameworks.
