import { Section } from './SectionList';
import React from 'react';

type Props = {
  sections: Array<Section>;
  renderItem: (item: any, index: number, section: Section) => any;
  renderSectionHeader?: (section: Section) => any;
  renderSectionFooter?: (section: Section) => any;
};
const SectionListContent = (props: Props) => (
  <React.Fragment>
    {props.sections.map(section => (
      <React.Fragment key={section.title}>
        {props.renderSectionHeader && props.renderSectionHeader(section)}
        {section.data.map((item, index) =>
          props.renderItem(item, index, section)
        )}
        {props.renderSectionFooter && props.renderSectionFooter(section)}
      </React.Fragment>
    ))}
  </React.Fragment>
);

export default SectionListContent;
