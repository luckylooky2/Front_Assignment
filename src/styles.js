import { css, injectGlobal } from '@emotion/css';

import { GRID } from './constant';

injectGlobal`
  @font-face {
    font-family: 'Roboto-Regular', sans-serif;
    src: url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap') format('truetype');
  }

  body {
   font-family: 'Roboto-Regular', sans-serif;
  }
`;

export const getDndStyles = {
  item: (isSelected, isValid, draggableStyle) =>
    css({
      userSelect: 'none',
      padding: `${GRID * 2}px`,
      margin: `0 0 ${GRID}px 0`,
      background: isSelected ? (isValid ? 'lightgreen' : 'lightcoral') : 'white',
      position: 'relative',
      borderRadius: '10px',
      ...draggableStyle,
    }),
  itemBlur: (isBlur) =>
    css({
      opacity: isBlur ? 0.3 : 1,
    }),
  list: (isDraggingOver) =>
    css({
      border: `${GRID}px solid white`,
      borderRadius: '20px',
      background: isDraggingOver ? 'lightblue' : 'gainsboro',
      padding: `${GRID}px`,
      width: '250px',
    }),
  invalidMsg: css({
    position: 'absolute',
    top: '110%',
    left: '0%',
    backgroundColor: 'lavenderblush',
    color: 'black',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    zIndex: '10',
  }),
  countCircle: css({
    position: 'absolute',
    top: '-15%',
    right: '-5%',
    backgroundColor: 'orange',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
};

export const getLayoutStyles = {
  appContainer: css({ display: 'relative' }),
  droppableContainer: css({ display: 'flex', justifyContent: 'center' }),
};

export const getNotificationStyles = {
  notificationContainer: css({
    position: 'absolute',
    top: '0%',
    right: '0%',
    pointerEvents: 'none',
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
      border: `3px solid ${isSuccess ? 'lightgreen' : 'red'}`,
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

export const getInformationStyles = {
  info: css({
    backgroundColor: 'lightblue',
    borderRadius: '4px',
    margin: '5px 0',
    padding: '10px 0 10px 25px',
  }),
};
