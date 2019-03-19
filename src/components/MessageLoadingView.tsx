import * as React from 'react';
import {
  Column,
  Item,
  RowLayout,
  Rectangle,
  QtQuickControls2,
} from 'react-qml';

const styles = {
  title: {
    width: 180,
    height: 8,
  },
  subtitle: {
    width: 140,
    height: 8,
  },
  short: {
    preferredWidth: 16,
    height: 8,
  },
  leftPane: {
    preferredWidth: 180,
    rightMargin: 64,
  },
  long: {
    fillWidth: true,
    preferredHeight: 8,
  },
};

const fullWidth = {
  left: 'parent.left',
  right: 'parent.right',
  top: 'parent.top',
  margins: 16,
};

const fillParent = { fill: 'parent' };

const MessageLoadingView: React.FunctionComponent = () => (
  <Item anchors={fillParent}>
    <RowLayout spacing={8} anchors={fullWidth}>
      <Column spacing={8} style={styles.leftPane}>
        <Rectangle radius={8} color="#ddd" style={styles.title} />
        <Rectangle radius={8} color="#ddd" style={styles.subtitle} />
      </Column>
      <Rectangle radius={8} color="#ddd" style={styles.short} />
      <Rectangle radius={8} color="#ddd" style={styles.long} />
      <Rectangle radius={8} color="#ddd" style={styles.short} />
      <Rectangle radius={8} color="#ddd" style={styles.short} />
      <Rectangle radius={8} color="#ddd" style={styles.short} />
    </RowLayout>
  </Item>
);

export default MessageLoadingView;
