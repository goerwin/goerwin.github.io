import { useEffect, useRef, useState } from 'react';
import { getGridDimensions, getGridItemPosDim } from '../../_helpers/grid';
import './StaticGrid.css';

type Position = { x: number; y: number };
type Size = { w: number; h: number };

type LayoutItem = { i: string; x: number; y: number; w: number; h: number };
type Layout = LayoutItem[];

export type Props = {
  cols: number;
  rows: number;
  children: JSX.Element[];
  layout?: Layout;
  marginH?: number;
  marginV?: number;
  onItemDrag?: (values: { itemId: string; x: number; y: number }) => void;
  onItemResize?: (values: { itemId: string; w: number; h: number }) => void;
  onBoxCreated?: (values: {
    x: number;
    y: number;
    w: number;
    h: number;
  }) => void;
};

type Main = {
  itemW: number;
  itemH: number;
  isMousedown: boolean;
  matrix: number[][];
  start: Position;
  absoluteStart: Position;
  drag?: {
    itemEl: HTMLElement;
    item: LayoutItem;
    origX: number;
    origY: number;
    startX: number;
    startY: number;
  };
  resize?: {
    itemEl: HTMLElement;
    item: LayoutItem;
    origW: number;
    origH: number;
    startX: number;
    startY: number;
  };
  layout?: Layout;
  marginH: number;
  marginV: number;
  cols: number;
  rows: number;
  widthGap: number;
  heightGap: number;
  absoluteSize: Size;
};

const bgColors = [
  '#800000',
  '#fabebe',
  '#3cb44b',
  '#4363d8',
  '#911eb4',
  '#a9a9a9',
  '#aaffc3',
  '#9A6324',
  '#808000',
  '#e6beff',
];

