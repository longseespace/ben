import * as React from 'react';
import { Column, Row } from 'react-qml';
import { Rectangle } from 'react-qml/dist/components/QtQuick';

const fillParent = { fill: 'parent' };

const styles = {
  headerTitle: {
    width: 130,
    height: 8,
  },
  headerBell: {
    width: 20,
    height: 8,
  },
  channelLong: {
    width: 140,
    height: 8,
  },
  channelShort: {
    width: 80,
    height: 8,
  },
  headerIndicator: {
    width: 8,
    height: 8,
  },
  headerName: {
    width: 80,
    height: 8,
  },
};

const ChannelLoadingView: React.FunctionComponent = () => (
  <Column anchors={fillParent} padding={16} spacing={32}>
    <Column spacing={8}>
      <Row spacing={32}>
        <Rectangle
          radius={8}
          color={Qt.rgba(255, 255, 255, 0.8)}
          style={styles.headerTitle}
        />
        <Rectangle
          radius={8}
          color={Qt.rgba(255, 255, 255, 0.3)}
          style={styles.headerBell}
        />
      </Row>
      <Row spacing={8}>
        <Rectangle
          radius={8}
          color={Qt.rgba(255, 255, 255, 0.3)}
          style={styles.headerIndicator}
        />
        <Rectangle
          radius={8}
          color={Qt.rgba(255, 255, 255, 0.3)}
          style={styles.headerName}
        />
      </Row>
    </Column>
    <Column spacing={8}>
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelLong}
      />
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelShort}
      />
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelLong}
      />
    </Column>
    <Column spacing={8}>
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelLong}
      />
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelShort}
      />
      <Rectangle
        radius={8}
        color={Qt.rgba(255, 255, 255, 0.3)}
        style={styles.channelLong}
      />
    </Column>
  </Column>
);

export default ChannelLoadingView;
