import axios from "axios";

const depBackendUrl = "https://hand-made-sindh-backend.vercel.app/";
// const devBackendUrl = "http://localhost:1337";

export default axios.create({
  baseURL: depBackendUrl,
});
