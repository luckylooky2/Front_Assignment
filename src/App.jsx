import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import ResultMessage from './ResultMessage';
import { COLUMN_COUNT, bannedMovingColumnRules } from './constant';
import { getLayoutStyles } from './styles';
import {
  createListsUpToColumnCount,
  reorder,
  isDraggableIdxValid,
  isDroppableIdxValid,
  dstDraggableStateCreator,
} from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(
    createListsUpToColumnCount(COLUMN_COUNT, 10),
  );
  const [srcDraggable, setSrcDraggable] = useState(null);
  const [dstDraggableState, setDstDraggableState] = useState(
    dstDraggableStateCreator(true),
  );
  const [dragResults, setDragResults] = useState([]);
  const styles = getLayoutStyles;

  const handleDragEnd = (result) => {
    if (!result.destination || !dstDraggableState.isValid) {
      setDstDraggableState(dstDraggableStateCreator(true));
      return;
    }

    const { droppableId: startId, index: startRow } = result.source;
    const { droppableId: endId, index: endRow } = result.destination;
    const [startCol, endCol] = [Number(startId.at(-1)), Number(endId.at(-1))];
    const newItems = reorder(itemLists, [startCol, startRow], [endCol, endRow]);

    setItemLists(newItems);
    setSrcDraggable(null);
    setDstDraggableState(dstDraggableStateCreator(true));
  };

  const handleDragStart = ({ source, draggableId }) => {
    const droppableIdx = Number(source.droppableId.at(-1));

    setSrcDraggable({
      row: source.index,
      col: droppableIdx,
      id: draggableId,
    });
  };

  const handleDragUpdate = ({ destination, draggableId }) => {
    setDstDraggableState(dstDraggableStateCreator(true));

    if (destination === null) {
      return;
    }

    const droppableIdx = Number(destination.droppableId.at(-1));
    const dstDraggable = {
      row: destination.index,
      col: droppableIdx,
      id: draggableId,
    };
    let invalidMsg = null;

    if (isDraggableIdxValid(srcDraggable, dstDraggable, itemLists)) {
      invalidMsg = '짝수 아이템을 짝수 아이템 앞으로 옮길 수 없습니다';
    } else if (
      isDroppableIdxValid(srcDraggable, dstDraggable, bannedMovingColumnRules)
    ) {
      invalidMsg = `칼럼 ${srcDraggable.col + 1}에서 칼럼 ${dstDraggable.col + 1}로 옮길 수 없습니다`;
    }
    if (invalidMsg) {
      setDstDraggableState(dstDraggableStateCreator(false, invalidMsg));
    }
  };

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragUpdate={handleDragUpdate}
    >
      <section className={styles.appContainer}>
        <div className={styles.droppableContainer}>
          {itemLists.map((itemList, index) => (
            <DroppableWrapper
              key={`droppable-${index}`}
              itemList={itemList}
              droppableIdx={index}
              srcDraggable={srcDraggable}
              dstDraggableState={dstDraggableState}
            />
          ))}
        </div>
        <ResultMessage dragResults={dragResults} />
      </section>
    </DragDropContext>
  );
}
