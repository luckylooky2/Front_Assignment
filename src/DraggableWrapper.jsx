import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { getDndStyles } from './styles';
import { getNumberFromId, sortSrcDraggableByRow } from './utils';

const DraggableWrapper = ({
  item,
  itemList,
  itemIndex,
  droppableIdx,
  srcDraggable,
  setSrcDraggable,
  dstDraggableState,
  pickedDraggable,
}) => {
  const styles = getDndStyles;
  const { isValid, invalidMsg } = dstDraggableState;

  const handleClick = (event) => {
    event.stopPropagation();
    const { target, metaKey, ctrlKey, shiftKey } = event;
    const { rowIdx, colIdx, rbdDraggableId } = target.dataset;
    const row = Number(rowIdx);
    const col = Number(colIdx);
    const id = getNumberFromId(rbdDraggableId);
    let isSameCol = false;

    if (srcDraggable.size) {
      const oldSrcDraggable = [...srcDraggable];
      isSameCol = col === oldSrcDraggable[0][1].col;
    }
    const newSrcDraggable = isSameCol && (metaKey || ctrlKey) ? new Map(srcDraggable) : new Map();

    // 같은 칼럼에서 ctrl을 누른 채로, 이미 클릭되어 있다면
    if (srcDraggable.has(id) && isSameCol && (metaKey || ctrlKey)) {
      newSrcDraggable.delete(id);
      // 클릭되어 있지 않다면(shift를 눌렀거나 그냥 눌렀거나)
    } else {
      // shift를 누른 채라면
      if (shiftKey) {
        const sorted = srcDraggable.size && isSameCol ? sortSrcDraggableByRow([...srcDraggable]) : null;

        // 첫 번째가 있다면? 첫 번째부터 target까지
        if (srcDraggable.size && sorted && rowIdx > sorted[0].row) {
          // 아래 방향만 유효
          for (let i = sorted[0].row; i <= rowIdx; i++) {
            const item = itemList[i];
            newSrcDraggable.set(getNumberFromId(item.id), {
              row: i,
              col,
              id: item.id,
            });
          }
          // 첫 번째가 없다면? target만
        } else {
          newSrcDraggable.set(id, { row, col, id: rbdDraggableId });
        }
        // 그냥 눌렀다면
      } else {
        newSrcDraggable.set(id, { row, col, id: rbdDraggableId });
      }
    }

    setSrcDraggable(newSrcDraggable);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
      {(provided, snapshot) => {
        const isSrcDraggable = srcDraggable.has(getNumberFromId(item.id));
        const isSelected = snapshot.isDragging || isSrcDraggable;
        const isPickedDraggable = !!pickedDraggable && pickedDraggable.id === item.id;
        const isBlur = isSrcDraggable && srcDraggable.size > 1 && !!pickedDraggable && pickedDraggable.id !== item.id;
        const isMulti = isSrcDraggable && srcDraggable.size > 1 && isPickedDraggable;
        const isMsgOpen = !isValid && isPickedDraggable && invalidMsg;

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-col-idx={droppableIdx}
            data-row-idx={itemIndex}
            onClick={handleClick}
            className={cx(styles.item(isSelected, isValid, provided.draggableProps.style), styles.itemBlur(isBlur))}
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
  itemList: PropTypes.array,
  itemIndex: PropTypes.number,
  droppableIdx: PropTypes.number,
  srcDraggable: PropTypes.object,
  setSrcDraggable: PropTypes.func,
  dstDraggableState: PropTypes.object,
  pickedDraggable: PropTypes.object,
};
