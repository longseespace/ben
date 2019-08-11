import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.1
import QtWebSockets 1.0
import Qt.labs.settings 1.0
import QtQuick.LocalStorage 2.0
import QtGraphicalEffects 1.0
import QtQml.Models 2.2
import ReactQML 1.0

ApplicationWindow {
  id: __mainWindow

  visible: true

  flags: Qt.Window

  Settings {
    property alias windowX: __mainWindow.x
    property alias windowY: __mainWindow.y
    property alias windowWidth: __mainWindow.width
    property alias windowHeight: __mainWindow.height
  }

  // placeholder layout
  RowLayout {
    anchors.fill: parent
    spacing: 0

    Rectangle {
      Layout.fillHeight: true
      Layout.preferredWidth: 68
      color: "#191F26"
    }

    Rectangle {
      Layout.fillHeight: true
      Layout.preferredWidth: 220
      color: "#323E4C"
    }

    Rectangle {
      Layout.fillHeight: true
      Layout.fillWidth: true
      color: "#FFFFFF"
    }
  }

  Loader {
    id: __appLoader
    asynchronous: true

    source: ENTRY_URL

    onStatusChanged: {
      if (__appLoader.status === Loader.Error) {
        console.error("Failed to load entry url");
        errorDialog.open();
      }
    }

    // leaks, use with cautions!
    function reload() {
      var qmlSource = __appLoader.source;
      __appLoader.source = '';
      RQ.clearCache();
      __appLoader.source = qmlSource;
    }
  }

  Shortcut {
    sequence: "Ctrl+Shift+R"
    onActivated: __appLoader.reload()
    context: Qt.ApplicationShortcut
  }

  MessageDialog {
    id: errorDialog
    title: "Error"
    icon: StandardIcon.Warning
    text: "Failed to load entry url."
    informativeText: "Failed to load " + ENTRY_URL
    onAccepted: {
      Qt.quit();
    }
  }
}
