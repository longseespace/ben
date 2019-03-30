import QtQuick 2.10
import QtQuick.Layouts 1.3
import QtQuick.Controls 2.3

Component {
  id: delegate

  Column {
    id: content

    leftPadding: 16
    rightPadding: 16
    topPadding: 4
    bottomPadding: 4
    width: ListView.view.width

    TextEdit {
      width: parent.width - parent.leftPadding - parent.rightPadding
      color: '#000'
      text: model.user
      font.pointSize: 16
      font.family: 'Lato'
      readOnly: true
      wrapMode: Text.WordWrap
      // selectByMouse: true
    }

    TextEdit {
      width: parent.width - parent.leftPadding - parent.rightPadding
      color: '#000'
      text: model.text
      font.pointSize: 16
      font.family: 'Lato'
      readOnly: true
      wrapMode: Text.WordWrap
      // selectByMouse: true
    }
  }
}
