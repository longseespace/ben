import QtQuick 2.10

Rectangle {
  id: badge
  smooth: true

  property alias text: inner.text
  property alias textColor: inner.color
  property alias fontSize: inner.font.pointSize
  z: 2

  color: '#83ad91'
  height: 18
  radius: height
  width: inner.text.length > 1 ? inner.paintedWidth + height / 2 : height

  Text {
    id: inner

    color: '#fff'
    font.pointSize: 12
    font.bold: true
    anchors.fill: parent
    verticalAlignment: Text.AlignVCenter
    horizontalAlignment: Text.AlignHCenter
  }
}