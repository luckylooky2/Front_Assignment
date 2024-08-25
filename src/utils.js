// srcDraggable: 이동 후 업데이트할 대상
// dstCol: 드랍 지점 칼럼 인덱스
// dstRow: 드랍 지점 로우 인덱스
const updateRowCol = (srcDraggable, dstCol, dstRow) => {
  let offset = 0;
  for (const elem of srcDraggable) {
    elem.col = dstCol;
    elem.row = dstRow + offset;
    offset++;
  }
};

// candidates: 비교하고자 하는 대상 배열
// referenceSet: 비교 기준 배열
// srcId: 단, 제외할 대상
const countMatchingElements = (candidates, referenceSet, srcId) => {
  return candidates.filter((item) => referenceSet.includes(item) && srcId !== item).length;
};

// lists: 하나의 아이템 배열
// srcIndex: 드래그 시작 인덱스
// dstIndex: 드랍 인덱스
const reorderWithinColumn = (list, srcIndex, dstIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(srcIndex, 1);
  result.splice(dstIndex, 0, removed);
  return result;
};

// itemLists: 전체 아이템 배열
// arrayToMove: 선택 아이템(옮길 아이템) 배열
// srcPoint: 드래그 시작 지점
// dstPoint: 드랍 지점
export const reorder = (itemLists, arrayToMove, srcPoint, dstPoint) => {
  const { col: firstElemCol } = arrayToMove[0];
  const [srcCol, srcRow, srcId] = srcPoint;
  const [dstCol, dstRow] = dstPoint;
  const newItemLists = [...itemLists];
  const isSelected = itemLists[firstElemCol].map(() => false);
  const [removed, from] = [[], []];

  for (const elem of arrayToMove) {
    isSelected[elem.row] = true;
  }

  const oldFrom = itemLists[firstElemCol];

  for (let i = 0; i < oldFrom.length; i++) {
    if (isSelected[i]) {
      removed.push(oldFrom[i]);
    } else {
      from.push(oldFrom[i]);
    }
  }

  if (firstElemCol === dstCol) {
    let excludeCount = 0;
    // 아래 방향
    if (dstRow >= arrayToMove[arrayToMove.length - 1].row) {
      excludeCount = arrayToMove.length - 1;
      // 위 방향
    } else if (dstRow <= arrayToMove[0].row) {
      excludeCount = 0;
      // 중간 방향
    } else {
      const reordered = reorderWithinColumn(itemLists[srcCol], srcRow, dstRow);
      const slicedIdToDst = reordered.slice(0, dstRow + 1).map(({ id }) => getNumberFromId(id));
      const referenceSet = arrayToMove.map(({ id }) => getNumberFromId(id));
      excludeCount = countMatchingElements(slicedIdToDst, referenceSet, srcId);
    }

    from.splice(dstRow - excludeCount, 0, ...removed);
    updateRowCol(arrayToMove, dstCol, dstRow - excludeCount);
  } else {
    const to = [...itemLists[dstCol]];

    to.splice(dstRow, 0, ...removed);
    updateRowCol(arrayToMove, dstCol, dstRow);
    newItemLists[dstCol] = to;
  }
  newItemLists[firstElemCol] = from;

  return newItemLists;
};

// itemLists: 전체 아이템 배열
// srcPoint: 드래그 시작 지점
// dstPoint: 드랍 지점
export const isDraggableIdxValid = (itemLists, srcPoint, dstPoint) => {
  if (srcPoint === null || dstPoint === null) {
    return false;
  }

  const { row: srcRow, col: srcCol } = srcPoint;
  const { row: dstRow, col: dstCol } = dstPoint;

  if (srcRow === dstRow && srcCol === dstCol) {
    return false;
  }

  const upper = srcRow;
  const offset = srcCol === dstCol && srcRow < dstRow ? 1 : 0;
  const lower = dstRow + offset;

  if (itemLists[dstCol][lower] === undefined) {
    return false;
  } else {
    const upperId = getNumberFromId(itemLists[srcCol][upper].id);
    const lowerId = getNumberFromId(itemLists[dstCol][lower].id);

    if (!(upperId % 2) && !(lowerId % 2)) {
      return true;
    }
  }

  return false;
};

// srcPoint: 드래그 시작 지점
// dstPoint: 드랍 지점
// bannedRules: 칼럼 간 이동 금지 규칙 배열
export const isDroppableIdxValid = (srcPoint, dstPoint, bannedRules) => {
  if (srcPoint === null || dstPoint === null) {
    return false;
  }

  const { col: srcCol } = srcPoint;
  const { col: dstCol } = dstPoint;

  for (const [bannedSrc, bannedDst] of bannedRules) {
    if (srcCol === bannedSrc && dstCol === bannedDst) {
      return true;
    }
  }
  return false;
};

export const getNumberFromId = (string) => {
  return Number(string.split('-')[1]);
};

export const sortSrcDraggableByRow = (arr) => {
  return arr.map(([_id, src]) => src).sort((a, b) => a.row - b.row);
};
