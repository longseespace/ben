import QtQuick 2.7
import QtQuick.Controls 2.2

TextField {
  id: control

  signal pressed(var event);
  signal released(var event);
  signal returnPressed(var event);

  verticalAlignment: TextInput.AlignBottom

  Keys.onPressed: {
    control.pressed(event);
  }
  Keys.onReleased: {
    control.released(event);
  }
  Keys.onReturnPressed: {
    control.returnPressed(event);
  }
}
