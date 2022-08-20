import Background from '../assets/background.png';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useMove from '../hooks/useMove';
import Image from 'next/image';
import { toast } from 'react-toastify';
import useAudio from '../hooks/useAudio';

const countries = ['UK', 'Japan', 'Mexico', 'Italy', 'Australia', 'New Zealand', 'America', 'Taiwan'];

const Main = () => {
  const [text, setText] = useState('');
  const { x, y, handleMouseMove } = useMove();
  const { height, width } = useWindowDimensions();
  const [playing, toggle]: any = useAudio('/music.mp3');

  const yDiff = y - (height * 3) / 4;
  const xDiff = x - width / 2;
  const angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
  const country = countries[Math.floor((180 + angle) / Math.floor(360 / countries.length))];

  const [showPopup, setShowPopup] = useState(false);

  const onSendMessage = (result: boolean) => {
    setShowPopup(false);
    if(result) {
        setText('');
        toast(`Sent message to ${country}`)
    }
  }

  return (
    <>
      <Modal showModal={showPopup} closeModel={onSendMessage} title={`Send message to ${country}`}>
        <textarea onChange={(e) => setText(e.target.value)} value={text} />
      </Modal>
      <div onMouseMove={handleMouseMove} onClick={() => setShowPopup(true)}>
        <Image alt="boat image" src={Background} layout="fill" />
        <div className="absolute z-10 left-1/2 top-1/2 text-black font-bold">
          <div>{country}</div>
        </div>

        <div className="absolute z-10 left-1/2 top-3/4">
          <div style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0% 0%' }}>
            <span className="arrow"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
