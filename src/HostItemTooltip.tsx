import React from 'react';
import type { DataFrame, GrafanaTheme2 } from '@grafana/data';
import type { TooltipProps } from '@grafana/ui/components/Tooltip';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2, Tooltip } from '@grafana/ui';

import { getValueField, getMeanValue, formatDisplayValue } from './utils/grafanaHelper';

interface HostItemTooltipProps {
  children: TooltipProps['children'];
  name: string;
  dataFrames: DataFrame[];
}

const HostItemTooltip: React.FC<HostItemTooltipProps> = ({ children, name, dataFrames }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  return (
    <Tooltip
      content={
        <div className={styles.tooltip}>
          <h3>{name}</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {dataFrames.map(({ refId, fields }) => {
                const valueField = fields.find(getValueField);

                if (!valueField) {
                  return (
                    <tr key={refId}>
                      <td>{refId}</td>
                      <td>No Data</td>
                    </tr>
                  );
                }

                const displayValue = valueField.display!(getMeanValue(valueField));

                return (
                  <tr key={refId}>
                    <td>{refId}</td>
                    <td>{formatDisplayValue(displayValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tooltip: css`
    min-width: 120px;
    h3 {
      font-size: 1rem;
    }
    table {
      width: 100%;
      th {
        border-bottom: 1px solid ${theme.colors.border.weak};
      }
    }
  `,
});

export default HostItemTooltip;
