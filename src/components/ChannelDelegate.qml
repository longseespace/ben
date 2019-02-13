import QtQuick 2.10

Component {
  id: delegate

  Rectangle {
    id: container

    width: ListView.view.width
    color: 'transparent'
    height: content.height

    Column {
      id: content

      leftPadding: 16
      topPadding: 5
      bottomPadding: 5

      Text {
        color: container.ListView.view.currentIndex === index ? '#fff' : '#eee'
        text: '# ' + model.name
        font.pointSize: 16
      }
    }

    MouseArea {
      anchors.fill: parent
      cursorShape: Qt.PointingHandCursor
      hoverEnabled: true
      onEntered: container.color = Qt.rgba(255, 255, 255, 0.1);
      onExited: container.color = 'transparent';
      onClicked: container.ListView.view.currentIndex = index;
    }
  }
}
