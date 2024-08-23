import PropTypes from 'prop-types';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import DraggableWrapper from './DraggableWrapper';
import { bannedMovingColumnRules } from './constant';
import { getDndStyles } from './styles';
// import { reorder } from './utils';

const DroppableWrapper = ({
  itemList,
  droppableIdx,
  itemLists,
  srcDraggable,
  dstDraggable,
}) => {
  const styles = getDndStyles;

  // dst의 위치에 따라 Droppable의 isDropDisabled가 바뀌도록 하려면 어떻게?
  // - dst의 위치를 어떻게 탐지?

  const isDroppableIdxValid = (srcDraggable, droppableIdx) => {
    if (srcDraggable === null) {
      return false;
    }

    for (const [bannedSrc, bannedDst] of bannedMovingColumnRules) {
      if (srcDraggable.col === bannedSrc && droppableIdx === bannedDst) {
        // console.log(srcDraggable.col, droppableIdx);
        return true;
      }
    }
    return false;
  };

  const isDraggableIdxValid = (srcDraggable, dstDraggable, itemLists) => {
    // console.log(droppableIdx, srcDraggable, dstDraggable);
    if (srcDraggable === null || dstDraggable === null) {
      return false;
    }

    if (
      srcDraggable.row === dstDraggable.row &&
      srcDraggable.col === dstDraggable.col
    ) {
      return false;
    }

    if (dstDraggable.col !== droppableIdx) {
      return false;
    }

    const dstItemList = itemLists[dstDraggable.col];

    let newItemList;
    if (srcDraggable.col === dstDraggable.col) {
      const from = dstItemList.slice().map((v) => v.id);
      const [removed] = from.splice(srcDraggable.row, 1);
      from.splice(dstDraggable.row, 0, removed);
      newItemList = from;
    } else {
      // [0, 1, 2, 3] 의 2에 push
      const front = dstDraggable.row
        ? dstItemList.slice(0, dstDraggable.row).map((v) => v.id)
        : []; // [0, 1]
      const mid = [dstDraggable.id]; // [2]
      const back =
        dstDraggable.row < dstItemList.length
          ? dstItemList.slice(dstDraggable.row).map((v) => v.id)
          : []; // [2, 3]
      newItemList = front.concat(mid).concat(back);
    }

    // console.log(newItemList);
    // 현재 옮기려는 것이 아니라 하나라도 짝수 위의 짝수가 있으면 true 리턴?
    if (newItemList.length > 1 && dstDraggable.row < newItemList.length - 1) {
      const first = dstDraggable.row;
      const second = first + 1;
      const upper = Number(newItemList[first].at(-1));
      const lower = Number(newItemList[second].at(-1));

      if (upper && !(upper % 2) && lower && !(lower % 2)) {
        return true;
      }
    }

    return false;
  };

  return (
    <Droppable
      droppableId={`droppable-${droppableIdx}`}
      isDropDisabled={(function () {
        const res1 = isDroppableIdxValid(srcDraggable, droppableIdx);
        const res2 = isDraggableIdxValid(srcDraggable, dstDraggable, itemLists);

        // console.log(droppableIdx, 'result', res1, res2);
        return res1 || res2;
      })()}
    >
      {(provided, snapshot) => {
        // 현재 Droppable에 올라와 있는지? 단, isDropDisabled에 영향을 받음
        // Droppable 기준으로 생각해야 할 듯
        // console.log(snapshot);

        return (
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
              />
            ))}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default DroppableWrapper;

DroppableWrapper.propTypes = {
  itemList: PropTypes.array,
  droppableIdx: PropTypes.number,
  itemLists: PropTypes.array,
  srcDraggable: PropTypes.object,
  dstDraggable: PropTypes.object,
  // setDstDraggable: PropTypes.func,
};

// 지금 같은 Droppable 내에서 한 번 true가 되면, 더 이상 onUpdate가 발생하지 않는 것이 문제
