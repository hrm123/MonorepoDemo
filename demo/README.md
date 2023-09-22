# pages-landing-page

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test pages-landing-page` to execute the unit tests via [Jest](https://jestjs.io).

npx create-nx-workspace
npm install --save-dev @nx/next
nx g @nx/next:app landing-page
nx g @nx/next:lib components
nx g @nx/next:component product-card --project=components --export
nx g @nx/next:page about-us --project=landing-page
nx g @nx/next:lib pages-about-us
nx g @nx/react:setup-tailwind --project=landing-page   
nx serve landing-page

https://nx.dev/concepts/more-concepts/micro-frontend-architecture  