const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export const createItemLists = (columnCount, initCount) => {
  const itemCountsPerColumn = [initCount].concat(Array.from({ length: columnCount - 1 }).fill(0));

  return itemCountsPerColumn.map((count) => getItems(count));
};

const updateRowCol = (srcDraggable, endCol, endRow) => {
  let offset = 0;
  for (const elem of srcDraggable) {
    elem.col = endCol;
    elem.row = endRow + offset;
    offset++;
  }
};

const countElementsBetween2 = (targetArr, arr, currId) => {
  let index = 0;

  for (const num of targetArr) {
    if (arr.includes(num) && currId !== num) {
      index++;
    }
  }

  return index;
};

const reorderWithinColumn = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const reorder = (lists, arrayToMove, srcs, startPoint, endPoint) => {
  const { col: firstCol, row: firstRow } = srcs[0];
  const [startCol, startRow, currId] = startPoint;
  const [endCol, endRow] = endPoint;
  const newLists = [...lists];
  const isSelected = lists[firstCol].map(() => false);
  const [removed, from] = [[], []];

  for (const elem of arrayToMove) {
    isSelected[elem.row] = true;
  }

  const oldFrom = lists[firstCol];

  for (let i = 0; i < oldFrom.length; i++) {
    if (isSelected[i]) {
      removed.push(oldFrom[i]);
    } else {
      from.push(oldFrom[i]);
    }
  }

  if (firstCol === endCol) {
    let count = 0;
    // 아래 방향
    if (endRow >= srcs[srcs.length - 1].row) {
      count = arrayToMove.length - 1;
      // 위 방향
    } else if (endRow <= srcs[0].row) {
      count = 0;
    } else {
      const list = reorderWithinColumn(lists[startCol], currId, endRow);

      count = countElementsBetween2(
        list.slice(0, endRow + 1).map(({ id }) => getNumberFromId(id)),
        arrayToMove.map(({ id }) => getNumberFromId(id)),
        currId,
      );
    }

    from.splice(endRow - count, 0, ...removed);
    updateRowCol(arrayToMove, endCol, endRow - count);
  } else {
    const to = [...lists[endCol]];

    to.splice(endRow, 0, ...removed);
    updateRowCol(arrayToMove, endCol, endRow);
    newLists[endCol] = to;
  }
  newLists[firstCol] = from;

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

export const sortSrcDraggableByRow = (arr) => {
  return arr.map(([_id, src]) => src).sort((a, b) => a.row - b.row);
};

export const initialSrcDraggableGenerator = (arr) => arr.map((v) => [v, { row: v, col: 0, id: `item-${v}` }]);
