import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { getDndStyles } from './styles';

const DraggableWrapper = ({
  item,
  itemIndex,
  srcDraggable,
  dstDraggableState,
}) => {
  const styles = getDndStyles;
  const { isValid, invalidMsg } = dstDraggableState;

  return (
    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.item(
            snapshot.isDragging,
            provided.draggableProps.style,
            snapshot.draggingOver !== null && isValid,
          )}
        >
          {item.content}
          {srcDraggable && !isValid && srcDraggable.id === item.id && (
            <div className={styles.invalidMsg}>{invalidMsg}</div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWrapper;

DraggableWrapper.propTypes = {
  item: PropTypes.object,
  itemIndex: PropTypes.number,
  srcDraggable: PropTypes.object,
  dstDraggableState: PropTypes.object,
};
