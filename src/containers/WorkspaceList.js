import { Column } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { showWindow } from '../state/window';
import AddAccountButton from '../components/AddAccountButton.qml';

const showLoginWindow = () => showWindow('login');

const connectToRedux = connect(
  state => ({}),
  {
    onAddAccount: showLoginWindow,
  }
);

const styles = {
  container: {
    spacing: 24,
    topPadding: 24,
  },
};

const WorkspaceList = ({ onAddAccount }) => (
  <Column style={styles.container}>
    <AddAccountButton
      width={36}
      height={36}
      x={16}
      y={16}
      onClicked={onAddAccount}
    />
  </Column>
);

export default connectToRedux(WorkspaceList);
