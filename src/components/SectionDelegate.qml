import QtQuick 2.10

Component {
  id: delegate

  Column {
    id: container

    leftPadding: 16
    topPadding: 20
    bottomPadding: 5

    Text {
      color: '#fff'
      text: section
      font.pointSize: 16
    }
  }
}
