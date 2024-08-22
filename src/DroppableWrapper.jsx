import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { bannedMovingColumnRules } from './constant';
import { getDndStyles } from './styles';

const DroppableWrapper = ({ itemList, droppableIdx, srcDroppableIdx }) => {
  const styles = getDndStyles;

  const decideDroppableDisable = useCallback(
    (srcDroppableIdx, droppableIdx) => {
      if (srcDroppableIdx === -1) {
        return false;
      }

      for (const [bannedSrc, bannedDst] of bannedMovingColumnRules) {
        if (srcDroppableIdx === bannedSrc && droppableIdx === bannedDst) {
          return true;
        }
      }
      return false;
    },
    [srcDroppableIdx, droppableIdx],
  );

  return (
    <Droppable
      droppableId={`droppable-${droppableIdx}`}
      isDropDisabled={decideDroppableDisable(srcDroppableIdx, droppableIdx)}
    >
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.list(snapshot.isDraggingOver)}
        >
          {itemList.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={styles.item(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                    )}
                  >
                    {item.content}
                  </div>
                );
              }}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableWrapper;

DroppableWrapper.propTypes = {
  itemList: PropTypes.array,
  droppableIdx: PropTypes.number,
  srcDroppableIdx: PropTypes.number,
};
