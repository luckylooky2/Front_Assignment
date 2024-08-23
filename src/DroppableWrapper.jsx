import PropTypes from 'prop-types';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import DraggableWrapper from './DraggableWrapper';
import { getDndStyles } from './styles';

const DroppableWrapper = ({
  itemList,
  droppableIdx,
  srcDraggable,
  dstDraggableState,
}) => {
  const styles = getDndStyles;

  return (
    <Droppable droppableId={`droppable-${droppableIdx}`}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.list(snapshot.isDraggingOver)}
        >
          {itemList.map((item, index) => (
            <DraggableWrapper
              key={`draggable-${index}`}
              item={item}
              itemIndex={index}
              srcDraggable={srcDraggable}
              dstDraggableState={dstDraggableState}
            />
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
  srcDraggable: PropTypes.object,
  dstDraggableState: PropTypes.object,
};

// 지금 같은 Droppable 내에서 한 번 ue가 되면, 더 이상 onUpdate가 발생하지 않는 것이 문제
