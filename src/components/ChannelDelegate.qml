import QtQuick 2.10
import QtQuick.Layouts 1.3

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
      rightPadding: 16
      topPadding: 5
      bottomPadding: 5

      RowLayout {
        spacing: 5
        width: container.width - content.leftPadding - content.rightPadding

        Text {
          visible: !model.is_im && !model.is_mpim && model.is_private
          color: container.ListView.view.currentIndex === index ? '#fff' : model.is_muted ? Qt.rgba(255, 255, 255, 0.3) : '#eee'
          text: '\uf023'
          font.family: 'Font Awesome 5 Free'
          font.pointSize: 10
          Layout.maximumWidth: 10
        }

        Text {
          visible: !model.is_im && !model.is_mpim && !model.is_private
          color: container.ListView.view.currentIndex === index ? '#fff' : model.is_muted ? Qt.rgba(255, 255, 255, 0.3) : '#eee'
          text: '#'
          font.pointSize: 14
          Layout.maximumWidth: 10
        }

        Text {
          visible: model.is_im
          color: container.ListView.view.currentIndex === index || !model.is_active ? '#fff' : '#a6e576'
          text: model.is_active ? '●' : '○'
          font.pointSize: 12
          Layout.alignment: Qt.AlignBottom | Qt.AlignLeft
          Layout.maximumWidth: 10
        }

        Text {
          visible: model.is_mpim
          color: '#fff'
          text: '□'
          font.pointSize: 12
          Layout.alignment: Qt.AlignBottom | Qt.AlignLeft
          Layout.maximumWidth: 10
        }

        Text {
          color: container.ListView.view.currentIndex === index ? '#fff' : model.is_muted ? Qt.rgba(255, 255, 255, 0.3) : '#eee'
          text: model.name
          font.pointSize: 14
          Layout.alignment: Qt.AlignBottom | Qt.AlignLeft
          Layout.fillWidth: true
          elide: Text.ElideRight
        }
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
