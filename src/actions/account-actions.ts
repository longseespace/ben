import { ACCOUNTS } from '.';

export type AccountBase = {
  teamId: string;
  token: string;
};

export type Account = Readonly<AccountBase>;

const addAccount = (account: AccountBase) => ({
  type: ACCOUNTS.ADD_ACCOUNT,
  payload: account,
});

const removeAccount = (teamId: string) => ({
  type: ACCOUNTS.REMOVE_ACCOUNT,
  payload: teamId,
});

const AccountActions = {
  addAccount,
  removeAccount,
};

export default AccountActions;
