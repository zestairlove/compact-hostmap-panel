import React from 'react';
import type { PanelProps, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2, Tooltip, Alert, VerticalGroup } from '@grafana/ui';
import groupBy from 'lodash/groupBy';

import type { SimpleOptions } from './types';
import HostList from './HostList';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles(width, height));

  const hasDisplayNameFromDS = data.series.some((val) => {
    return val.fields.length > 0 && val.fields[1]?.config?.displayNameFromDS;
  });

  if (!hasDisplayNameFromDS) {
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
                Please check if you have correctly entered the Legend value as a custom option in the queryEditor
                options. ex) {`{{hostName}} or {{instance}}`}
              </div>
            </VerticalGroup>
          </Alert>
        </div>
      </div>
    );
  }

  const dataFramesGroupByName = groupBy(data.series, 'fields[1].config.displayNameFromDS');

  const noDataFrames = dataFramesGroupByName.undefined;
  const noDataFramesLength = noDataFrames?.length || 0;

  delete dataFramesGroupByName.undefined;

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
          <div className={styles.noDataFrame}>No DataQuery: {noDataFramesLength}</div>
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
