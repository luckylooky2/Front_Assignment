import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import ResultMessage from './ResultMessage';
import {
  COLUMN_COUNT,
  INITIAL_ITEM_COUNT,
  BANNED_COLUMN_MOVING_RULES,
} from './constant';
import { getLayoutStyles } from './styles';
import {
  createItemLists,
  reorder,
  isDraggableIdxValid,
  isDroppableIdxValid,
  dstDraggableStateCreator,
} from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(
    createItemLists(COLUMN_COUNT, INITIAL_ITEM_COUNT),
  );
  const [srcDraggable, setSrcDraggable] = useState(null);
  const [dstDraggableState, setDstDraggableState] = useState(
    dstDraggableStateCreator(true),
  );
  const [dragResults, setDragResults] = useState([]);
  const styles = getLayoutStyles;

  const removeResult = (id) => {
    setDragResults((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== id),
    );
  };

  const addResult = (result) => {
    const id = Date.now();
    setDragResults((prev) => [...prev, { id, result, visible: true }]);

    setTimeout(() => {
      setDragResults((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === id ? { ...alert, visible: false } : alert,
        ),
      );
    }, 3000);

    setTimeout(() => {
      removeResult(id);
    }, 3500);
  };

  const handleDragEnd = (result) => {
    if (
      !result.destination ||
      (result.source.droppableId === result.destination.droppableId &&
        result.source.index === result.destination.index)
    ) {
      setDstDraggableState(dstDraggableStateCreator(true));
      return;
    }

    if (!dstDraggableState.isValid) {
      setDstDraggableState(dstDraggableStateCreator(true));
      addResult(false);
      return;
    }

    const { droppableId: startId, index: startRow } = result.source;
    const { droppableId: endId, index: endRow } = result.destination;
    const [startCol, endCol] = [Number(startId.at(-1)), Number(endId.at(-1))];
    const newItems = reorder(itemLists, [startCol, startRow], [endCol, endRow]);

    setItemLists(newItems);
    setSrcDraggable(null);
    addResult(true);
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
      isDroppableIdxValid(
        srcDraggable,
        dstDraggable,
        BANNED_COLUMN_MOVING_RULES,
      )
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
