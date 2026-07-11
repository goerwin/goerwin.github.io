'use client';

import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CARD_MODAL_OPTIONS } from '../../_constants';
import {
  encodeCardUrls,
  encodeLayout,
  getLayoutFromUrlQueryParams,
  getQueryParamValue,
} from '../../_helpers/layout';
import type { Layout } from '../../types';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import StaticGrid from '../StaticGrid/StaticGrid';
import './App.css';

const CARD_OPTIONS = [
  { title: 'Add Card', value: CARD_MODAL_OPTIONS.addCard },
  { title: 'Delete Card', value: CARD_MODAL_OPTIONS.deleteCard },
  { title: 'Open Url', value: CARD_MODAL_OPTIONS.url },
  { title: 'Remove Content', value: CARD_MODAL_OPTIONS.removeContent },
  { title: 'Set # of Columns', value: CARD_MODAL_OPTIONS.setCols },
  { title: 'Set # of Rows', value: CARD_MODAL_OPTIONS.setRows },
  { title: 'Set Horizontal Margins', value: CARD_MODAL_OPTIONS.setMarginH },
  { title: 'Set Vertical Margins', value: CARD_MODAL_OPTIONS.setMarginV },
  { title: 'Reset Layout', value: CARD_MODAL_OPTIONS.resetLayout },
];

const TWITCH_OPTIONS = [
  { title: 'Open Stream Video', value: CARD_MODAL_OPTIONS.twitchVideo },
  { title: 'Open Stream Chat', value: CARD_MODAL_OPTIONS.twitchChat },
];

