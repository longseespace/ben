import Keychain from '@react-qml/keychain';
import qs from 'qs';
import { StringMap } from '../constants';
import { inspect } from 'util';

function apiCall(method: string, data: object) {
  const url = `https://slack.com/api/${method}`;
  console.log('Slack::apiCall', method, url);

  return fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: qs.stringify(data),
  })
    .then(resp => resp.json())
    .then(json => (json.ok ? json : Promise.reject(json)));
}

async function signInWithPassword(
  domain: string,
  email: string,
  password: string,
  pin?: string
) {
  try {
    const teamJson = await apiCall('auth.findTeam', { domain });
    if (!teamJson.ok) {
      return teamJson;
    }

    const json = await apiCall('auth.signin', {
      team: teamJson.team_id,
      email,
      password,
      pin,
    });

    return json;
  } catch (error) {
    console.log('signInWithPassword');
    console.log(inspect(error));
    return error;
  }
}

async function rtmConnect(token: string) {
  const connectJson = await apiCall('rtm.connect', {
    token,
    batch_presence_aware: 1,
  });

  if (connectJson.ok) {
    const ws = new WebSocket(connectJson.url);
    return ws;
  }
  throw connectJson;
}

type TokenEntry = {
  teamId: string;
  token: string;
};

export type TokenPairs = StringMap<TokenEntry>;

const fetchTokensFromSlack = () =>
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
  rtmConnect,
  fetchTokensFromSlack,
  signInWithPassword,
};
