import QtQuick 2.10
import QtQuick.Controls 2.3
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.1
import QtWebSockets 1.0
import Qt.labs.settings 1.0
import Qt.labs.platform 1.0
import QtQuick.LocalStorage 2.0
import ReactQML 1.0

import "macos.bundle.js" as JS;

Item {
  id: root

  // TODO: refactor this, put font loader to user-space
  FontLoader {
    id: faSolidLoader
    source: "/assets/fa-solid.ttf"
  }

  FontLoader {
    id: faRegularLoader
    source: "/assets/fa-regular.ttf"
  }

  FontLoader {
    id: latoRegularLoader
    source: "/assets/Lato-Regular.ttf"
  }

  FontLoader {
    id: latoBoldLoader
    source: "/assets/Lato-Bold.ttf"
  }

  FontLoader {
    id: latoBlackLoader
    source: "/assets/Lato-Black.ttf"
  }

  states: [
    State {
      name: 'loaded'
      when: faSolidLoader.status == FontLoader.Ready &&
        faRegularLoader.status == FontLoader.Ready &&
        latoRegularLoader.status == FontLoader.Ready &&
        latoBoldLoader.status == FontLoader.Ready &&
        latoBlackLoader.status == FontLoader.Ready
    }
  ]

  onStateChanged: {
    if (state === 'loaded') {
      try {
        JS.Bundle.default(root);
      } catch (ex) {
        console.log(ex);
        Qt.quit();
      }
    }
  }
}
