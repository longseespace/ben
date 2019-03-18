import { TEAMS } from '.';

export interface TeamIcons {
  image_34: string;
  image_44: string;
  image_68: string;
  image_88: string;
  image_102: string;
  image_132: string;
  image_230: string;
  image_512: string;
  image_original: string;
}

export interface TeamTheme {
  active_item: string;
  active_item_text: string;
  active_presence: string;
  badge: string;
  column_bg: string;
  hover_item: string;
  menu_bg: string;
  text_color: string;
}

export interface UserProfile {
  title: string;
  phone: string;
  skype: string;
  real_name: string;
  real_name_normalized: string;
  display_name: string;
  display_name_normalized: string;
  status_text: string;
  status_emoji: string;
  status_expiration: number | null;
  avatar_hash: string;
  email: string;
  first_name: string;
  last_name: string;
  status_text_canonical: string;
  team: string;
}

export interface User {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
  manual_presence: string;
  profile: UserProfile;
}

export interface TeamBase {
  id: string;
  name: string;
  email_domain: string;
  prefs: object;
  domain: string;
  icon: TeamIcons;
  plan: string;
  user: User;
}

export type Team = Readonly<TeamBase>;

export const addTeam = (team: Team) => ({
  type: TEAMS.ADD_TEAM,
  payload: team,
});

export const removeTeam = (teamId: string) => ({
  type: TEAMS.REMOVE_TEAM,
  payload: teamId,
});
