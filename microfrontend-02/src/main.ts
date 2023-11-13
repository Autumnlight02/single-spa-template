const App = require("./App.vue");
const { h, createApp } = require("vue");
const singleSpaVue = require("single-spa-vue");

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {
        // single-spa props are available on the "this" object. Forward them to your component as needed.
        // https://single-spa.js.org/docs/building-applications#lifecycle-props
        // if you uncomment these, remember to add matching prop definitions for them in your App.vue file.
        /*
        name: this.name,
        mountParcel: this.mountParcel,
        singleSpa: this.singleSpa,
        */
      });
    },
  },
});

createApp(App).mount("#app"); // required for standalone -> only run in standalone

exports.bootstrap = vueLifecycles.bootstrap;
exports.mount = vueLifecycles.mount;
exports.unmount = vueLifecycles.unmount;