export default function GriderApp() {
  const [marginH, setMarginH] = useState(5);
  const [marginV, setMarginV] = useState(5);
  const [cols, setCols] = useState(12);
  const [rows, setRows] = useState(12);
  const [modal, setModal] = useState(null as React.ReactNode);
  const [layout, setLayout] = useState([] as Layout);
  const mainRef = useRef({ initialLayoutSize: 0 });

  // on mount
  useEffect(() => {
    setMarginH(getQueryParamValue(window.location.search, 'mh') ?? 5);
    setMarginV(getQueryParamValue(window.location.search, 'mv') ?? 5);
    setCols(getQueryParamValue(window.location.search, 'c') ?? 12);
    setRows(getQueryParamValue(window.location.search, 'r') ?? 12);
    setModal(null);

    const initialLayout = getLayoutFromUrlQueryParams(
      window.location.search,
    ) || [{ i: '0', x: 0, y: 0, w: 4, h: 2 }];

    mainRef.current.initialLayoutSize = initialLayout.length;
    setLayout(initialLayout);
  }, []);

  // save layout
  useEffect(() => {
    const url =
      `${window.location.origin}${window.location.pathname}?` +
      `mh=${marginH}&mv=${marginV}&c=${cols}&r=${rows}` +
      `&cardUrls=${encodeCardUrls(layout.map((el) => el.url))}` +
      `&layout=${encodeLayout(layout)}`;

    window.history.pushState(null, document.title, url);
  }, [layout, marginV, marginH, cols, rows]);

  const addCard = () => {
    mainRef.current.initialLayoutSize++;
    setLayout([
      ...layout,
      {
        i: `${mainRef.current.initialLayoutSize}`,
        x: Infinity,
        y: Infinity,
        w: 2,
        h: 2,
      },
    ]);
  };

  const deleteCard = (cardId: string) => {
    setLayout(layout.filter((el) => el.i !== cardId));
  };

  const closeModal = () => {
    setModal(null);
  };

  const setCardUrl = (cardId: string, url?: string) => {
    const twitchData = url?.match(/twitch.tv\/(\w+)/);
    const username = twitchData?.[1];
    let parsedUrl = url;

    if (username) {
      setModal(
        <Modal
          onClose={closeModal}
          optionsModal={{
            options: TWITCH_OPTIONS,
            onOptionSelected: (value) => {
              switch (value) {
                case CARD_MODAL_OPTIONS.twitchChat:
                  parsedUrl = `TC-${username}`;
                  break;
                case CARD_MODAL_OPTIONS.twitchVideo:
                  parsedUrl = `TV-${username}`;
                  break;
                default:
                  break;
              }

              setLayout(
                layout.map((el) =>
                  el.i !== cardId ? el : { ...el, url: parsedUrl },
                ),
              );
              closeModal();
            },
          }}
        />,
      );
    } else {
      setLayout(
        layout.map((el) => (el.i !== cardId ? el : { ...el, url: parsedUrl })),
      );
    }
  };

  const handleUrlSubmit = (cardId: string, url: string) => {
    closeModal();
    setCardUrl(cardId, url);
  };

  const handleColsRowsMargins = (id: string, value?: string) => {
    closeModal();
    switch (id) {
      case CARD_MODAL_OPTIONS.setCols:
        setCols(Number(value));
        break;
      case CARD_MODAL_OPTIONS.setRows:
        setRows(Number(value));
        break;
      case CARD_MODAL_OPTIONS.setMarginH:
        setMarginH(Number(value));
        break;
      case CARD_MODAL_OPTIONS.setMarginV:
        setMarginV(Number(value));
        break;
    }
  };

  const handleOption = (cardId: string, value: string) => {
    switch (value) {
      case CARD_MODAL_OPTIONS.url:
        setModal(
          <Modal
            onClose={closeModal}
            inputModal={{
              onSubmit: (value) => handleUrlSubmit(cardId, value),
              ph: 'Enter the Url',
            }}
          />,
        );
        break;
      case CARD_MODAL_OPTIONS.setCols:
      case CARD_MODAL_OPTIONS.setRows:
      case CARD_MODAL_OPTIONS.setMarginH:
      case CARD_MODAL_OPTIONS.setMarginV:
        setModal(
          <Modal
            onClose={closeModal}
            inputModal={{
              ph: 'Set Value',
              onSubmit: (val) => handleColsRowsMargins(value, val),
            }}
          />,
        );
        break;
      case CARD_MODAL_OPTIONS.addCard:
        addCard();
        closeModal();
        break;
      case CARD_MODAL_OPTIONS.deleteCard:
        deleteCard(cardId);
        closeModal();
        break;
      case CARD_MODAL_OPTIONS.removeContent:
        setCardUrl(cardId);
        closeModal();
        break;
      case CARD_MODAL_OPTIONS.resetLayout:
        window.setTimeout(() => {
          window.location.href = `${window.location.origin}${window.location.pathname}`;
        }, 500);

        toast('Reseting Layout...', { type: 'info' });
        break;
      default:
        break;
    }
  };

  const handleOpenModal = (cardId: string) => {
    setModal(
      <Modal
        onClose={closeModal}
        optionsModal={{
          options: CARD_OPTIONS,
          onOptionSelected: (value) => handleOption(cardId, value),
        }}
      />,
    );
  };

  const handleBoxCreated = (values: {
    x: number;
    y: number;
    w: number;
    h: number;
  }) => {
    mainRef.current.initialLayoutSize++;

    setLayout((layout) => [
      ...layout,
      {
        i: `${mainRef.current.initialLayoutSize}`,
        x: values.x,
        y: values.y,
        w: values.w,
        h: values.h,
      },
    ]);
  };

  const handleItemDrag = (values: { itemId: string; x: number; y: number }) => {
    // for some reason (hooks) I have to do this :(
    setLayout((layout) => {
      const layoutItem = layout.find((el) => el.i === values.itemId);
      return !layoutItem
        ? layout
        : ((layoutItem.x = values.x), (layoutItem.y = values.y), [...layout]);
    });
  };

  const handleItemResize = (values: {
    itemId: string;
    w: number;
    h: number;
  }) => {
    setLayout((layout) => {
      const layoutItem = layout.find((el) => el.i === values.itemId);
      return !layoutItem
        ? layout
        : ((layoutItem.w = values.w), (layoutItem.h = values.h), [...layout]);
    });
  };

  if (!layout || layout.length === 0) {
    return null;
  }

  return (
    <div className="App" style={{ overflow: 'hidden' }}>
      <StaticGrid
        layout={layout}
        marginH={marginH}
        marginV={marginV}
        cols={cols}
        rows={rows}
        onBoxCreated={handleBoxCreated}
        onItemDrag={handleItemDrag}
        onItemResize={handleItemResize}
      >
        {layout.map((item) => (
          <Card
            key={item.i}
            onPlaceholderClick={() => handleOpenModal(item.i)}
            url={item.url}
          />
        ))}
      </StaticGrid>
      {modal}
      <ToastContainer
        position="top-center"
        hideProgressBar
        pauseOnHover={false}
        autoClose={2000}
      />
    </div>
  );
}
