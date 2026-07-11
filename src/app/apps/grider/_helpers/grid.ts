export function getGridDimensions(
  containerDim: number,
  colsOrRows: number,
  margin = 0,
) {
  const totalMargin = (colsOrRows + 1) * margin;
  const newContainerDim = containerDim - totalMargin;
  const dimension = Math.floor(newContainerDim / colsOrRows);

  return {
    dimension,
    gap:
      newContainerDim % colsOrRows !== 0
        ? newContainerDim - dimension * colsOrRows
        : 0,
  };
}

function getGridItemDimensionOffset(
  itemPos: number,
  itemSize: number,
  gap: number,
) {
  return itemSize + itemPos < gap
    ? itemSize
    : itemPos < gap
      ? gap - itemPos
      : 0;
}

export function getGridItemPosDim(
  itemPos: number,
  itemDimension: number,
  itemSize: number,
  gap: number,
  margin = 0,
) {
  const posOffset = itemPos < gap ? itemPos : gap;
  const dimOffset = getGridItemDimensionOffset(itemPos, itemSize, gap);

  return {
    dim: (itemDimension + margin) * itemSize - margin + dimOffset,
    pos: itemDimension * itemPos + margin * itemPos + margin + posOffset,
  };
}
