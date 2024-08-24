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
  const [srcDraggable, setSrcDraggable] = useState(new Map());
  const [firstPicked, setFirstPicked] = useState(null);
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
    setSrcDraggable(new Map());
    setFirstPicked(null);
    // 아무런 변화도 없는 경우
    if (
      !result.destination ||
      (result.source.droppableId === result.destination.droppableId &&
        result.source.index === result.destination.index)
    ) {
      setDstDraggableState(dstDraggableStateCreator(true));
      return;
    }

    // 드롭하는 곳이 조건과 맞지 않을 경우
    if (!dstDraggableState.isValid) {
      setDstDraggableState(dstDraggableStateCreator(true));
      addResult(false);
      return;
    }

    const { droppableId: endId, index: endRow } = result.destination;
    const targets = [...srcDraggable]
      .map(([_id, src]) => src)
      .sort((a, b) => a.row - b.row);
    const [endCol] = [Number(endId.split('-')[1])];
    const newItems = reorder(itemLists, targets, [endCol, endRow]);

    setItemLists(newItems);
    addResult(true);
    setDstDraggableState(dstDraggableStateCreator(true));
  };

  const handleDragStart = ({ source, draggableId }) => {
    const droppableIdx = Number(source.droppableId.split('-')[1]);
    const id = Number(draggableId.split('-')[1]);

    // 다른 것으로
    if (!srcDraggable.has(id)) {
      const newSrcDraggable = new Map();
      newSrcDraggable.set(id, {
        row: source.index,
        col: droppableIdx,
        id: draggableId,
      });
      setSrcDraggable(newSrcDraggable);
    }
    setFirstPicked({
      row: source.index,
      col: droppableIdx,
      id: draggableId,
    });
  };

  const handleDragUpdate = ({ destination, draggableId }) => {
    setDstDraggableState(dstDraggableStateCreator(true));

    if (destination === null) {
      setDstDraggableState(dstDraggableStateCreator(false));
      return;
    }

    const droppableIdx = Number(destination.droppableId.split('-')[1]);
    const dstDraggable = {
      row: destination.index,
      col: droppableIdx,
      id: draggableId,
    };
    let invalidMsg = null;

    if (isDraggableIdxValid(firstPicked, dstDraggable, itemLists)) {
      invalidMsg = '짝수 아이템을 짝수 아이템 앞으로 옮길 수 없습니다';
    } else if (
      isDroppableIdxValid(firstPicked, dstDraggable, BANNED_COLUMN_MOVING_RULES)
    ) {
      invalidMsg = `칼럼 ${firstPicked.col + 1}에서 칼럼 ${dstDraggable.col + 1}로 옮길 수 없습니다`;
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
              setSrcDraggable={setSrcDraggable}
              dstDraggableState={dstDraggableState}
              firstPicked={firstPicked}
            />
          ))}
        </div>
        <ResultMessage dragResults={dragResults} />
      </section>
    </DragDropContext>
  );
}
