import PropTypes from 'prop-types';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import DraggableWrapper from './DraggableWrapper';
import { getDndStyles } from './styles';

const DroppableWrapper = ({
  itemLists,
  itemList,
  droppableIdx,
  srcDraggable,
  setSrcDraggable,
  dstDraggableState,
  pickedDraggable,
  lastClicked,
  setLastClicked,
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
              itemLists={itemLists}
              itemList={itemList}
              droppableIdx={droppableIdx}
              itemIndex={index}
              srcDraggable={srcDraggable}
              setSrcDraggable={setSrcDraggable}
              dstDraggableState={dstDraggableState}
              pickedDraggable={pickedDraggable}
              lastClicked={lastClicked}
              setLastClicked={setLastClicked}
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
  itemLists: PropTypes.array,
  itemList: PropTypes.array,
  droppableIdx: PropTypes.number,
  srcDraggable: PropTypes.object,
  setSrcDraggable: PropTypes.func,
  dstDraggableState: PropTypes.object,
  pickedDraggable: PropTypes.object,
  lastClicked: PropTypes.array,
  setLastClicked: PropTypes.func,
};
