import React from 'react';

type Props = {
  data: Array<any>;
  renderItem: (item: any, index: number) => any;
};
const FlatListContent = (props: Props) => (
  <React.Fragment>
    {props.data.map((item, index) => props.renderItem(item, index))}
  </React.Fragment>
);

export default FlatListContent;
