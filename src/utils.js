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

export const isDraggableIdxValid = (src, dst, itemLists) => {
  if (src === null || dst === null) {
    return false;
  }

  if (src.row === dst.row && src.col === dst.col) {
    return false;
  }

  const upper = src.row;
  const offset = src.col === dst.col && src.row < dst.row ? 1 : 0;
  const lower = dst.row + offset;

  if (itemLists[dst.col][lower] === undefined) {
    return false;
  } else {
    const upperId = Number(itemLists[src.col][upper].id.at(-1));
    const lowerId = Number(itemLists[dst.col][lower].id.at(-1));

    if (!(upperId % 2) && !(lowerId % 2)) {
      return true;
    }
  }

  return false;
};

export const isDroppableIdxValid = (src, dst, bannedRules) => {
  if (src === null || dst === null) {
    return false;
  }

  for (const [bannedSrc, bannedDst] of bannedRules) {
    if (src.col === bannedSrc && dst.col === bannedDst) {
      return true;
    }
  }
  return false;
};

export const dstDraggableStateCreator = (isValid, invalidMsg = '') => ({
  isValid,
  invalidMsg,
});
