import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useMove from '../hooks/useMove';
import { toast } from 'react-toastify';
import useAudio from '../hooks/useAudio';
import { trpc } from '../utils/trpc';
import Button from './Button';
import Image from 'next/image';
import { useSpring, animated } from 'react-spring'
import React from 'react';

const countries = ['United Kingdom', 'Japan', 'Mexico', 'Italy', 'Australia', 'New Zealand', 'America', 'Taiwan'];

const ReceiveMessageComponent = ({ toCountry, fromCountry, isReceiving }: any) => {

  if(!isReceiving) return <span />;

  const receiveMessage = trpc.useQuery(['message.getAll']);
  const message = receiveMessage.data?.filter(m => m.toCountry === toCountry && m.fromCountry === fromCountry)[0]?.text || 'No messages';

  return <span>{message}</span>;
}

const AnimatedBoatComp = () => {
  const styles = useSpring({
    from: { transform: "translateY(0%) rotate(0deg)" },
    to: [
      { transform: "translateY(10%) rotate(10deg)" },
      { transform: "translateY(0%) rotate(0deg)"},
      { transform: "translateY(10%) rotate(-10deg)" },
      { transform: "translateY(0%) rotate(0deg)"},
    ],
    config: { duration: 1000 },
    loop:true
  })

  return <animated.div style={styles}>
    <img alt="boat image" src='/boat.png' width='200px' height='100%' />
  </animated.div>;
}
const AnimatedBoat = React.memo(AnimatedBoatComp);

const Main = () => {

  const createMessage = trpc.useMutation('message.create');

  const [text, setText] = useState('');
  const [myCountry, setMyCountry] = useState('');
  const { x, y, handleMouseMove } = useMove();
  const { height, width } = useWindowDimensions();
  const [playing, toggle]: any = useAudio('/music.mp3');

  const yDiff = y - (height * 3) / 4;
  const xDiff = x - width / 2;
  const angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
  const country = countries[Math.floor((180 + angle) / Math.floor(360 / countries.length))] as string;

  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [showChoicePopup, setShowChoicePopup] = useState(false);
  const [showReceiveMessagePopup, setShowReceiveMessagePopup] = useState(false);

  const fetchMyCountry = async () => {
    if(!myCountry) {
      const response = await fetch('https://ipapi.co/json/');
      const json = await response.json();
      const newCountry = json.country_name;
      if(countries.includes(newCountry)) {
        setMyCountry(json.country_name);
      } else {
        alert('Unsupported country');
      }
    }
  }

  useEffect(() => {
    fetchMyCountry();
  }, []);

  const onSendMessage = async (result: boolean) => {
    setShowMessagePopup(false);
    if(result) {
        await toast.promise(
          () => createMessage.mutateAsync({
            text,
            toCountry: country,
            fromCountry: myCountry
          }),
         {
          pending: `Sending message to ${country}`,
          success: `Sent message to ${country}`,
          error: {
            render({ data }){
              console.log(data);
              return 'Unexpected error';
            }
          }
        },
        {
          autoClose: 1500
        })
        setText('');
    }
  }

  const onSelectSendMessage = () => {
    setShowChoicePopup(false);
    setShowMessagePopup(true);
  }

  const onSelectReceiveMessage = () => {
    setShowChoicePopup(false);
    setShowReceiveMessagePopup(true);
  }

  return (
    <>
      <Modal showModal={showMessagePopup} closeModel={onSendMessage} title={`Send message to ${country}`}>
        <textarea onChange={(e) => setText(e.target.value)} value={text} />
      </Modal>
      <Modal actionButton={{ hide: true }} showModal={showChoicePopup} closeModel={() => setShowChoicePopup(false)} title="Choose option">
        <Button text="Send Message" onClick={onSelectSendMessage} />
        <Button text="Receive Message" onClick={onSelectReceiveMessage} />
      </Modal>
      <Modal actionButton={{ hide: true }} showModal={showReceiveMessagePopup} closeModel={() => setShowReceiveMessagePopup(false)} title={`Receive Message from ${country}`}>
        <ReceiveMessageComponent country={country} isReceiving={showReceiveMessagePopup} />
      </Modal>
      <div onMouseMove={handleMouseMove}>
        <img alt="background image" src='/background.png' style={{ width: '100vw', height: '100vh' }} onClick={() => setShowChoicePopup(true)}/>

        <div className="absolute z-10 left-1/2 top-1/2">
          <AnimatedBoat />
        </div>

        <div className="absolute z-10 text-black font-bold right-10 top-5">
          <div>Sending from {myCountry}</div>
        </div>

        <div className="absolute z-10 left-1/2 top-1/2 text-black font-bold">
          <div>{country}</div>
        </div>

        <div className="absolute z-10 left-1/2 top-3/4">
          <div style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0% 0%' }}>
            <span className="arrow"></span>
          </div>
        </div>

        <div className="absolute z-11 right-20 bottom-10 text-black font-bold">
          <Button text="Toggle Music" onClick={() => toggle()} />
        </div>
      </div>
    </>
  );
};

export default Main;
