import QtQuick 2.12
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import QtQuick.Window 2.14
import Qt.labs.settings 1.1
import ReactQML 1.0

Window {
  id: window
  property string name: "window"
  // property bool autoRestoreGeometry: true

  Settings {
    category: "Window_" + name

    property alias windowX: window.x
    property alias windowY: window.y
    property alias windowWidth: window.width
    property alias windowHeight: window.height
  }
}