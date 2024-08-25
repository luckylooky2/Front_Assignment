/**
 * 이동한 아이템 배열의 row와 column을 최신으로 업데이트한다.
 * @param {Array} srcDraggable 이동한 아이템 배열
 * @param {Number} dstCol 드롭 지점 column 인덱스
 * @param {Number} dstRow 드롭 지점 row 인덱스
 */
const updateRowCol = (srcDraggable, dstCol, dstRow) => {
  let offset = 0;
  for (const elem of srcDraggable) {
    elem.col = dstCol;
    elem.row = dstRow + offset;
    offset++;
  }
};

/**
 * 기준 배열에 존재하는 후보 배열의 요소만 필터링한다.
 * @param {Array} candidates 비교하고자 하는 대상 배열
 * @param {Array} referenceSet 비교가 되는 기준 배열
 * @param {Number} srcId 비교에서 제외할 대상
 * @returns {Array} 비교되어 필터링된 candidates
 */
const countMatchingElements = (candidates, referenceSet, srcId) => {
  return candidates.filter((item) => referenceSet.includes(item) && srcId !== item).length;
};

/**
 * 드래그 후의 업데이트한 아이템 1차원 배열의 복사본을 반환한다.
 * @param {Array} list 아이템 1차원 배열
 * @param {Number} srcIndex 드래그 시작 row 인덱스
 * @param {Number} dstIndex 드롭 row 인덱스
 * @returns {Array} 순서가 변경된 아이템 1차원 배열
 */
const reorderWithinColumn = (list, srcIndex, dstIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(srcIndex, 1);
  result.splice(dstIndex, 0, removed);
  return result;
};

/**
 * 드래그 후의 업데이트한 아이템 2차원 배열의 복사본을 반환한다.
 * @param {Array} itemLists 아이템 2차원 배열
 * @param {Array} arrayToMove 이동할 아이템 배열
 * @param {Array} srcPoint 드래그 시작 지점(column, row)
 * @param {Array} dstPoint 드롭 지점(column, row)
 * @returns {Array} 순서가 변경된 아이템 2차원 배열
 */
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

/**
 * 드롭 지점의 row로 이동이 가능한지 여부를 판단한다.
 * @param {Array} itemLists 아이템 2차원 배열
 * @param {Object} srcLastPoint 드래그한 아이템 중 가장 마지막 아이템의 지점
 * @param {Object} dstPoint 드롭 지점
 * @returns {boolean} 드롭 지점의 row에 이동이 가능한지 여부
 */
export const isDraggableIdxValid = (itemLists, srcLastPoint, dstPoint) => {
  if (srcLastPoint === null || dstPoint === null) {
    return false;
  }

  const { row: srcRow, col: srcCol } = srcLastPoint;
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

/**
 * 드롭 지점의 column으로 이동이 가능한지 여부를 판단한다.
 * @param {Object} srcPoint 드래그 시작 지점
 * @param {Object} dstPoint 드롭 지점
 * @param {Array} bannedRules column 간 이동 금지 규칙 배열
 * @returns {boolean} 드롭 지점의 column으로 이동이 가능한지 여부
 */
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

/**
 * 아이템의 Id의 가장 끝 숫자를 파싱한다.
 * @param {String} itemId 아이템의 Id
 * @returns {Number} Id의 가장 끝 숫자
 */
export const getNumberFromId = (itemId) => {
  return Number(itemId.split('-')[1]);
};

/**
 * 드래그한 아이템 배열을 row 기준 오름차순으로 정렬한다.
 * @param {Array} arr 드래그한 아이템 배열
 * @returns {Array} row 기준 오름차순으로 정렬된 아이템 배열
 */
export const sortSrcDraggableByRow = (arr) => {
  return arr.map(([_id, src]) => src).sort((a, b) => a.row - b.row);
};
