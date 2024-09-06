import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { draggableCreator } from './creator';
import { getDndStyles } from './styles';
import { getNumberFromId, sortSrcDraggableByRow, upperBound, predecessor } from './utils';

const DraggableWrapper = ({
  item,
  itemList,
  itemLists,
  itemIndex,
  droppableIdx,
  srcDraggable,
  setSrcDraggable,
  dstDraggableState,
  pickedDraggable,
  lastClicked,
  setLastClicked,
}) => {
  const styles = getDndStyles;
  const { isValid, invalidMsg } = dstDraggableState;

  /**
   * 아이템 선택 클릭 이벤트 콜백 함수. Ctrl, Shift 키에 따라 선택된 아이템을 추가 또는 삭제한다.
   * @param {Object} event 클릭 이벤트 객체
   */
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

      if (newSrcDraggable) {
        // 바로 아래가 선택됨
        const justBelowRow = upperBound(newSrcDraggable, row);
        if (justBelowRow === null) {
          // 아래 없으면 위에가 선택됨
          const justAboveRow = predecessor(newSrcDraggable, row);
          if (justAboveRow === null) {
            setLastClicked([null, null, null]);
          } else {
            setLastClicked([justAboveRow, col, itemLists[col][justAboveRow].id]);
          }
        } else {
          setLastClicked([justBelowRow, col, itemLists[col][justBelowRow].id]);
        }
      }
      // 클릭되어 있지 않다면(shift를 눌렀거나 그냥 눌렀거나)
    } else {
      // shift를 누른 채라면
      if (shiftKey) {
        const sorted = srcDraggable.size && isSameCol ? sortSrcDraggableByRow([...srcDraggable]) : null;
        // 첫 번째가 있다면? 첫 번째부터 target까지
        // 아래 방향
        if (srcDraggable.size && sorted && row > lastClicked[0]) {
          for (let i = lastClicked[0]; i <= row; i++) {
            const item = itemList[i];
            newSrcDraggable.set(getNumberFromId(item.id), draggableCreator(col, i, item.id));
          }
          // 위 방향
        } else if (srcDraggable.size && sorted && row < lastClicked[0]) {
          console.log(row, lastClicked);
          for (let i = row; i <= lastClicked[0]; i++) {
            const item = itemList[i];
            newSrcDraggable.set(getNumberFromId(item.id), draggableCreator(col, i, item.id));
          }
          // 첫 번째가 없다면? target만
        } else {
          newSrcDraggable.set(id, draggableCreator(col, row, rbdDraggableId));
          setLastClicked([row, col, rbdDraggableId]);
        }
        // 그냥 눌렀다면
      } else {
        newSrcDraggable.set(id, draggableCreator(col, row, rbdDraggableId));
        setLastClicked([row, col, rbdDraggableId]);
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
  itemLists: PropTypes.array,
  itemList: PropTypes.array,
  itemIndex: PropTypes.number,
  droppableIdx: PropTypes.number,
  srcDraggable: PropTypes.object,
  setSrcDraggable: PropTypes.func,
  dstDraggableState: PropTypes.object,
  pickedDraggable: PropTypes.object,
  lastClicked: PropTypes.array,
  setLastClicked: PropTypes.func,
};
