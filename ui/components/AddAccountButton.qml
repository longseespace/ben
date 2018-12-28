import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Controls.Material 2.3
import QtQuick.Layouts 1.3

Button {
  id: control

  antialiasing: true

  background: Rectangle {
    opacity: enabled ? 1 : 0.3
    color: control.down ? "#eeeeee" : "#ffffff"
    radius: 4
  }

  contentItem: Text {
    id: plus
    text: "+"
    color: "#191F26"
    font.pointSize: 26

    anchors.centerIn: parent
    horizontalAlignment: Text.AlignHCenter
    verticalAlignment: Text.AlignVCenter
    elide: Text.ElideRight
  }
}
