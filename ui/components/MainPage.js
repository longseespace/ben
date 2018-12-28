import { connect } from 'react-redux';
import * as React from 'react';
import Rectangle from 'qt-react/QtQuick/2.10/Rectangle';
import RowLayout from 'qt-react/QtQuick/Layouts/1.3/RowLayout';

import { fillWindow } from '../util/binding';
import AddAccountButton from './AddAccountButton';
import PageLayout from './PageLayout';

const connectToRedux = connect(
  state => ({
    value: state.counter,
  }),
  {
    onIncrement: () => ({ type: 'INCREMENT' }),
    onDecrement: () => ({ type: 'DECREMENT' }),
  }
);

class MainPage extends React.Component {
  render() {
    return (
      <PageLayout>
        <RowLayout Layout={{ row: 3, column: 1 }} spacing={0} {...fillWindow}>
          <Rectangle
            width={68}
            Layout={{
              fillHeight: true,
            }}
            color="#191F26"
          >
            <AddAccountButton width={36} height={36} x={16} y={16} />
          </Rectangle>
          <Rectangle
            width={220}
            Layout={{
              fillHeight: true,
            }}
            color="#323E4C"
          />
          <Rectangle
            Layout={{
              fillWidth: true,
              fillHeight: true,
            }}
            color="#FFFFFF"
          />
        </RowLayout>
      </PageLayout>
    );
  }
}

export default connectToRedux(MainPage);
