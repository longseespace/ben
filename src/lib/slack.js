import qs from 'qs';

function apiCall(method, data) {
  const url = `https://slack.com/api/${method}`;
  return fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: qs.stringify(data),
  });
}

export async function signInWithPassword(domain, email, password) {
  const findTeamResp = await apiCall('auth.findTeam', { domain });
  const teamJson = await findTeamResp.json();
  if (!teamJson.ok) {
    return teamJson;
  }
  const signinResp = await apiCall('auth.signin', {
    team: teamJson.team_id,
    email,
    password,
  });
  const json = await signinResp.json();
  return json;
}

export async function rtmConnect(token) {
  const connectResp = await apiCall('rtm.connect', {
    token,
    batch_presence_aware: 1,
  });
  const connectJson = await connectResp.json();

  if (connectJson.ok) {
    const ws = new WebSocket(connectJson.url);
    return ws;
  }
  return false;
}

export default {};
