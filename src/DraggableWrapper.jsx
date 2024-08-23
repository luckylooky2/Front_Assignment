import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { getDndStyles } from './styles';

const DraggableWrapper = ({ item, itemIndex }) => {
  const styles = getDndStyles;

  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={itemIndex}
      // 직접 움직일 수 없을 뿐이지, 다른 블록에 의해 움직임은 가능하다
      // isDragDisabled={itemUid === 3}
    >
      {(provided, snapshot) => {
        // Draggable 입장에서 어디 올라가 있는지
        console.log(snapshot, provided);

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.item(
              snapshot.isDragging,
              provided.draggableProps.style,
              snapshot.draggingOver !== null,
            )}
          >
            {item.content}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableWrapper;

DraggableWrapper.propTypes = {
  item: PropTypes.object,
  itemIndex: PropTypes.number,
};
