import { WORKSPACE } from '.';
import slack from '../lib/slack';
import { Team, addTeam } from './team-actions';
import { selectTeam } from './app-teams-actions';
import { setConversationList } from './conversations-actions';
import { getConversationListFromUserCountsAPI } from './helpers';
import { SimpleThunkAction } from '../constants';

const workspaceInitStart = (teamId: string) => ({
  type: WORKSPACE.INIT_WORKSPACE_START,
  payload: teamId,
});

const workspaceInitFailure = (teamId: string, errorMessage: string) => ({
  type: WORKSPACE.INIT_WORKSPACE_FAILURE,
  payload: {
    teamId,
    errorMessage,
  },
});

const workspaceInitSuccess = (teamId: string) => ({
  type: WORKSPACE.INIT_WORKSPACE_SUCCESS,
  payload: teamId,
});

export const initWorkspace = (
  teamId: string,
  token: string,
  selectTeamAfterSuccess: boolean = false
): SimpleThunkAction => async (dispatch, getState) => {
  if (!teamId) {
    return;
  }

  // init start
  dispatch(workspaceInitStart(teamId));

  // get team info
  const initClient = slack.apiCall('client.boot', {
    token,
    flannel_api_ver: 4,
    _x_reason: 'fetch-legacy-start-data',
    _x_mode: 'online',
  });

  // init user
  const initUser = slack.apiCall('users.counts', {
    token,
    mpim_aware: true,
    only_relevant_ims: true,
    simple_unreads: true,
    include_threads: true,
    mpdm_dm_users: false,
    _x_reason: 'users-counts-api/fetchUsersCounts',
    _x_mode: 'online',
  });

  try {
    const [clientJson, userCountJson] = await Promise.all([
      initClient,
      initUser,
    ]);

    const team = {
      ...(clientJson.team as Team),
      user: clientJson.self,
    };
    dispatch(addTeam(team));

    if (selectTeamAfterSuccess) {
      dispatch(selectTeam(team.id));
    }

    const conversationsList = getConversationListFromUserCountsAPI(
      userCountJson
    );
    dispatch(setConversationList(team.id, conversationsList));

    dispatch(workspaceInitSuccess(teamId));
  } catch (error) {
    dispatch(workspaceInitFailure(teamId, 'Unknown error'));
  }
};
