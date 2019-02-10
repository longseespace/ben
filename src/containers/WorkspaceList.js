import { Column } from 'react-qml';
import * as React from 'react';

import AddAccountButton from '../components/AddAccountButton.qml';

const styles = {
  container: {
    spacing: 24,
    topPadding: 24,
  },
};

const WorkspaceList = () => (
  <Column style={styles.container}>
    <AddAccountButton width={36} height={36} x={16} y={16} />
  </Column>
);

export default WorkspaceList;
