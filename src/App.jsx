import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import { COLUMN_COUNT } from './constant';
import { getLayoutStyles } from './styles';
import { createListsUpToColumnCount, reorder } from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(
    createListsUpToColumnCount(COLUMN_COUNT, 10),
  );
  const [srcDraggable, setSrcDraggable] = useState(null);
  const [dstDraggable, setDstDraggable] = useState(null);
  const style = getLayoutStyles;

  // console.log(itemLists);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { droppableId: startId, index: startRow } = result.source;
    const { droppableId: endId, index: endRow } = result.destination;
    const [startCol, endCol] = [Number(startId.at(-1)), Number(endId.at(-1))];
    const newItems = reorder(itemLists, [startCol, startRow], [endCol, endRow]);
    setItemLists(newItems);
    setSrcDraggable(null);
    setDstDraggable(null);
  };

  const handleDragStart = ({ source, draggableId }) => {
    const droppableIdx = Number(source.droppableId.at(-1));
    setSrcDraggable({
      row: source.index,
      col: droppableIdx,
      id: draggableId,
    });
    setDstDraggable(null);
  };

  const handleDragUpdate = ({ destination, draggableId }) => {
    console.log(destination);
    if (destination === null) {
      // setDstDraggable(null);
      return;
    }

    const droppableIdx = Number(destination.droppableId.at(-1));
    setDstDraggable({
      row: destination.index,
      col: droppableIdx,
      id: draggableId,
    });
  };

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragUpdate={handleDragUpdate}
    >
      <section className={style.flexContainer}>
        {itemLists.map((itemList, index) => (
          <DroppableWrapper
            key={`droppable-${index}`}
            itemList={itemList}
            droppableIdx={index}
            itemLists={itemLists}
            srcDraggable={srcDraggable}
            dstDraggable={dstDraggable}
            // setDstDraggable={setDstDraggable}
          />
        ))}
      </section>
    </DragDropContext>
  );
}
