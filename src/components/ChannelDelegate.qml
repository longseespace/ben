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
      topPadding: 4
      bottomPadding: 4

      RowLayout {
        spacing: 5
        width: container.width - content.leftPadding - content.rightPadding

        Text {
          visible: !model.is_im && !model.is_mpim && model.is_private
          color: container.ListView.view.currentIndex === index ? '#fff' : model.is_muted ? Qt.rgba(255, 255, 255, 0.3) : '#eee'
          text: '\uf023'
          font.family: 'Font Awesome 5 Free'
          font.pointSize: 10
          font.weight: Font.Bold
          Layout.preferredWidth: 10
          Layout.topMargin: 2
        }

        Text {
          visible: !model.is_im && !model.is_mpim && !model.is_private
          color: container.ListView.view.currentIndex === index ? '#fff' : model.is_muted ? Qt.rgba(255, 255, 255, 0.3) : '#eee'
          text: '#'
          font.pointSize: 16
          font.family: 'Lato'
          Layout.preferredWidth: 10
        }

        Text {
          visible: model.is_im
          color: container.ListView.view.currentIndex === index || !model.is_active ? '#fff' : '#a6e576'

          text: '\uf111'
          font.family: 'Font Awesome 5 Free'
          font.pointSize: 9
          font.weight: model.is_active ? Font.Bold : Font.Normal
          Layout.preferredWidth: 10
          Layout.topMargin: 2
        }

        Text {
          visible: model.is_mpim
          color: '#fff'
          text: '\uf0c8'
          font.family: 'Font Awesome 5 Free'
          font.pointSize: 9
          Layout.preferredWidth: 10
          Layout.topMargin: 2
        }

        Text {
          color: {
            if (model.is_muted) {
              return Qt.rgba(255, 255, 255, 0.3);
            }

            if (container.ListView.view.currentIndex === index || model.has_unreads) {
              return '#fff';
            }
            
            return '#ddd';
          }
          text: model.name
          font.pointSize: 16
          font.family: 'Lato'
          font.weight: model.has_unreads && !model.is_muted ? Font.Black : Font.Normal
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
