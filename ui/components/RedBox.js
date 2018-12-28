import Column from 'qt-react/QtQuick/2.10/Column';
import React from 'react';
import Rectangle from 'qt-react/QtQuick/2.10/Rectangle';
import ScrollView from 'qt-react/QtQuick/Controls/2.3/ScrollView';
import Text from 'qt-react/QtQuick/2.10/Text';

import { fillWindow } from '../util/binding';

const ENABLE_STACK_TRACE = false;

const RedBox = ({ error, errorInfo }) => (
  <Rectangle color="#BD2619" {...fillWindow}>
    <ScrollView {...fillWindow}>
      <Column spacing={10} padding={32}>
        <Text
          text={qsTr('Error')}
          color="white"
          font={{
            family: 'Roboto',
            pointSize: 14,
            capitalization: 'AllUppercase',
            letterSpacing: 1.5,
            wordSpacing: 5,
          }}
          Layout={{
            fillWidth: true,
          }}
        />
        <Text
          text={error.toString()}
          color="white"
          font={{
            family: 'Roboto',
            pointSize: 12,
          }}
          Layout={{
            fillWidth: true,
          }}
        />
        <Text
          text={errorInfo.componentStack}
          color="white"
          font={{
            family: 'Roboto',
            pointSize: 12,
          }}
          Layout={{
            fillWidth: true,
          }}
        />

        <Text
          text={qsTr('Stacktrace')}
          visible={ENABLE_STACK_TRACE}
          color="white"
          font={{
            family: 'Roboto',
            pointSize: 14,
            capitalization: 'AllUppercase',
            letterSpacing: 1.5,
            wordSpacing: 5,
          }}
          Layout={{
            fillWidth: true,
          }}
        />
        <Text
          text={error.stack}
          visible={ENABLE_STACK_TRACE}
          color="white"
          font={{
            family: 'Roboto',
            pointSize: 12,
          }}
          Layout={{
            fillWidth: true,
          }}
        />
      </Column>
    </ScrollView>
  </Rectangle>
);

export default RedBox;
