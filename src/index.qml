import QtQuick 2.7
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
import ReactQML 1.0

import "macos.bundle.js" as JS;

Item {
  id: root

  Component.onCompleted: {
    try {
      JS.Bundle.default(root);
    } catch (ex) {
      console.log(ex);
      Qt.quit();
    }
  }
}
