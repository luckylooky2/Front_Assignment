export const initialSrcDraggableCreator = (arr) => arr.map((v) => [v, { row: v, col: 0, id: `item-${v}` }]);

export const dstDraggableStateCreator = (isValid, invalidMsg = '') => ({
  isValid,
  invalidMsg,
});

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// columnCount: 칼럼 개수
// initCount: 초기 아이템 개수
export const itemListscreator = (columnCount, initCount) => {
  const itemCountsPerColumn = [initCount].concat(Array.from({ length: columnCount - 1 }).fill(0));

  return itemCountsPerColumn.map((count) => getItems(count));
};
