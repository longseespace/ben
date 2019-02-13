import QtQuick 2.10

Component {
  id: highlight

  Rectangle {
    width: ListView.view ? ListView.view.width : 0
    height: ListView.view && ListView.view.currentItem ? ListView.view.currentItem.height : 0
    color: "#7098c4"
  }
}
