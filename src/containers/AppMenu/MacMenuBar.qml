import Qt.labs.platform 1.1

MenuBar {
  id: menuBar

  Menu {
    id: fileMenu
    title: qsTr("File")

    MenuItem {
      text: qsTr('Close')
    }
  }

  Menu {
    id: editMenu
    title: qsTr("&Edit")
    // ...
    MenuItem {
      text: qsTr('Undo')
    }
  }

  Menu {
    id: viewMenu
    title: qsTr("&View")
    // ...
    // ...
    MenuItem {
      text: qsTr('Zoom In')
    }
  }

  Menu {
    id: helpMenu
    title: qsTr("&Help")
    // ...
    MenuItem {
      text: qsTr('Keyboard Shortcuts')
    }
  }
}