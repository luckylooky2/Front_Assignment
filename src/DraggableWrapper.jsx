import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { getDndStyles } from './styles';
import { getNumberFromId } from './utils';

const DraggableWrapper = ({
  item,
  itemIndex,
  droppableIdx,
  srcDraggable,
  setSrcDraggable,
  dstDraggableState,
  firstPicked,
}) => {
  const styles = getDndStyles;
  const { isValid, invalidMsg } = dstDraggableState;

  const handleClick = (event) => {
    event.stopPropagation();
    const { target, metaKey, ctrlKey } = event;
    const { rowIdx, colIdx, rbdDraggableId } = target.dataset;
    const row = Number(rowIdx);
    const col = Number(colIdx);
    const id = getNumberFromId(rbdDraggableId);
    let isSameCol = false;

    if (srcDraggable.size) {
      const oldSrcDraggable = [...srcDraggable];
      isSameCol = col === oldSrcDraggable[0][1].col;
    }
    const newSrcDraggable =
      isSameCol && (metaKey || ctrlKey) ? new Map(srcDraggable) : new Map();

    if (srcDraggable.has(id) && isSameCol && (metaKey || ctrlKey)) {
      newSrcDraggable.delete(id);
    } else {
      newSrcDraggable.set(id, { row, col, id: rbdDraggableId });
    }

    setSrcDraggable(newSrcDraggable);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
      {(provided, snapshot) => {
        const isSrcDraggable = srcDraggable.has(getNumberFromId(item.id));
        const isSelected = snapshot.isDragging || isSrcDraggable;
        const isFirstPicked = !!firstPicked && firstPicked.id === item.id;
        const isBlur =
          isSrcDraggable &&
          srcDraggable.size > 1 &&
          !!firstPicked &&
          firstPicked.id !== item.id;
        const isMulti =
          isSrcDraggable && srcDraggable.size > 1 && isFirstPicked;
        const isMsgOpen = !isValid && isFirstPicked && invalidMsg;

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-col-idx={droppableIdx}
            data-row-idx={itemIndex}
            onClick={handleClick}
            className={cx(
              styles.item(isSelected, isValid, provided.draggableProps.style),
              styles.itemBlur(isBlur),
            )}
          >
            {item.content}
            {isMsgOpen && <div className={styles.invalidMsg}>{invalidMsg}</div>}
            {isMulti && (
              <div className={styles.countCircle}>
                <span>{srcDraggable.size}</span>
              </div>
            )}
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
  droppableIdx: PropTypes.number,
  srcDraggable: PropTypes.object,
  setSrcDraggable: PropTypes.func,
  dstDraggableState: PropTypes.object,
  firstPicked: PropTypes.object,
};
