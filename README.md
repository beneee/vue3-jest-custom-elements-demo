# Vue 3 Jest + Custom Elements

This project demonstrates the issue with configuring Vue's `compilerOptions.isCustomElement` option when running component tests of components that contain custom elements ([vaadin-button](https://www.npmjs.com/package/@vaadin/vaadin-button) element in this demo) with vue3-jest.

The [`isCustomElement` compiler option](https://v3.vuejs.org/api/application-config.html#compileroptions-iscustomelement) is required to tell Vue's template compiler how to detect whether an element is a vue component or a native custom element. If Vue fails to resolve a component it will print a warning like this:

> ```
> [Vue warn]: Failed to resolve component: vaadin-button
>  If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
>    at <Anonymous ref="VTU_COMPONENT" >
>    at <VTUROOT>
> ```

Although it is possible to add `compilerOptions` to the `vue-jest` object in the `globals` section of Jest's config [which get passed to the template compiler](https://github.com/vuejs/vue-jest/blob/v27.0.0-alpha.1/packages/vue3-jest/lib/process.js#L103), this does not work properly for the `isCustomElement` function when running all test spec files at once. Even though the `isCustomElement` function was defined in Jest's config file (see extract below), Vue prints warnings to the console output that it failed to resolve a custom element component.

`globals` object from `jest.config.js`

```
globals: {
  'vue-jest': {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('vaadin-'),
    },
  },
},
```

The cause for this behavior seems to be that the `globals` object in Jest's config "must be json-serializable" (see also [`globals` [object]](https://jestjs.io/docs/configuration#globals-object) in Jest's documentation) and Jest will omit everything that can not be serialized such as functions.

Please note that Jest does not seem to omit the `isCustomElement` function from the config when running a single test file with `jest $PATH_TO_FILE/$FILE_NAME.spec.js`. It appears that serializing of the `globals` config does only happen when running multiple test spec files at once.

### Demo steps

#### 1. Running a single test spec file

Run `npm run test:counter` (or `npx jest --no-cache src/components/Counter.spec.ts`) to run the `src/components/Counter.spec.ts` test spec file only.

Even though it is not allowed to include functions in the `globals` config object according to [Jest's documentation](https://jestjs.io/docs/configuration#globals-object), Jest will properly pick up the configured `compilerOptions.isCustomElement` function from the `jest.config.js` file when running a single test spec file. In this case no warning is printed by Vue that it failed to resolve the custom element component.

#### 2. Running all test spec files at once

Run `npm run test:all` (or `npx jest --no-cache`) to run all test spec files _in bulk_.

Running all tests at once will result in warnings that Vue cannot resolve the custom element component.

Console output:

```
console.warn
  [Vue warn]: Failed to resolve component: vaadin-button
  If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
    at <Anonymous ref="VTU_COMPONENT" >
    at <VTUROOT>

  31 |

  at warn (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:6480:17)
  at resolveAsset (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:5189:13)
  at resolveComponent (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:5138:12)
  at Proxy.render (src/components/Counter.vue:33:63)
  at renderComponentRoot (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:435:44)
  at ReactiveEffect.componentUpdateFn [as fn] (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:4212:34)
  at ReactiveEffect.run (node_modules/@vue/reactivity/dist/reactivity.cjs.js:164:29)
  at callWithErrorHandling (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:6597:36)
```

#### 3. Running all test spec files at once with `--silent` option

Run `npm run test:all-silent` (or `npx jest --no-cache --silent`) to run all test spec files with Jest's `--silent` option.

Running the tests with Jest's `--silent` option will not print Vue's warnings to the console output. This seems to be the only workaround to oppress Vue's warnings that it failed to resolve the custom element components from console output.
