import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/health');
  check(res, {
    'status is 200': (r) => r.status === 200
  });
}
