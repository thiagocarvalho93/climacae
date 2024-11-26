import { boot } from "quasar/wrappers";
import axios from "axios";

const baseURL = process.env.DEV
  ? "http://localhost:5288/"
  : "https://api.weather.com/v2";

const api = axios.create({ baseURL });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
