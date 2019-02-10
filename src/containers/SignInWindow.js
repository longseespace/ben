import { connect } from 'react-redux';
import * as React from 'react';

import { Rectangle } from './QtQuick';
import PageLayout from './PageLayout';
import SignInForm from './SignInForm';
import Window from './Window';

const connectToRedux = connect(
  state => ({
    value: state.counter,
  }),
  {
    onIncrement: () => ({ type: 'INCREMENT' }),
    onDecrement: () => ({ type: 'DECREMENT' }),
  }
);

class SignInWindow extends React.Component {
  render() {
    const { visible, onClosing } = this.props;
    return (
      <Window visible={visible} onClosing={onClosing} width={300} height={300}>
        <PageLayout>
          <Rectangle color="#f5f5f6">
            <SignInForm />
          </Rectangle>
        </PageLayout>
      </Window>
    );
  }
}

export default connectToRedux(SignInWindow);
