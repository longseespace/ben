import { FluxStandardAction } from 'flux-standard-action';
import { StringMap } from '../constants';
import { Account } from '../actions/account-actions';
import { ACCOUNTS } from '../actions';

export type AccountsState = StringMap<Account>;

export function reducer(
  state: AccountsState = {},
  action: FluxStandardAction<any, void>
): AccountsState {
  switch (action.type) {
    case ACCOUNTS.ADD_ACCOUNT:
      return addNewAccount(state, action.payload) as AccountsState;
    case ACCOUNTS.REMOVE_ACCOUNT:
      return removeAccount(state, action.payload) as AccountsState;
    default:
      return state;
  }
}

function addNewAccount(state: AccountsState, account: Account) {
  const teamId = account.teamId;
  const token = account.token;

  return {
    ...state,
    [teamId]: { teamId, token },
  };
}

function removeAccount(state: AccountsState, teamId: string) {
  const { [teamId]: removedAccount, ...nextState } = state;
  return nextState;
}

export default reducer;
