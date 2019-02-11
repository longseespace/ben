import QtQuick 2.10
import QtQuick.Controls 2.3

TextField {
  id: control

  verticalAlignment: TextInput.AlignVCenter

  // forwarding events
  signal pressed(var event);
  Keys.onPressed: control.pressed(event);

  signal released(var event);
  Keys.onReleased: control.released(event);
}
