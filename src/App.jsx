import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import ResultMessage from './ResultMessage';
import { COLUMN_COUNT, INITIAL_ITEM_COUNT, INITIAL_SRC_DRAGGABLE, BANNED_COLUMN_MOVING_RULES } from './constant';
import { getLayoutStyles } from './styles';
import {
  createItemLists,
  reorder,
  isDraggableIdxValid,
  isDroppableIdxValid,
  dstDraggableStateCreator,
  getNumberFromId,
  sortSrcDraggableByRow,
} from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(createItemLists(COLUMN_COUNT, INITIAL_ITEM_COUNT));
  const [srcDraggable, setSrcDraggable] = useState(new Map(INITIAL_SRC_DRAGGABLE));
  const [pickedDraggable, setPickedDraggable] = useState(null);
  const [dstDraggableState, setDstDraggableState] = useState(dstDraggableStateCreator(true));
  const [dragResults, setDragResults] = useState([]);
  const styles = getLayoutStyles;

  const removeResult = (id) => {
    setDragResults((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const addResult = (result) => {
    const id = Date.now();
    setDragResults((prev) => [...prev, { id, result, visible: true }]);

    setTimeout(() => {
      setDragResults((prevAlerts) =>
        prevAlerts.map((alert) => (alert.id === id ? { ...alert, visible: false } : alert)),
      );
    }, 3000);

    setTimeout(() => {
      removeResult(id);
    }, 3500);
  };

  const handleDragEnd = (result) => {
    setPickedDraggable(null);
    // 아무런 변화도 없는 경우
    if (
      !result.destination ||
      (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index)
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

    const { droppableId: tmpSrcRow, index: srcRow } = result.source;
    const { droppableId: tmpDstRow, index: dstRow } = result.destination;
    const srcId = getNumberFromId(result.draggableId);
    const arrayToMove = sortSrcDraggableByRow([...srcDraggable]);
    const [srcCol, dstCol] = [getNumberFromId(tmpSrcRow), getNumberFromId(tmpDstRow)];
    const newItems = reorder(itemLists, arrayToMove, [srcCol, srcRow, srcId], [dstCol, dstRow]);

    setItemLists(newItems);
    addResult(true);
    setDstDraggableState(dstDraggableStateCreator(true));
  };

  const handleDragStart = ({ source, draggableId }) => {
    const srcCol = getNumberFromId(source.droppableId);
    const srcId = getNumberFromId(draggableId);

    // 다른 것으로
    if (!srcDraggable.has(srcId)) {
      const newSrcDraggable = new Map();
      newSrcDraggable.set(srcId, {
        row: source.index,
        col: srcCol,
        id: draggableId,
      });
      setSrcDraggable(newSrcDraggable);
    }
    setPickedDraggable({
      row: source.index,
      col: srcCol,
      id: draggableId,
    });
  };

  const handleDragUpdate = ({ destination, draggableId }) => {
    setDstDraggableState(dstDraggableStateCreator(true));

    if (destination === null) {
      setDstDraggableState(dstDraggableStateCreator(false));
      return;
    }

    const dstCol = getNumberFromId(destination.droppableId);
    // draggableCreator 적용
    const dstDraggable = {
      row: destination.index,
      col: dstCol,
      id: draggableId,
    };
    let invalidMsg = null;

    if (isDroppableIdxValid(pickedDraggable, dstDraggable, BANNED_COLUMN_MOVING_RULES)) {
      invalidMsg = `칼럼 ${pickedDraggable.col + 1}에서 칼럼 ${dstDraggable.col + 1}로 옮길 수 없습니다`;
    } else if (isDraggableIdxValid(itemLists, pickedDraggable, dstDraggable)) {
      invalidMsg = '짝수 아이템을 짝수 아이템 앞으로 옮길 수 없습니다';
    }

    if (invalidMsg) {
      setDstDraggableState(dstDraggableStateCreator(false, invalidMsg));
    }
  };

  const handleResetSrcDraggable = () => {
    if (pickedDraggable === null) {
      setSrcDraggable(new Map());
    }
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
      <section className={styles.appContainer} onClick={handleResetSrcDraggable}>
        <div className={styles.droppableContainer}>
          {itemLists.map((itemList, index) => (
            <DroppableWrapper
              key={`droppable-${index}`}
              itemList={itemList}
              droppableIdx={index}
              srcDraggable={srcDraggable}
              setSrcDraggable={setSrcDraggable}
              dstDraggableState={dstDraggableState}
              pickedDraggable={pickedDraggable}
            />
          ))}
        </div>
        <ResultMessage dragResults={dragResults} />
      </section>
    </DragDropContext>
  );
}
