import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{type:single}': ['p(95)<500'],
    'errors': ['rate<0.01'],
  },
};

export default function () {
  const url = 'http://localhost:3000/checkout/simple';
  const payload = JSON.stringify({ items: [{ id: 'sku-1', qty: 1 }], customerId: 'user-1' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);

  const ok = res.status >= 200 && res.status < 300;
  check(res, { 'status 2xx': () => ok });

  if (!ok) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }
}
