import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DroppableWrapper from './DroppableWrapper';
import { COLUMN_COUNT } from './constant';
import { getLayoutStyles } from './styles';
import { createListsUpToColumnCount, reorder } from './utils';

export default function App() {
  const [itemLists, setItemLists] = useState(
    createListsUpToColumnCount(COLUMN_COUNT, 10),
  );
  const [srcDroppableIdx, setSrcDroppableIdx] = useState(-1);
  const style = getLayoutStyles;

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const { droppableId: startId, index: startRow } = result.source;
      const { droppableId: endId, index: endRow } = result.destination;
      const [startCol, endCol] = [Number(startId.at(-1)), Number(endId.at(-1))];
      const newItems = reorder(
        itemLists,
        [startCol, startRow],
        [endCol, endRow],
      );
      setItemLists(newItems);
    },
    [itemLists],
  );

  const onDragStart = useCallback(({ source }) => {
    const droppableIdx = Number(source.droppableId.at(-1));
    setSrcDroppableIdx(droppableIdx);
  }, []);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <section className={style.flexContainer}>
        {itemLists.map((itemList, index) => (
          <DroppableWrapper
            key={`droppable-${index}`}
            itemList={itemList}
            droppableIdx={index}
            srcDroppableIdx={srcDroppableIdx}
          />
        ))}
      </section>
    </DragDropContext>
  );
}
