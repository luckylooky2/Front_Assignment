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
      position: 'relative',
      ...draggableStyle,
    }),
  list: (isDraggingOver) =>
    css({
      border: `${GRID}px solid white`,
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      padding: `${GRID}px`,
      width: '250px',
    }),
  invalidMsg: css({
    position: 'absolute',
    top: '110%',
    left: '0%',
    // transform: 'translateX(-50%)',
    backgroundColor: 'rgb(200, 200, 200)',
    color: 'black',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid black',
    whiteSpace: 'nowrap',
    zIndex: '10',
  }),
};

export const getLayoutStyles = {
  appContainer: css({ display: 'relative' }),
  droppableContainer: css({ display: 'flex' }),
};

export const getNotificationStyles = {
  notificationContainer: css({
    position: 'absolute',
    top: '0%',
    right: '0%',
  }),
  result: (isSuccess, visible) =>
    css({
      display: 'flex',
      width: '180px',
      height: '30px',
      backgroundColor: 'white',
      color: 'black',
      padding: '8px',
      marginBottom: '3px',
      borderRadius: '4px',
      border: `3px solid ${isSuccess ? 'green' : 'red'}`,
      whiteSpace: 'nowrap',
      zIndex: '10',
      opacity: `${visible ? 1 : 0}`,
      transition: 'opacity 0.5s ease-in-out',
    }),
  message: css({
    margin: 'auto auto',
    fontSize: '17px',
  }),
};
