import { Text } from 'react-qml';
import { find } from 'lodash/fp';
import React from 'react';
import iconChars from './fa.json';

function iconNameToUnicode(name, solid = false) {
  const iconSet = solid ? iconChars.solid : iconChars.regular;
  const icon = find({ name }, iconSet);
  return icon ? icon.unicode : '';
}

const FontIcon = ({ name, solid = false, size = 9, ...otherProps }) => (
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

export default FontIcon;
