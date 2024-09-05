import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import ResultMessage from './ResultMessage';
import { COLUMN_COUNT, INITIAL_ITEM_COUNT, INITIAL_SRC_DRAGGABLE, BANNED_COLUMN_MOVING_RULES } from './constant';
import { itemListscreator, dstDraggableStateCreator, draggableCreator } from './creator';
import { getLayoutStyles, getInformationStyles } from './styles';
import { reorder, isDraggableIdxValid, isDroppableIdxValid, getNumberFromId, sortSrcDraggableByRow } from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(itemListscreator(COLUMN_COUNT, INITIAL_ITEM_COUNT));
  const [srcDraggable, setSrcDraggable] = useState(new Map(INITIAL_SRC_DRAGGABLE));
  const [pickedDraggable, setPickedDraggable] = useState(null);
  const [dstDraggableState, setDstDraggableState] = useState(dstDraggableStateCreator(true));
  const [dragResults, setDragResults] = useState([]);
  const layoutStyles = getLayoutStyles;
  const infoStyles = getInformationStyles;

  /**
   * 표시 시간이 지난 이동 결과를 배열에서 제거한다.
   * @param {Number} id 이동 결과의 id
   */
  const removeResult = (id) => {
    setDragResults((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  /**
   * 이동 결과를 배열에 추가하고, 표시 시간이 지나면 삭제하는 콜백 함수를 등록한다.
   * @param {Boolean} result 이동 결과 성공/실패 여부
   */
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

  /**
   * 드롭 이벤트가 발생하면 호출되는 콜백 함수. 조건에 따라 드래그한 아이템을 업데이트할지 여부를 결정한다.
   * @param {Object} result 드롭 이벤트 객체
   */
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

  /**
   *  드래그 시작 이벤트가 발생하면 호출되는 콜백 함수. 직접 드래그되는 아이템(pickedDraggable)을 업데이트한다.
   * @param {Object} result 드래그 시작 이벤트 객체
   */
  const handleDragStart = ({ source, draggableId }) => {
    const srcCol = getNumberFromId(source.droppableId);
    const srcId = getNumberFromId(draggableId);

    // 현재 선택된 것과 다른 것을 드래그 한 경우
    if (!srcDraggable.has(srcId)) {
      const newSrcDraggable = new Map();
      newSrcDraggable.set(srcId, draggableCreator(srcCol, source.index, draggableId));
      setSrcDraggable(newSrcDraggable);
    }
    setPickedDraggable(draggableCreator(srcCol, source.index, draggableId));
  };

  /**
   * 드래그 업데이트 이벤트가 발생하면 호출되는 콜백 함수. 드롭이 가능하지 않은 경우, 메시지를 렌더링한다.
   * @param {Object} result 드래그 업데이트 이벤트 객체
   */
  const handleDragUpdate = ({ destination, draggableId }) => {
    setDstDraggableState(dstDraggableStateCreator(true));

    if (destination === null) {
      setDstDraggableState(dstDraggableStateCreator(false));
      return;
    }

    const dstCol = getNumberFromId(destination.droppableId);
    const dstDraggable = draggableCreator(dstCol, destination.index, draggableId);
    const sortedSrcDraggable = sortSrcDraggableByRow([...srcDraggable]);
    const lastSrcDraggable = sortedSrcDraggable[sortedSrcDraggable.length - 1];
    let invalidMsg = null;

    if (isDroppableIdxValid(pickedDraggable, dstDraggable, BANNED_COLUMN_MOVING_RULES)) {
      invalidMsg = `⚠️ 칼럼 ${pickedDraggable.col + 1}에서 칼럼 ${dstDraggable.col + 1}로 옮길 수 없습니다`;
    } else if (isDraggableIdxValid(itemLists, lastSrcDraggable, dstDraggable)) {
      invalidMsg = '⚠️ 짝수 아이템을 짝수 아이템 앞으로 옮길 수 없습니다';
    }

    if (invalidMsg) {
      setDstDraggableState(dstDraggableStateCreator(false, invalidMsg));
    }
  };

  /**
   * 현재 선택된 아이템을 초기화하는 클릭 이벤트 콜백 함수.
   */
  const handleResetSrcDraggable = () => {
    if (pickedDraggable === null) {
      setSrcDraggable(new Map());
    }
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
      <aside>
        <div className={infoStyles.info}>
          <b>
            ℹ️ 여러 항목을 선택하려면, Windows에서는 Ctrl 키를, Mac에서는 Command(⌘) 키를 누른 상태에서 항목을
            클릭하세요.
          </b>
        </div>
        <div className={infoStyles.info}>
          <b>ℹ️ 연속된 항목을 선택하려면, Shift 키를 누른 상태에서 첫 번째와 마지막 항목을 클릭하세요.</b>
        </div>
      </aside>
      <section className={layoutStyles.appContainer} onClick={handleResetSrcDraggable}>
        <div className={layoutStyles.droppableContainer}>
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
