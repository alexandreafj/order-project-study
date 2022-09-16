import http from "k6/http";
import { check, sleep } from "k6";

// export let options = {
//   vus: 10,
//   duration: "30s",
// };
// Stages: ramping up/down VUs
export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "25s", target: 10 },
    { duration: "20s", target: 5 },
  ],
};
export default function () {
  const res = http.get("http://localhost:8080/item");
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
