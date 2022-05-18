import React from 'react';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';
import type { PanelProps, GrafanaTheme2 } from '@grafana/data';

import type { SimpleOptions } from 'types';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles(width, height));

  console.log('data', data);

  return <div className={styles.wrapper}>test</div>;
};

const getStyles = (width: number, height: number) => {
  return (theme: GrafanaTheme2) => ({
    wrapper: css`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${width}px;
      height: ${height}px;
      overflow-y: auto;
      color: ${theme.colors.text.primary};
    `,
  });
};
