import React, { memo, useMemo } from 'react';
import type { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';

import { getValueField, getMeanValue, formatDisplayValue } from './utils/grafanaHelper';
import HostItemTooltip from './HostItemTooltip';
import { transformColor } from './utils/colors';

type ItemStyle = {
  type: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  width: number;
  borderRadius: string;
};

export const ITEM_STYLES: ItemStyle[] = [
  { type: 'xl', width: 52, borderRadius: '4px' },
  { type: 'lg', width: 44, borderRadius: '4px' },
  { type: 'md', width: 36, borderRadius: '3px' },
  { type: 'sm', width: 28, borderRadius: '3px' },
  { type: 'xs', width: 20, borderRadius: '2px' },
];

interface HostItemProps {
  name: string;
  dataFrames: DataFrame[];
  itemIndex: number;
  itemStyle: ItemStyle;
}

const HostItem: React.FC<HostItemProps> = ({ name, dataFrames, itemIndex, itemStyle }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles(itemStyle));

  const linkInfo = useMemo(() => {
    let _linkInfo = null;
    const firstValueField = dataFrames[0].fields.find(getValueField);

    if (typeof firstValueField?.getLinks === 'function') {
      _linkInfo = firstValueField.getLinks({ valueRowIndex: itemIndex });
    }

    return _linkInfo;
  }, [dataFrames, itemIndex]);

  const renderInner = () => {
    const valueFields = dataFrames.map(({ fields }) => fields.find(getValueField));

    const meanValues = valueFields.map((valueField) => {
      return valueField ? getMeanValue(valueField) : null;
    });

    const maxIndex = meanValues.indexOf(Math.max(...meanValues));

    const maxDisplayValue = valueFields[maxIndex]?.display!(meanValues[maxIndex]);

    if (!maxDisplayValue) {
      return (
        <div className={styles.full}>
          <span className={styles['sr-only']}>No Data</span>
        </div>
      );
    }

    return (
      <div
        className={cx(
          'item-inset',
          css`
            background-color: ${maxDisplayValue.color
              ? transformColor(maxDisplayValue.color, -10)
              : theme.colors.background.primary};
          `
        )}
      >
        <div
          className={cx(
            'item-inset-2nd',
            css`
              background: ${maxDisplayValue.color ?? 'none'};
            `
          )}
        >
          <span
            className={cx(
              'dot',
              css`
                color: ${maxDisplayValue.color ? theme.colors.getContrastText(maxDisplayValue.color) : undefined};
              `
            )}
          >
            ...
          </span>
          <span className={styles['sr-only']}>{formatDisplayValue(maxDisplayValue)}</span>
        </div>
      </div>
    );
  };

  return (
    <HostItemTooltip name={name} dataFrames={dataFrames}>
      <div className={styles.hostItem}>
        {linkInfo && linkInfo.length > 0 ? (
          <a
            href={linkInfo[0].href}
            target={linkInfo[0].target}
            rel={linkInfo[0].target === '_blank' ? 'noreferrer' : undefined}
          >
            {renderInner()}
          </a>
        ) : (
          renderInner()
        )}
      </div>
    </HostItemTooltip>
  );
};

const getStyles = (itemStyle: ItemStyle) => (theme: GrafanaTheme2) => ({
  full: css`
    width: 100%;
    height: 100%;
  `,
  hostItem: css`
    position: relative;
    width: ${itemStyle.width}px;
    height: ${itemStyle.width}px;
    text-align: center;
    color: ${theme.colors.text.primary};
    .item-inset {
      position: absolute;
      inset: ${itemStyle.borderRadius};
      border: 1px solid ${theme.colors.border.weak};
      border-radius: ${itemStyle.borderRadius};
      box-shadow: ${theme.shadows.z1};
    }
    .item-inset-2nd {
      position: absolute;
      inset: 0 0 2px;
      overflow: hidden;
      border-radius: ${itemStyle.borderRadius};
    }
    .dot {
      display: ${itemStyle.type === 'xs' ? 'none' : 'block'};
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      line-height: 1;
      margin-top: -5px;
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

export default memo(HostItem);
