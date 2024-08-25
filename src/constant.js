import { initialSrcDraggableCreator } from './creator';

export const COLUMN_COUNT = 4;
export const INITIAL_ITEM_COUNT = 10;
export const BANNED_COLUMN_MOVING_RULES = [[0, 2]];
export const GRID = 8;
export const INITIAL_SRC_DRAGGABLE = initialSrcDraggableCreator([1, 2, 3]);
