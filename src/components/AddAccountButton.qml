import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.3

Button {
  id: control

  antialiasing: true

  background: Rectangle {
    color: control.hovered ? '#fff' : Qt.rgba(255, 255, 255, 0.3)
    radius: 6
  }

  contentItem: Text {
    id: plus
    text: '\uf067'
    color: '#191F26'
    font.pointSize: 20
    font.family: 'Font Awesome 5 Free'
    font.weight: Font.Bold

    anchors.centerIn: parent
    horizontalAlignment: Text.AlignHCenter
    verticalAlignment: Text.AlignVCenter
    elide: Text.ElideRight
  }

  MouseArea {
    id: mouseArea
    anchors.fill: parent
    cursorShape: Qt.PointingHandCursor
    onPressed: mouse.accepted = false
  }
}
