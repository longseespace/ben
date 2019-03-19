import { CONVERSATIONS } from '.';

export interface ConversationBase {
  id: string;
  name: string;
  section: string;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_muted: boolean;
  is_active: boolean;
  is_open: boolean;
  is_member: boolean;
  has_unreads: boolean;
  dm_count?: number;
  mention_count?: number;
}

export type Conversation = Readonly<ConversationBase>;

export type TeamConversationList = {
  teamId: string;
  conversations: Array<Conversation>;
};

export const setConversationList = (
  teamId: string,
  conversations: Array<Conversation>
) => ({
  type: CONVERSATIONS.SET_CONVERSATION_LIST,
  payload: {
    teamId,
    conversations,
  } as TeamConversationList,
});
