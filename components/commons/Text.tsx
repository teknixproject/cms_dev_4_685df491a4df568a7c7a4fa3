import _ from 'lodash';
import { CSSProperties, useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useData } from '@/hooks';
import { useHandleData } from '@/hooks/useHandleData';
import { convertStyle } from '@/lib/utils';
import { TData } from '@/types/dataItem';
import { GridItem } from '@/types/gridItem';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TextProps {
  data: GridItem;
  style?: CSSProperties;
}

const Text = ({ data, style }: TextProps) => {
  const { title } = useData({ layoutData: data });
  const { getData } = useHandleData();
  const combineText = _.get(data, 'dataSlice.combineText', {});
  const dataTitle = getData(data.data as TData);
  console.log('🚀 ~ Text ~ dataTitle:', dataTitle);

  const newStyle: CSSProperties = {
    ...style,
  };

  const tooltip = useMemo(() => {
    return data?.tooltip;
  }, [data]);

  const content = !_.isEmpty(combineText) ? (
    <TextComplex texts={combineText} style={style} />
  ) : (
    <CsText style={convertStyle(newStyle)} styledComponentCss={data?.styledComponentCss}>
      {_.isObject(title) ? JSON.stringify(title) : title}
      {_.isObject(dataTitle) ? JSON.stringify(dataTitle) : dataTitle}
    </CsText>
  );

  if (_.isEmpty(tooltip?.title)) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent style={tooltip?.style}>
          <p>{tooltip?.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TextComplex = ({
  texts,
  style,
}: {
  texts: { text: string; style: CSSProperties & { textGradient?: string } }[];
  style: any;
}) => {
  return (
    <Container
      style={{
        display: 'inline',
        ...style,
      }}
    >
      {texts.map((item, index) => {
        return (
          <CsStrong
            gradient={item.style.textGradient}
            key={index}
            style={{
              display: 'inline',
              ...item.style,
            }}
          >
            {item.text}
          </CsStrong>
        );
      })}
    </Container>
  );
};

const CsStrong = styled.strong<{ gradient?: string }>`
  ${(props) =>
    props.gradient
      ? `
      background: linear-gradient(${props.gradient});
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `
      : ''}
`;

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  styledComponentCss?: string;
}

const Container = styled.div<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

const CsText = styled.div<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

export default Text;
