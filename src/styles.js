import { css } from '@emotion/css';

import { GRID } from './constant';

export const getDndStyles = {
  item: (isDragging, draggableStyle, canDrop) =>
    css({
      userSelect: 'none',
      padding: `${GRID * 2}px`,
      margin: `0 0 ${GRID}px 0`,
      background: isDragging ? (canDrop ? 'lightgreen' : 'red') : 'grey',
      transition: 'background-color 0.5s ease-in-out',
      ...draggableStyle,
    }),
  list: (isDraggingOver) =>
    css({
      border: `${GRID}px solid white`,
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: `${GRID}px`,
      width: '250px',
    }),
};

export const getLayoutStyles = {
  flexContainer: css({ display: 'flex' }),
};
