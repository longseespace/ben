import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.1
import QtWebSockets 1.0
import Qt.labs.settings 1.0
import ReactQML 1.0

ApplicationWindow {
  id: __devWindow

  visible: false
  width: 400
  height: 500

  flags: Qt.Window

  property string entry: PRODUCTION_BUILD ? 'qrc:/index.qml' : 'http://localhost:8081/index.qml'
  property bool supportHMR: PRODUCTION_BUILD ? false : true
  property string hmrUrl: 'ws://localhost:8081/hot'

  Loader {
    id: __appLoader
    asynchronous: true

    source: __devWindow.entry

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
    informativeText: "Failed to load " + __devWindow.entry
    onAccepted: {
      Qt.quit();
    }
  }

  // websocket for HMR
  WebSocket {
    id: __hotWs
    url: __devWindow.hmrUrl
    active: __devWindow.supportHMR

    onStatusChanged: {
      if (status === WebSocket.Error) {
        console.log("HMR WebSocker error:", errorString)
        return;
      }
      if (status === WebSocket.Open) {
        console.log("HMR WebSocker connected:", url)
      }
    }

    onTextMessageReceived: {
      console.log("HMR WebSocket message:", message)
    }
  }
}
