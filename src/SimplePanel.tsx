import React, { useMemo } from 'react';
import type { PanelProps, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';
import groupBy from 'lodash/groupBy';

import type { SimpleOptions } from './types';
import HostList from './HostList';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles(width, height));

  const dataFramesGroupByName = useMemo(() => groupBy(data.series, 'name'), [data]);

  return (
    <div className={styles.wrapper}>
      <HostList data={dataFramesGroupByName} width={width} height={height} />
    </div>
  );
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
