/**
 * 아이템 객체 배열을 생성한다.
 * @param {Number} count 생성할 아이템 객체의 개수
 * @returns {Array} 아이템 객체 배열
 */
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

/**
 * 현재 선택된 아이템의 초기 상태값 배열을 생성한다.
 * @param {Array} arr 선택하고 싶은 0번 column의 row 배열
 * @returns {Array} 현재 선택된 아이템의 초기 상태값 배열
 */
export const initialSrcDraggableCreator = (arr) => arr.map((v) => [v, { row: v, col: 0, id: `item-${v}` }]);

/**
 * 드롭 가능 여부 상태 객체를 생성한다.
 * @param {Boolean} isValid 드롭 위치에 드롭이 가능한지 여부
 * @param {String} invalidMsg 드롭이 불가능할 떄의 알림 메시지
 * @returns {Object} 드롭 가능 여부 상태 객체
 */
export const dstDraggableStateCreator = (isValid, invalidMsg = '') => ({
  isValid,
  invalidMsg,
});

/**
 * 아이템의 2차원 배열에서의 위치 객체를 생성한다.
 * @param {Number} col 아이템 2차원 배열에서의 column
 * @param {Number} row 아이템 2차원 배열에서의 row
 * @param {String} id 아이템의 id
 * @returns {Object} 아이템의 2차원 배열에서의 위치 객체
 */
export const draggableCreator = (col, row, id) => ({ col: col, row: row, id: id });

/**
 * column의 개수와 초기 아이템 개수를 인자로 받아 아이템 2차원 배열을 생성한다.
 * @param {Number} columnCount 아이템 1차원 배열(column)의 개수
 * @param {Number} initCount 초기 아이템의 개수
 * @returns {Array} 아이템 2차원 배열
 */
export const itemListscreator = (columnCount, initCount) => {
  const itemCountsPerColumn = [initCount].concat(Array.from({ length: columnCount - 1 }).fill(0));

  return itemCountsPerColumn.map((count) => getItems(count));
};
