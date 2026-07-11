import { useEffect, useState } from 'react';
import './Card.css';

export type Props = {
  onPlaceholderClick: () => void;
  url?: string;
};

export default function Card(props: Props) {
  const [parsedUrl, setParsedUrl] = useState('');

  // handle url
  useEffect(() => {
    let parsedUrl = props.url;

    if (parsedUrl?.slice(0, 3) === 'TV-') {
      parsedUrl = `https://player.twitch.tv/?channel=${parsedUrl.slice(3)}`;
    } else if (parsedUrl?.slice(0, 3) === 'TC-') {
      parsedUrl = `https://www.twitch.tv/embed/${parsedUrl.slice(
        3,
      )}/chat?darkpopout`;
    }

    setParsedUrl(parsedUrl || '');
  }, [props.url]);

  return (
    <div className="Card">
      <div
        className="Card__placeholder"
        onClick={(e) => (e.preventDefault(), props.onPlaceholderClick())}
      />
      {parsedUrl && <iframe className="Card__iframe" src={parsedUrl} />}
    </div>
  );
}
