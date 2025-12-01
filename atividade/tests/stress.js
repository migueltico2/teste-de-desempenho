import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export let reqDur = new Trend('request_duration');

export let options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'],
  },
};

export default function () {
  const url = 'http://localhost:3000/checkout/crypto';
  const payload = JSON.stringify({ data: 'some data to hash', iterations: 1000 });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);

  reqDur.add(res.timings.duration);
  check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
}
