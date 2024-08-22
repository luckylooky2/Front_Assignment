import { css } from '@emotion/css';

import { GRID } from './constant';

export const getDndStyles = {
  item: (isDragging, draggableStyle) =>
    css({
      userSelect: 'none',
      padding: `${GRID * 2}px`,
      margin: `0 0 ${GRID}px 0`,
      background: isDragging ? 'lightgreen' : 'grey',
      ...draggableStyle,
    }),
  list: (isDraggingOver) =>
    css({
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: `${GRID}px`,
      width: '250px',
    }),
};

export const getLayoutStyles = {
  flexContainer: css({ display: 'flex', gap: 10 }),
};
