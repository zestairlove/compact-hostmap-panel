import React, { useMemo } from 'react';
import type { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from 'emotion';
import { useTheme2, useStyles2 } from '@grafana/ui';

import HostItem, { ITEM_STYLES } from './HostItem';

interface HostListProps {
  data: Record<string, DataFrame[]>;
  width: number;
  height: number;
}

const HostList: React.FC<HostListProps> = ({ data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const entries = useMemo(() => Object.entries(data), [data]);

  const { listWidth, listHeight, itemStyle, isOverflow } = useMemo(() => {
    const dataLength = entries.length;
    let _itemStyle = ITEM_STYLES[ITEM_STYLES.length - 1];
    let _listWidth;
    let _listHeight;
    let _isOverflow = true;

    for (const is of ITEM_STYLES) {
      const maxCol = Math.floor(width / is.width);
      const maxRow = Math.floor(height / is.width);

      if (maxCol * maxRow >= dataLength) {
        let colCount = Math.min(maxCol, Math.ceil(dataLength / maxRow));
        let rowCount = Math.ceil(dataLength / colCount);

        // 정사각형이나 컬럼이 하나 더 큰 직사각형 레이아웃을 만든다.
        while (colCount <= rowCount && (colCount + 1) * is.width < width) {
          colCount += 1;
          rowCount = Math.ceil(dataLength / colCount);
        }

        _listWidth = colCount * is.width;
        _listHeight = rowCount * is.width;
        _itemStyle = is;
        _isOverflow = false;
        break;
      }
    }
    return { listWidth: _listWidth, listHeight: _listHeight, itemStyle: _itemStyle, isOverflow: _isOverflow };
  }, [width, height, entries.length]);

  return (
    <div
      className={cx(
        styles.hostList,
        css`
          width: ${listWidth ? `${listWidth}px` : undefined};
          height: ${listHeight ? `${listHeight}px` : undefined};
          align-self: ${isOverflow ? 'flex-start' : undefined};
        `
      )}
    >
      {entries.map(([name, dataFrames], idx) => (
        <HostItem key={name} name={name} dataFrames={dataFrames} itemIndex={idx} itemStyle={itemStyle} />
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
