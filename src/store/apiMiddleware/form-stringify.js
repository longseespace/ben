// stringify a body object and add request headers
import qs from 'qs';

const formStringify = next => req => {
  // only stringify POST, PUT, PATCH requests with body is an object
  if (
    req.method &&
    req.method.match(/POST|PUT|PATCH/) &&
    typeof req.form === 'object'
  ) {
    const body = qs.stringify(req.form);
    const headers = {
      ...req.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return next({ ...req, body, headers });
  }

  return next(req);
};

export default formStringify;
