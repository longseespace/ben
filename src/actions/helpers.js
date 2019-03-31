// TODO: convert to .ts
// for whatever reason, qml doesn't play nice with lodash.min.js,
// so we need to use babel-plugins-lodash to transform imports
import { map, filter, sortBy, flow } from 'lodash/fp';

export const getConversationListFromUserCountsAPI = payload => {
  const sectionChannels = transformSectionChannel([
    ...payload.channels,
    ...payload.groups,
  ]);

  const sectionDirectMessages = transformSectionDirectMessage([
    ...payload.ims,
    ...payload.mpims,
  ]);
  return [...sectionChannels, ...sectionDirectMessages];
};

// ListModel disables dynamicRoles by default
// we need to set model's schema explicitly
// @see https://doc.qt.io/archives/qt-5.10/qml-qtqml-models-listmodel.html#dynamicRoles-prop
const defaultConversationItem = {
  id: '',
  user_id: '',
  name: '',
  section: '',
  is_im: false,
  is_mpim: false,
  is_private: false,
  is_muted: false,
  is_active: false,
  is_open: false,
  is_member: false,
  is_archived: false,
  has_unreads: false,
  dm_count: 0,
  mention_count: 0,
};

const addSection = section => map(item => ({ ...item, section }));
const filterOpen = filter(item => item.is_open || item.is_member);
const filterArchived = filter(item => !item.is_archived);
const sortByMuted = sortBy(['is_muted', 'name']);
const transformMpimName = map(item => {
  if (item.is_mpim) {
    const name = item.name
      .substring(item.name.indexOf('-') + 1, item.name.lastIndexOf('-'))
      .split('--')
      .join(', ');
    return { ...item, name };
  }
  return item;
});

// const picky = pick(Object.keys(defaultConversationItem));

const standardizeConversation = map(item => ({
  ...defaultConversationItem,
  ...item,
}));

const transformSectionChannel = flow(
  addSection('Channels'),
  filterOpen,
  filterArchived,
  sortByMuted,
  standardizeConversation
);

const transformSectionDirectMessage = flow(
  addSection('Direct Messages'),
  filterOpen,
  filterArchived,
  transformMpimName,
  standardizeConversation
);

// ListModel disables dynamicRoles by default
// we need to set model's schema explicitly
// @see https://doc.qt.io/archives/qt-5.10/qml-qtqml-models-listmodel.html#dynamicRoles-prop
const defaultMessage = {
  client_msg_id: '',
  type: '',
  text: '',
  user: '',
  ts: '0',
};

export const standardizeMessage = obj => ({
  ...defaultMessage,
  ...obj,
});
