import QtQuick 2.7
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0
import QtQuick.Window 2.2
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

  states: [
    State {
      name: 'loaded'
      when: faSolidLoader.status == FontLoader.Ready &&
        faRegularLoader.status == FontLoader.Ready &&
        latoRegularLoader.status == FontLoader.Ready &&
        latoBoldLoader.status == FontLoader.Ready
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
