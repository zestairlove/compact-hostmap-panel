import React, { memo, useMemo } from 'react';
import type { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';

import { getValueField, getMeanValue } from './utils/grafanaHelper';
import HostItemTooltip from './HostItemTooltip';

interface HostItemProps {
  name: string;
  dataFrames: DataFrame[];
  itemIndex: number;
}

const HostItem: React.FC<HostItemProps> = ({ name, dataFrames, itemIndex }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const linkInfo = useMemo(() => {
    let _linkInfo = null;
    const firstValueField = dataFrames[0].fields.find(getValueField);

    if (typeof firstValueField?.getLinks === 'function') {
      _linkInfo = firstValueField.getLinks({ valueRowIndex: itemIndex });
    }

    return _linkInfo;
  }, [dataFrames, itemIndex]);

  const renderItem = () => {
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
    );
  };

  return (
    <HostItemTooltip name={name} dataFrames={dataFrames}>
      {linkInfo && linkInfo.length > 0 ? (
        <a
          href={linkInfo[0].href}
          target={linkInfo[0].target}
          rel={linkInfo[0].target === '_blank' ? 'noreferrer' : undefined}
        >
          {renderItem()}
        </a>
      ) : (
        renderItem()
      )}
    </HostItemTooltip>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  hostItem: css`
    position: relative;
    width: 40px;
    height: 40px;
    text-align: center;
    border: 1px solid ${theme.colors.border.medium};
    color: ${theme.colors.text.primary};
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
