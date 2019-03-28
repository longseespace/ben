import React from 'react';
import { Column, Text } from 'react-qml';

type Props = {
  title: string;
};

const styles = {
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lato',
  },
};

const ChannelListSection: React.FC<Props> = props => (
  <Column leftPadding={16} topPadding={20} bottomPadding={5}>
    <Text style={styles.text} text={props.title} />
  </Column>
);

export default ChannelListSection;
