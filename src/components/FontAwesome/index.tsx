import { Text } from 'react-qml';
import React from 'react';
import iconChars from './icons.json';

function iconNameToUnicode(name: string, solid = false) {
  const iconSet = solid ? iconChars.solid : iconChars.regular;
  const icon = iconSet.find(icon => icon.name === name);
  return icon ? icon.unicode : '';
}

type Props = {
  name: string;
  solid?: boolean;
  size?: number;
  color?: string | number;
  style?: any;
};

const FontAwesome: React.FC<Props> = ({
  name,
  solid = false,
  size = 9,
  ...otherProps
}) => (
  <Text
    text={iconNameToUnicode(name, solid)}
    width={size}
    height={size}
    font={{
      family: 'Font Awesome 5 Free',
      pointSize: size,
      weight: solid ? 'Bold' : 'Normal',
    }}
    {...otherProps}
  />
);

export default FontAwesome;
