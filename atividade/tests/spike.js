import http from 'k6/http';
import { check } from 'k6';

export let options = {
  scenarios: {
    normal: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
    spike: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 300 },
        { duration: '1m', target: 300 },
        { duration: '10s', target: 10 },
      ],
    }
  },
};

export default function () {
  const url = 'http://localhost:3000/checkout/simple';
  const payload = JSON.stringify({ items: [{ id: 'sku-1', qty: 1 }] });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);

  check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
}
