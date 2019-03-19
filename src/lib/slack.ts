import qs from 'qs';
import { StringMap } from '../constants';

const Keychain = RQ.keychain();

export function apiCall(method: string, data: object) {
  const url = `https://slack.com/api/${method}`;
  return fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: qs.stringify(data),
  })
    .then(resp => resp.json())
    .then(json => {
      if (json.ok) {
        return json;
      }

      throw json;
    });
}

export async function signInWithPassword(
  domain: string,
  email: string,
  password: string
) {
  try {
    const teamJson = await apiCall('auth.findTeam', { domain });
    const json = await apiCall('auth.signin', {
      team: teamJson.team_id,
      email,
      password,
    });
    return json;
  } catch (error) {
    return error;
  }
}

export async function rtmConnect(token: string) {
  const connectJson = await apiCall('rtm.connect', {
    token,
    batch_presence_aware: 1,
  });

  if (connectJson.ok) {
    const ws = new WebSocket(connectJson.url);
    return ws;
  }
  return false;
}

type TokenEntry = {
  teamId: string;
  token: string;
};

export type TokenPairs = StringMap<TokenEntry>;

export const fetchTokensFromSlack = () =>
  new Promise<TokenPairs>((resolve, reject) => {
    Keychain.readPassword('Slack', 'tokens', (error, result) => {
      if (error) {
        return reject(error);
      }
      try {
        const tokens = JSON.parse(result);
        return resolve(tokens);
      } catch (e) {
        return reject('Invalid response');
      }
    });
  });

export default {
  apiCall,
};