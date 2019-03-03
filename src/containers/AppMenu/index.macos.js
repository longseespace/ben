import * as React from 'react';
import { QtLabsPlatform } from 'react-qml';

const { MenuBar, Menu, MenuItem, MenuSeparator } = QtLabsPlatform;

const collectGarbage = () => {
  gc();
};

class AppMenu extends React.Component {
  render() {
    return (
      <MenuBar>
        <Menu title="Ben">
          <MenuItem text="About" role="AboutRole" />
          <MenuItem text="Preferences" role="PreferencesRole" />
          <MenuItem
            text="Collect Garbage"
            role="ApplicationSpecificRole"
            shortcut="Ctrl+Shift+G"
            onTriggered={collectGarbage}
          />
        </Menu>
        <Menu title="&File">
          <MenuItem text="Close Window" shortcut={StandardKey.Close} />
        </Menu>
        <Menu title="&Edit" type="EditMenu">
          <MenuItem text="Undo" shortcut={StandardKey.Undo} />
          <MenuItem text="Redo" shortcut={StandardKey.Redo} />
          <MenuSeparator />
          <MenuItem text="Cut" shortcut={StandardKey.Cut} />
          <MenuItem text="Copy" shortcut={StandardKey.Copy} />
          <MenuItem text="Paste" shortcut={StandardKey.Paste} />
          <MenuItem text="Paste and Match Style" shortcut="Ctrl+Shift+V" />
          <MenuItem text="Delete" shortcut={StandardKey.Delete} />
          <MenuItem text="Select All" shortcut={StandardKey.SelectAll} />
          <MenuSeparator />
          <MenuItem text="Find" shortcut={StandardKey.Find} />
        </Menu>
        <Menu title="&View">
          <MenuItem text="Zoom In" shortcut={StandardKey.ZoomIn} />
          <MenuItem text="Zoom Out" shortcut={StandardKey.ZoomOut} />
          <MenuItem text="Actual Size" shortcut="Ctrl+0" />
        </Menu>
        <Menu title="&History">
          <MenuItem text="Back" shortcut={StandardKey.Back} />
          <MenuItem text="Forward" shortcut={StandardKey.Forward} />
        </Menu>
        <Menu title="&Window">
          <MenuItem text="Minimize" shortcut="Ctrl+M" />
          <MenuItem text="Zoom" />
          <MenuSeparator />
          <MenuItem text="Bring All to Front" />
        </Menu>
        <Menu title="&Help">
          <MenuItem text="Keyboard Shortcuts" />
          <MenuItem text="Report Issue" />
          <MenuItem text="Search Issues" />
        </Menu>
      </MenuBar>
    );
  }
}

export default AppMenu;
