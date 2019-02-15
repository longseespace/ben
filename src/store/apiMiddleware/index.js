import { composeAdapters, createAPIMiddleware } from 'redux-api-call';

import fetch from 'redux-api-call-adapter-fetch';
import json from 'redux-api-call-adapter-json';

import querify from './querify';
import jsonStringify from './json-stringify';
import formStringify from './form-stringify';
import slackOK from './slack-ok';

export default createAPIMiddleware(
  composeAdapters(jsonStringify, formStringify, slackOK, json, querify, fetch)
);
