import React from 'react';
import { QtLabsPlatform } from 'react-qml';
import { QQuickPlatformSystemTrayIcon } from 'react-qml/dist/components/QtLabsPlatform';
import { connect } from 'react-redux';
import trayIconPNG from '../../assets/tray_icon.png';

import NotificationActions from '../../store/notificationMiddleware/actions';
import { inspect } from 'util';
const { SystemTrayIcon } = QtLabsPlatform;

const connectToRedux = connect(
  null,
  {
    registerSender: NotificationActions.registerSender,
    deregisterSender: NotificationActions.deregisterSender,
  }
);

type Props = {
  registerSender: Function;
  deregisterSender: Function;
};

class AppTrayIcon extends React.Component<Props> {
  private trayIconRef = React.createRef<QQuickPlatformSystemTrayIcon>();

  componentDidMount() {
    const $trayIcon = this.trayIconRef.current;
    if ($trayIcon && $trayIcon.available) {
      $trayIcon.show();
      this.props.registerSender($trayIcon);
    }
  }

  componentWillUnmount() {
    this.props.deregisterSender();
  }

  render() {
    return <SystemTrayIcon ref={this.trayIconRef} iconSource={trayIconPNG} />;
  }
}

export default connectToRedux(AppTrayIcon);
