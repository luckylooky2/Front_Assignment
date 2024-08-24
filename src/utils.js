const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export const createItemLists = (columnCount, initCount) => {
  const itemCountsPerColumn = [initCount].concat(
    Array.from({ length: columnCount - 1 }).fill(0),
  );

  return itemCountsPerColumn.map((count) => getItems(count));
};

export const reorder = (lists, arrayToMove, endPoint) => {
  const { col: startCol } = arrayToMove[0];
  const [endCol, endRow] = endPoint;
  const newLists = [...lists];
  const isSelected = lists[startCol].map(() => false);
  const [removed, from] = [[], []];

  for (const elem of arrayToMove) {
    isSelected[elem.row] = true;
  }

  // console.log(from);

  const oldFrom = lists[startCol];
  for (let i = 0; i < oldFrom.length; i++) {
    if (isSelected[i]) {
      removed.push(oldFrom[i]);
    } else {
      from.push(oldFrom[i]);
    }
  }

  // console.log(removed, from);

  if (startCol === endCol) {
    from.splice(endRow, 0, ...removed);
  } else {
    const to = [...lists[endCol]];
    to.splice(endRow, 0, ...removed);
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
    const upperId = getNumberFromId(itemLists[src.col][upper].id);
    const lowerId = getNumberFromId(itemLists[dst.col][lower].id);

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

export const getNumberFromId = (string) => {
  return Number(string.split('-')[1]);
};
