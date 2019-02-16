import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.3
import QtGraphicalEffects 1.0

Button {
  id: control

  property string backgroundIcon: ''
  property bool selected: false

  antialiasing: true
  opacity: control.hovered || control.selected ? 1 : 0.7

  background: Image {
    source: backgroundIcon

    sourceSize.width: 88
    sourceSize.height: 88
    anchors.fill: parent
    fillMode: Image.PreserveAspectFit

    layer.enabled: true
    layer.effect: OpacityMask {
      maskSource: mask
    }
  }

  Rectangle {
    id: mask
    anchors.fill: parent
    radius: 6
    visible: false
  }

  MouseArea {
    id: mouseArea
    anchors.fill: parent
    cursorShape: Qt.PointingHandCursor
    onPressed: mouse.accepted = false
  }
}
