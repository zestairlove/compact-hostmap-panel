import React, { useMemo } from 'react';
import type { DataFrame, GrafanaTheme2, Field, DisplayValue } from '@grafana/data';
import { css, cx } from 'emotion';
import { FieldType } from '@grafana/data';
import { useTheme2, useStyles2, Tooltip } from '@grafana/ui';
import mean from 'lodash/mean';

interface HostListProps {
  data: Record<string, DataFrame[]>;
  width: number;
  height: number;
}

const getValueField = (field: Field) => field.type === FieldType.number;

const getMeanValue = (valueField: Field) => {
  return valueField.state?.calcs?.mean ?? mean(valueField.values.toArray());
};

const formatDisplayValue = (displayValue: DisplayValue) => {
  return displayValue.text + (displayValue.suffix ?? '');
};

const HostList: React.FC<HostListProps> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const entries = useMemo(() => Object.entries(data), [data]);

  return (
    <div className={styles.hostList}>
      {entries.map(([name, dataFrames]) => {
        const valueFields = dataFrames.map(({ fields }) => fields.find(getValueField));

        const meanValues = valueFields.map((valueField) => {
          return valueField ? getMeanValue(valueField) : null;
        });

        const maxIndex = meanValues.indexOf(Math.max(...meanValues));

        const maxDisplayValue = valueFields[maxIndex]?.display!(meanValues[maxIndex]);

        if (!maxDisplayValue) {
          return (
            <div>
              <span className={styles['sr-only']}>No Data</span>
            </div>
          );
        }

        return (
          <Tooltip
            key={name}
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
            <div
              className={cx(
                styles.hostItem,
                css`
                  background-color: ${maxDisplayValue.color};
                `
              )}
            >
              <span className={styles['sr-only']}>{name}</span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  hostList: css`
    display: inline-flex;
    flex-wrap: wrap;
    text-align: center;
  `,
  hostItem: css`
    position: relative;
    width: 40px;
    height: 40px;
    text-align: center;
    border: 1px solid ${theme.colors.border.medium};
    color: ${theme.colors.text.primary};
  `,
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
  'sr-only': css`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `,
});

export default HostList;
