import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.1

import QtWebSockets 1.0
import Qt.labs.settings 1.0
import Qt.labs.platform 1.0
import QtQuick.LocalStorage 2.0
import QtGraphicalEffects 1.0
import ReactQML 1.0

import "osx.bundle.js" as JS;

Item {
  id: root

  width: Window.width
  height: Window.height
  
  Component.onCompleted: {
    try {
      JS.Bundle.default(root);
    } catch (ex) {
      console.log(ex);
      Qt.quit();
    }
  }
}
