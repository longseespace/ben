import React, { useRef, useLayoutEffect } from 'react';
import WindowQML from './Window.qml';
import { QQuickWindow } from 'react-qml/dist/components/QtQuickWindow';
import { inspect } from 'util';

type Props = { name: string; children: any };

function Window(props: Props) {
  const { name, ...otherProps } = props;

  const windowRef = useRef<QQuickWindow>(null);

  return (
    <WindowQML
      visibility="AutomaticVisibility"
      name={name}
      ref={windowRef}
      {...otherProps}
    />
  );
}

export default Window;
