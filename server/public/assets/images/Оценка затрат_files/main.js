import { createApp } from "/node_modules/.vite/deps/vue.js?v=16535039";
import router from "/src/router.js?t=1705036736597";
import { createPinia } from "/node_modules/.vite/deps/pinia.js?v=16535039";
import App from "/src/App.vue";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
