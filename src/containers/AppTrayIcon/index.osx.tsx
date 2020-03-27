import React, { useRef, FC, useEffect } from 'react';
import { QtLabsPlatform } from 'react-qml';
import { QQuickPlatformSystemTrayIcon } from 'react-qml/dist/components/QtLabsPlatform';
import { connect } from 'react-redux';
import trayIconPNG from '../../assets/tray_icon.png';

import NotificationActions from '../../store/notificationMiddleware/actions';
const { SystemTrayIcon } = QtLabsPlatform;

declare const __DEV__: boolean;

const connectToRedux = connect(null, {
  registerSender: NotificationActions.registerSender,
  deregisterSender: NotificationActions.deregisterSender,
});

type Props = {
  registerSender: Function;
  deregisterSender: Function;
};

function AppTrayIcon(props: Props) {
  const trayIconRef = useRef<QQuickPlatformSystemTrayIcon>(null);

  const { registerSender, deregisterSender } = props;

  useEffect(() => {
    const $trayIcon = trayIconRef.current;

    if ($trayIcon && $trayIcon.available) {
      registerSender($trayIcon);
      $trayIcon.show();
      // if (__DEV__) {
      //   setTimeout(() => {
      //     $trayIcon.show();
      //   }, 5000);
      // } else {
      //   $trayIcon.show();
      // }

      return () => {
        deregisterSender();
      };
    }
  }, []);

  return <SystemTrayIcon ref={trayIconRef} iconSource={trayIconPNG} />;
}

// class AppTrayIcon extends React.Component<Props> {
//   private trayIconRef = React.createRef<QQuickPlatformSystemTrayIcon>();

//   componentDidMount() {
//     const $trayIcon = this.trayIconRef.current;
//     if ($trayIcon && $trayIcon.available) {
//       this.props.registerSender($trayIcon);
//       if (__DEV__) {
//         setTimeout(() => {
//           $trayIcon.show();
//         }, 5000);
//       } else {
//         $trayIcon.show();
//       }
//     }
//   }

//   componentWillUnmount() {
//     this.props.deregisterSender();
//   }

//   render() {
//     return <SystemTrayIcon ref={this.trayIconRef} iconSource={trayIconPNG} />;
//   }
// }

export default connectToRedux(AppTrayIcon);
