import React, { useMemo } from 'react';
import type { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';

import HostItem from './HostItem';

interface HostListProps {
  data: Record<string, DataFrame[]>;
  width: number;
  height: number;
}

const HostList: React.FC<HostListProps> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const entries = useMemo(() => Object.entries(data), [data]);

  return (
    <div className={styles.hostList}>
      {entries.map(([name, dataFrames], idx) => (
        <HostItem key={name} name={name} dataFrames={dataFrames} itemIndex={idx} />
      ))}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  hostList: css`
    display: inline-flex;
    flex-wrap: wrap;
    text-align: center;
  `,
});

export default HostList;
