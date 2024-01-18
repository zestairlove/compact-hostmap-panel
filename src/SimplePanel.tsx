import React from 'react';
import type { PanelProps, GrafanaTheme2, DataFrame } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2, Tooltip, Alert, VerticalGroup } from '@grafana/ui';

import type { SimpleOptions } from './types';
import HostList from './HostList';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles(width, height));

  /**
   * groupBy key can be
   * - data.series[0].name
   * - data.series[0].fields[1].config.displayName
   * - data.series[0].fields[1].config.displayNameFromDS
   */

  const dataFramesGroupByName = data.series.reduce<Record<string, DataFrame[]>>((acc, cur) => {
    const name = cur.name || cur.fields[1]?.config?.displayName || cur.fields[1]?.config?.displayNameFromDS || 'noData';
    acc[name] = acc[name] ? acc[name].concat(cur) : [cur];
    return acc;
  }, {});

  const noDataFrames = dataFramesGroupByName.noData;
  const noDataFramesLength = noDataFrames?.length || 0;
  delete dataFramesGroupByName.noData;

  const hasDataToDisplay = Object.keys(dataFramesGroupByName).length > 0;

  if (!hasDataToDisplay) {
    return (
      <div className={styles.wrapper}>
        <div
          className={cx(
            css`
              width: ${width ? `${width}px` : undefined};
              height: ${height ? `${height}px` : undefined};
            `
          )}
        >
          <Alert title="There is no data to display." severity="warning">
            <VerticalGroup>
              <div>
                (Prometheus)Please check if you have correctly entered the Legend value as a custom option in the
                queryEditor options. ex) {`{{hostName}} or {{instance}}`}
              </div>
              <div>
                or the response series from the datasource you are using must have a key to be used as the name.
              </div>
            </VerticalGroup>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <HostList data={dataFramesGroupByName} width={width} height={height} />
      {noDataFramesLength > 0 && (
        <Tooltip
          content={
            <div>
              {noDataFrames.map(({ refId }) => (
                <div key={refId}>refId: {refId}</div>
              ))}
            </div>
          }
        >
          <div className={styles.noDataFrame}>No Data: {noDataFramesLength}</div>
        </Tooltip>
      )}
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

    noDataFrame: css`
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: ${theme.typography.bodySmall.fontSize};
      &:hover {
        cursor: pointer;
      }
    `,
  });
};
