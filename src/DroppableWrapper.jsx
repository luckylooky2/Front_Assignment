import PropTypes from 'prop-types';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import DraggableWrapper from './DraggableWrapper';
import { getDndStyles } from './styles';

const DroppableWrapper = ({
  itemList,
  droppableIdx,
  srcDraggable,
  setSrcDraggable,
  dstDraggableState,
  pickedDraggable,
}) => {
  const styles = getDndStyles;

  return (
    <Droppable droppableId={`droppable-${droppableIdx}`}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className={styles.list(snapshot.isDraggingOver)}>
          {itemList.map((item, index) => (
            <DraggableWrapper
              key={`draggable-${index}`}
              item={item}
              itemList={itemList}
              droppableIdx={droppableIdx}
              itemIndex={index}
              srcDraggable={srcDraggable}
              setSrcDraggable={setSrcDraggable}
              dstDraggableState={dstDraggableState}
              pickedDraggable={pickedDraggable}
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
  setSrcDraggable: PropTypes.func,
  dstDraggableState: PropTypes.object,
  pickedDraggable: PropTypes.object,
};
