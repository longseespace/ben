import QtQuick 2.10

Loader {
  asynchronous: true
  
  source: {
    if (Qt.platform.os === 'osx' || Qt.platform.os === 'windows') {
      return './index.osx.qml';
    }

    return './index.' + Qt.platform.os + '.qml';
  }

  onStatusChanged: {
    if (status === Loader.Error) {
      console.error("Failed to load entry url");
    }
  }
}