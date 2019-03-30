import QtQuick 2.10

Loader {
  asynchronous: true
  
  source: './index.' + Qt.platform.os + '.qml'

  onStatusChanged: {
    if (status === Loader.Error) {
      console.error("Failed to load entry url");
    }
  }
}