import React from 'react';
import { Text } from 'react-qml';

type Props = {
  title: string;
};

const styles = {
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lato',
    leftPadding: 16,
    topPadding: 20,
    bottomPadding: 5,
  },
};

const ChannelListSection: React.FC<Props> = props => (
  <Text style={styles.text} text={props.title} />
);

export default ChannelListSection;
