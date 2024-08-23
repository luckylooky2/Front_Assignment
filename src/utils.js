const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export const createListsUpToColumnCount = (columnCount, initCount) => {
  const itemCountsPerColumn = [initCount].concat(
    Array.from({ length: columnCount - 1 }).fill(0),
  );

  return itemCountsPerColumn.map((count) => getItems(count));
};

export const reorder = (lists, startPoint, endPoint) => {
  const [startCol, startRow] = startPoint;
  const [endCol, endRow] = endPoint;
  const newLists = [...lists];
  const from = [...lists[startCol]];
  const [removed] = from.splice(startRow, 1);

  if (startCol === endCol) {
    from.splice(endRow, 0, removed);
  } else {
    const to = [...lists[endCol]];
    to.splice(endRow, 0, removed);
    newLists[endCol] = to;
  }
  newLists[startCol] = from;
  return newLists;
};

export const isDraggableIdxValid = (srcDraggable, dstDraggable, itemLists) => {
  if (srcDraggable === null || dstDraggable === null) {
    return false;
  }

  if (
    srcDraggable.row === dstDraggable.row &&
    srcDraggable.col === dstDraggable.col
  ) {
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

  // 현재 옮기려는 것이 아니라 하나라도 짝수 위의 짝수가 있으면 true 리턴?
  if (newItemList.length > 1 && dstDraggable.row < newItemList.length - 1) {
    const first = dstDraggable.row;
    const second = first + 1;
    const upper = Number(newItemList[first].at(-1));
    const lower = Number(newItemList[second].at(-1));

    if (!(upper % 2) && !(lower % 2)) {
      return true;
    }
  }

  return false;
};

export const isDroppableIdxValid = (
  srcDraggable,
  dstDraggable,
  bannedMovingColumnRules,
) => {
  if (srcDraggable === null || dstDraggable === null) {
    return false;
  }

  for (const [bannedSrc, bannedDst] of bannedMovingColumnRules) {
    if (srcDraggable.col === bannedSrc && dstDraggable.col === bannedDst) {
      return true;
    }
  }
  return false;
};

export const dstDraggableStateCreator = (isValid, invalidMsg = '') => ({
  isValid,
  invalidMsg,
});
