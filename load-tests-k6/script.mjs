import http from "k6/http";
import { check, sleep } from "k6";
// run script -> k6 run {script name}
// export let options = {
//   vus: 100,
//   duration: "30s",
// };
// Stages: ramping up/down VUs
export const options = {
  stages: [
    { duration: "30s", target: 100000 },
    { duration: "25s", target: 50 },
    { duration: "20s", target: 25 },
  ],
};
export default function () {
  const res = http.get("http://localhost:3000");
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