export default function StaticGrid(props: Props) {
  const newCols = props.cols;
  const newRows = props.rows;
  const containerRef = useRef(null);
  const mainRef = useRef({
    matrix: new Array(newRows).fill(new Array(newCols).fill(0)),
  } as Main);
  const [_update, setUpdate] = useState(false);
  const [children, setChildren] = useState([] as JSX.Element[]);
  const matrix = mainRef.current.matrix;
  const widthGap = mainRef.current.widthGap;
  const heightGap = mainRef.current.heightGap;
  const { itemW, itemH } = mainRef.current;

  mainRef.current.marginH = props.marginH ?? 0;
  mainRef.current.marginV = props.marginV ?? 0;
  mainRef.current.cols = props.cols;
  mainRef.current.rows = props.rows;
  mainRef.current.layout = props.layout;

  const getCleanMatrix = () => {
    return mainRef.current.matrix.map((el) => el.map(() => 0));
  };

  const setGridDimensions = () => {
    const containerEl = containerRef.current as HTMLElement | null;
    const clientWidth = containerEl?.clientWidth;
    const clientHeight = containerEl?.clientHeight;
    const { marginH, marginV, cols, rows } = props;

    if (!clientWidth || !clientHeight) return;

    const { dimension: width, gap: widthGap } = getGridDimensions(
      clientWidth,
      cols,
      marginH,
    );
    mainRef.current.widthGap = widthGap;
    mainRef.current.itemW = width;

    const { dimension: height, gap: heightGap } = getGridDimensions(
      clientHeight,
      rows,
      marginV,
    );
    mainRef.current.heightGap = heightGap;
    mainRef.current.itemH = height;

    setUpdate((update) => !update);
  };

  useEffect(() => {
    setGridDimensions();
  }, [setGridDimensions]);

  // ItemDragger handlers
  useEffect(() => {
    const containerEl = containerRef.current as HTMLElement | null;
    const IS_DRAGGING = 'is-dragging';

    const handleItemDraggerMouseDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const itemEl = el.parentElement;

      if (!itemEl) return;

      if (!el.classList.contains('StaticGrid__item__dragger')) return;

      itemEl.classList.add(IS_DRAGGING);
      e.stopPropagation();

      const itemId = el.dataset.id;

      if (!itemId) return;

      const item = mainRef.current.layout?.find((el) => el.i === itemId);

      if (!item) return;

      mainRef.current.drag = {
        itemEl,
        item,
        origX: item.x,
        origY: item.y,
        startX: e.clientX,
        startY: e.clientY,
      };
    };

    const handleItemDraggerMouseUp = (e: MouseEvent) => {
      if (!mainRef.current.drag) return;

      mainRef.current.drag.itemEl.classList.remove(IS_DRAGGING);
      mainRef.current.drag = undefined;

      e.stopPropagation();
    };

    const handleItemDraggerMouseMove = (e: MouseEvent) => {
      if (!mainRef.current.drag) return;

      e.stopPropagation();
      const { itemW, itemH, marginH, marginV } = mainRef.current;

      const {
        item,
        startX,
        startY,
        origX: originalX,
        origY: originalY,
      } = mainRef.current.drag;
      let newPositionX =
        Math.floor((e.clientX - startX) / (itemW + marginH)) + originalX;
      let newPositionY =
        Math.floor((e.clientY - startY) / (itemH + marginV)) + originalY;

      if (newPositionX < 0) newPositionX = 0;
      else if (newPositionX + item.w > newCols) newPositionX = newCols - item.w;

      if (newPositionY < 0) newPositionY = 0;
      else if (newPositionY + item.h > newRows) newPositionY = newRows - item.h;

      props.onItemDrag?.({
        itemId: item.i,
        x: newPositionX,
        y: newPositionY,
      });
    };

    containerEl?.addEventListener('mousedown', handleItemDraggerMouseDown);
    containerEl?.addEventListener('mousemove', handleItemDraggerMouseMove);
    containerEl?.addEventListener('mouseup', handleItemDraggerMouseUp);

    return () => {
      containerEl?.removeEventListener('mousedown', handleItemDraggerMouseDown);
      containerEl?.removeEventListener('mousemove', handleItemDraggerMouseMove);
      containerEl?.removeEventListener('mouseup', handleItemDraggerMouseUp);
    };
  }, [newRows, props.onItemDrag, newCols]);

  // ItemResizer handlers
  useEffect(() => {
    const containerEl = containerRef.current as HTMLElement | null;
    const IS_RESIZING = 'is-resizing';

    const handleItemResizerMouseDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const itemEl = el.parentElement;

      if (!itemEl) return;

      if (!el.classList.contains('StaticGrid__item__resizer')) return;

      itemEl.classList.add(IS_RESIZING);

      e.stopPropagation();

      const itemId = el.dataset.id;

      if (!itemId) return;

      const item = mainRef.current.layout?.find((el) => el.i === itemId);

      if (!item) return;

      mainRef.current.resize = {
        itemEl,
        item,
        origW: item.w,
        origH: item.h,
        startX: e.clientX,
        startY: e.clientY,
      };
    };

    const handleItemResizerMouseUp = (e: MouseEvent) => {
      if (!mainRef.current.resize) return;

      mainRef.current.resize.itemEl.classList.remove(IS_RESIZING);
      mainRef.current.resize = undefined;

      e.stopPropagation();
    };

    const handleItemResizerMouseMove = (e: MouseEvent) => {
      if (!mainRef.current.resize) return;

      e.stopPropagation();

      const { itemW, itemH, marginH, marginV, cols, rows } = mainRef.current;
      const {
        item,
        startX,
        startY,
        origW: originalW,
        origH: originalH,
      } = mainRef.current.resize;
      const newWidth =
        Math.ceil((e.clientX - startX) / (itemW + marginH)) + originalW;
      const newHeight =
        Math.ceil((e.clientY - startY) / (itemH + marginV)) + originalH;

      if (
        newWidth <= 0 ||
        newHeight <= 0 ||
        newWidth + item.x > cols ||
        newHeight + item.y > rows
      )
        return;

      props.onItemResize?.({ itemId: item.i, w: newWidth, h: newHeight });
    };

    containerEl?.addEventListener('mousedown', handleItemResizerMouseDown);
    containerEl?.addEventListener('mousemove', handleItemResizerMouseMove);
    containerEl?.addEventListener('mouseup', handleItemResizerMouseUp);

    return () => {
      containerEl?.removeEventListener('mousedown', handleItemResizerMouseDown);
      containerEl?.removeEventListener('mousemove', handleItemResizerMouseMove);
      containerEl?.removeEventListener('mouseup', handleItemResizerMouseUp);
    };
  }, [props.onItemResize]);

  // GridItem handlers
  useEffect(() => {
    const containerEl = containerRef.current as HTMLElement | null;

    const handleMouseUp = () => {
      mainRef.current.isMousedown = false;
      mainRef.current.matrix = getCleanMatrix();

      if (
        !mainRef.current.absoluteSize ||
        (mainRef.current.absoluteSize.w === 0 &&
          mainRef.current.absoluteSize.h === 0)
      ) {
        return;
      }

      props.onBoxCreated?.({
        ...mainRef.current.absoluteStart,
        ...mainRef.current.absoluteSize,
      });

      mainRef.current.absoluteStart = { x: 0, y: 0 };
      mainRef.current.absoluteSize = { w: 0, h: 0 };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.StaticGrid__item')) return;

      mainRef.current.isMousedown = true;
      mainRef.current.absoluteStart = { x: 0, y: 0 };
      mainRef.current.absoluteSize = { w: 0, h: 0 };

      mainRef.current.start = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mainRef.current.isMousedown) return;

      const { itemW, itemH, marginH, marginV } = mainRef.current;

      const startX = Math.floor(mainRef.current.start.x / (itemW + marginH));
      const startY = Math.floor(mainRef.current.start.y / (itemH + marginV));
      const endX = Math.floor(e.clientX / (itemW + marginH));
      const endY = Math.floor(e.clientY / (itemH + marginV));

      const rowsSelected =
        endY >= startY ? endY - startY + 1 : endY - startY - 1;
      const colsSelected =
        endX >= startX ? endX - startX + 1 : endX - startX - 1;
      const newMatrix = getCleanMatrix();
      let i = 0;
      let absCols = 0;
      let absRows = 0;

      do {
        const rowSelected =
          startY + i < newRows && startY + i >= 0
            ? (absRows++, startY + i)
            : startY + i >= 0
              ? newRows - 1
              : 0;

        rowsSelected > 0 ? i++ : i--;

        let j = 0;
        absCols = 0;
        do {
          const colSelected =
            startX + j < newCols && startX + j >= 0
              ? (absCols++, startX + j)
              : startX + j >= 0
                ? newCols - 1
                : 0;

          const matrixRow = newMatrix[rowSelected];

          if (!matrixRow) throw new Error('No Matrix row found!');
          matrixRow[colSelected] = 1;

          // newMatrix[rowSelected][colSelected] = 1;
          colsSelected > 0 ? j++ : j--;
        } while (j !== colsSelected);
      } while (i !== rowsSelected);

      mainRef.current.absoluteStart = newMatrix.reduce(
        (prev: Position, curr, idx) => {
          if (prev.x !== -1) {
            return prev;
          }

          if (curr.findIndex((el) => el !== 0) >= 0) {
            prev.x = curr.findIndex((el) => el !== 0);
            prev.y = idx;
          }

          return prev;
        },
        { x: -1, y: -1 },
      );

      mainRef.current.absoluteSize = { w: absCols, h: absRows };
      mainRef.current.matrix = newMatrix;
      setUpdate((update) => !update);
    };

    containerEl?.addEventListener('mousedown', handleMouseDown);
    containerEl?.addEventListener('mousemove', handleMouseMove);
    containerEl?.addEventListener('mouseup', handleMouseUp);

    return () => {
      containerEl?.removeEventListener('mousedown', handleMouseDown);
      containerEl?.removeEventListener('mousemove', handleMouseMove);
      containerEl?.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // Resize window handler
  useEffect(() => {
    setGridDimensions();

    window.addEventListener('resize', setGridDimensions);

    return () => {
      window.removeEventListener('resize', setGridDimensions);
    };
  }, [setGridDimensions]);

  // set children
  useEffect(() => {
    setChildren(
      props.children.map((el, idx) => {
        const layoutItem = props.layout?.find(
          (layoutItem) => layoutItem.i === el.key,
        );

        if (!layoutItem) throw new Error('No layout found');

        const { widthGap, heightGap, itemW, itemH, marginH, marginV } =
          mainRef.current;
        const elementX = getGridItemPosDim(
          layoutItem.x,
          itemW,
          layoutItem.w,
          widthGap,
          marginH,
        );
        const elementY = getGridItemPosDim(
          layoutItem.y,
          itemH,
          layoutItem.h,
          heightGap,
          marginV,
        );

        return (
          <div
            className="StaticGrid__item"
            style={{
              backgroundColor: bgColors[idx % bgColors.length],
              top: elementY.pos,
              left: elementX.pos,
              width: elementX.dim,
              height: elementY.dim,
            }}
            key={el.key}
          >
            {el}
            <div
              data-id={el.key}
              className="StaticGrid__item__dragger js-item-dragger"
            />
            <div
              data-id={el.key}
              className="StaticGrid__item__resizer js-item-resizer"
            />
          </div>
        );
      }),
    );
    // TODO: DO I NEED TO CHECK FOR THE PROPS? ISN'T THIS AUTOMATIC?
  }, [props.layout, props.children]);

  return (
    <div className="StaticGrid" ref={containerRef}>
      {itemW &&
        itemH &&
        matrix.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i},${j}`}
              className="StaticGrid__ph"
              style={{
                marginLeft: props.marginH,
                marginTop: props.marginV,
                width: getGridItemPosDim(j, itemW, 1, widthGap, props.marginH)
                  .dim,
                height: getGridItemPosDim(i, itemH, 1, heightGap, props.marginV)
                  .dim,
                background: cell === 1 ? 'rgba(255, 255, 255, 0.3)' : '',
              }}
            />
          )),
        )}
      {children}
    </div>
  );
}
