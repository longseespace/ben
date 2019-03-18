import { ACCOUNTS } from '.';

export type AccountBase = {
  teamId: string;
  token: string;
};

export type Account = Readonly<AccountBase>;

export const addAccount = (account: AccountBase) => ({
  type: ACCOUNTS.ADD_ACCOUNT,
  payload: account,
});

export const removeAccount = (teamId: string) => ({
  type: ACCOUNTS.REMOVE_ACCOUNT,
  payload: teamId,
});
