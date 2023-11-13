# Single-SPA setup

This setup should help you get going with any Single-SPA Appmore.
The setup is structured as Following:

`root-config` our root project

`microfrontend-01` first Micro-frontend

`microfrontend-02` second Micro-frontend

An detailed explanation comes after the following category:

## Running it

To run everything, simply type the following commands from the [root-directory](./):

`npm run install:all && npm run dev`

`npm run install:all` To install all dependencies

`npm run dev` To start all dev servers concurrently

Visit the App under [http://localhost:3000](http://localhost:3000)

## Explanation of the functionality

### [root-config](./root-config/)

The `root-config` is the Main Application core. To keep it simple we use it to manage and load in our micro-frontend's.

Inside of the [index.html](./root-config/index.html)
We import our shared dependencies and our Micro-frontends. This is how module's are loaded in. We also have a local importmap.json for use on demand. (This is also where we assign names to our Micro frontends and assign under which port the dev server is accessible.)

Inside of the [microfrontend-layout](./root-config/src/microfrontend-layout.html)
We define which Micro-frontend is being loaded under which route. As an example I loaded the [microfrontend-01](./microfrontend-01/) under the route / and [microfrontend-02](./microfrontend-02/) under the route /02

Inside of the [main.ts](./root-config/src/main.ts)
We load the modules and map them to the actual route and handle additional Logic.

### Micro frontends

Creation: Just copy [microfrontend-01](./microfrontend-01/) Into a new directory and work from there.

Explanation:
The `microfrontend-xx` describes one micro-frontend of our application.

Inside of the [vite.config.ts](./microfrontend-01/vite.config.ts)

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "esm",
      },
    },
    external: externalDependencies,
  },
  plugins: [
    vue(),
    externalize({ externals: externalDependencies }),
    vitePluginSingleSpa({
      serverPort: 3002,
      type: "mife",
      spaEntryPoint: "./src/main.ts",
    }),
  ],
});
```

We can configure:

1. The default build options
2. external dependencies | We can share dependencies between projects, this is being used as an example for single-spa. This reduces the amount of code overhead.
3. We define the vitePluginSingleSpa | In there we need to define the type to "mife" to signalize that this is a child Project, we need to define the entry point and the server port of this Micro SPA frontend. This port needs to reflect what we use in our [index.html](./root-config/index.html) to import the `main.ts` file. There we can also assign a name for this frontend.

Inside of the [main.ts](./microfrontend-01/src/main.ts)
We make a Micro-frontend Accessible to be used within other pages. There are many plugins, in our case we use singleSpaVue for Vue 3.
The code looks as follows:

```ts
import App from "./App.vue";
import { h, createApp } from "vue";
import singleSpaVue from "single-spa-vue";

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {
        // single-spa props are available on the "this" object. Forward them to your component as needed.
      });
    },
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```

Inside of here we define that it's a Single Spa Page, additionally we have our bindings.
The important exports at the bottom allow this system to communicate with our [root-config](./root-config/).

All of this allows for an easy integration of Vue apps into single-spa. You can use [singleSpaVue](https://www.npmjs.com/package/single-spa-vue) and [vite-plugin-single-spa](https://www.npmjs.com/package/vite-plugin-single-spa) to integrate an existing project into SPA.

### Why this approach?

1. Maintainability: We are not bound by a Framework in our root project. This way our [root-config](./root-config/) stays lightweight and flexible and is easier to maintain over the long term.
2. Dev Servers: Each module runs a stand-alone Dev server, this allows us to configure each server as required and prevents the case that our [root-config](./root-config/) has to include the configuration of the entire project.
3. HMR: Hot module reloading is fully functional, this will allow us to develop our entire Application under port 3000 and still keep all advantages from a local dev server. Additionally, as long configured correctly we still can run each Micro-frontend Independently.
4. In the future, we can upgrade each Frontend to our current Vue version or use multiple Vue project versions at once. This allows for a granular update or prevents us from a forced full project update.
5. Dependency Sharing: with this approach, we can reduce the load of each Micro frontend by sharing dependencies between all of them.
6. Docker intercompatible: As long as the project has a port with a dev server open we can use it inside of our SPA. This allows us to run specific portions of our dev environments within docker in dev mode.

Resulting we have a highly configurable and flexible setup for future development. The main drawback is the manual assignment of the port
