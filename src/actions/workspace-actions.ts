import { WORKSPACE } from '.';
import slack from '../lib/slack';
import AppTeamsActions from './app-teams-actions';
import ConversationActions from './conversation-actions';
import { getConversationListFromUserCountsAPI } from './helpers';
import { SimpleThunkAction } from '../constants';
import { RootState } from '../reducers';
import RTMActions from '../store/rtmMiddleware/actions';
import { inspect } from 'util';
import TeamActions, { Team } from './team-actions';
import MessageActions from './message-actions';

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

const initWorkspace = (
  teamId: string,
  token: string,
  selectTeamAfterSuccess: boolean = false
): SimpleThunkAction => async (dispatch, getState) => {
  if (!teamId) {
    return;
  }

  const state = getState() as RootState;
  const selectedConversationId = state.appTeams.selectedConversations[teamId];

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

    if (!clientJson.ok || !userCountJson.ok) {
      console.error(inspect(clientJson));
      console.error(inspect(userCountJson));
      throw new Error('Unable to initialize workspace');
    }

    dispatch(RTMActions.connectToWorkspace(teamId, token));

    const team = {
      ...(clientJson.team as Team),
      user: clientJson.self,
    };
    dispatch(TeamActions.addTeam(team));

    if (selectTeamAfterSuccess) {
      dispatch(AppTeamsActions.selectTeam(team.id));

      // init message view
      if (selectedConversationId) {
        dispatch(MessageActions.initStart(selectedConversationId));
      }
    }

    const conversationsList = getConversationListFromUserCountsAPI(
      userCountJson
    );
    dispatch(
      ConversationActions.setConversationList(team.id, conversationsList)
    );

    dispatch(workspaceInitSuccess(teamId));
  } catch (error) {
    console.log('workspaceInitFailure', error);
    const message = error.message || 'Unknown error';
    dispatch(workspaceInitFailure(teamId, message));
  }
};

// exports
const WorkspaceActions = {
  initWorkspace,
};

export default WorkspaceActions;
