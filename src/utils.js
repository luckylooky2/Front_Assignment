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
