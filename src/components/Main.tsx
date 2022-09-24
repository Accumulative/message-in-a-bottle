import { memo, useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useMove from '../hooks/useMove';
import { toast } from 'react-toastify';
import useAudio from '../hooks/useAudio';
import { trpc } from '../utils/trpc';
import Button from './Button';
import { useSpring, animated } from 'react-spring';
import React from 'react';

const countries = ['United Kingdom', 'Japan', 'Mexico', 'Italy', 'Australia', 'New Zealand', 'America', 'Taiwan'];

const ReceiveMessageComponent = ({ toCountry, fromCountry, isReceiving }: any) => {
  if (!isReceiving) return <span />;

  const receiveMessage = trpc.useQuery(['message.getAll']);
  // doesn't matter which country the message is from
  const message =
    receiveMessage.data?.filter((m) => m.toCountry === toCountry /* && m.fromCountry === fromCountry */)[0]?.text ||
    'No messages';

  return <span>{message}</span>;
};

const AnimatedBoatComp = () => {
  const styles = useSpring({
    from: { transform: 'translateY(0%) rotate(4deg)' },
    to: [
      { transform: 'translateY(8%) rotate(8deg)' },
      { transform: 'translateY(0%) rotate(4deg)' },
      { transform: 'translateY(8%) rotate(0deg)' },
      { transform: 'translateY(0%) rotate(4deg)' },
    ],
    config: { duration: 2000 },
    loop: true,
  });

  return (
    <animated.div style={styles}>
      <img alt="boat image" src="/boat.png" width="300px" height="100%" />
    </animated.div>
  );
};
const AnimatedBoat = React.memo(AnimatedBoatComp);

const Main = () => {
  const createMessage = trpc.useMutation('message.create');

  const [text, setText] = useState('');
  const [myCountry, setMyCountry] = useState('');
  const [country, setCountry] = useState('');
  // const { x, y, handleMouseMove } = useMove();
  // const { height, width } = useWindowDimensions();
  const [playing, toggle]: any = useAudio('/music.mp3');
  const [playing2, toggle2]: any = useAudio('/waves.mp3');

  // const yDiff = y - (height * 3) / 4;
  // const xDiff = x - width / 2;
  // const angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
  // const countryIndex = Math.floor((180 + angle) / Math.floor(360 / countries.length));
  // const country = countries[countryIndex] as string;

  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [showChoicePopup, setShowChoicePopup] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReceiveMessagePopup, setShowReceiveMessagePopup] = useState(false);

  const CountryArrow = (props: any) => {
    const { name, rotation } = props;
    const x = Math.round(60 * Math.cos(rotation));
    const y = Math.round(60 * Math.sin(rotation));

    return (
      <div onMouseOver={() => setCountry(name)} onMouseOut={() => setCountry('')} onClick={() => setShowMessagePopup(true)}>
        <div style={{ transform: `rotate(${rotation}deg) translate(18em) rotate(-${rotation}deg)` }}>
          <div
            className='font-fipps'
            style={{
              transform: `rotate(${rotation + 90}deg)`,
              opacity: country === name ? '100%' : '40%'
            }}>
            <div
              style={{
                width: 0,
                height: 0,
                left: 18,
                top: 13,
                border: 'solid 40px',
                borderColor: 'transparent transparent black transparent',
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                border: 'solid 30px',
                borderColor: 'transparent transparent white transparent',
              }}
            />
          </div>
        </div>
        {/* <div
          style={{ transform: `rotate(${rotation}deg) translate(20em) rotate(-${rotation}deg)` }}
          className="font-extrabold text-lg"
        >
          <span>{name}</span>
        </div> */}
      </div>
    );
  };

  const fetchMyCountry = async () => {
    if (!myCountry) {
      const response = await fetch('https://ipapi.co/json/');
      const json = await response.json();
      const newCountry = json.country_name;
      if (countries.includes(newCountry)) {
        setMyCountry(json.country_name);
      } else {
        alert('Unsupported country');
      }
    }
  };

  useEffect(() => {
    fetchMyCountry();
  }, []);

  const onSendMessage = async (result: boolean) => {
    if (result) {
      try {
        await toast.promise(
          () =>
            createMessage.mutateAsync({
              text,
              toCountry: country,
              fromCountry: myCountry,
            }),
          {
            pending: `Sending message to ${country}`,
            success: `Sent message to ${country}`,
            error: {
              render({ data }) {
                let errorMessage = 'Unexpected error';
                try {
                  errorMessage = JSON.parse(data.shape.message)[0].message;
                } catch(e) {
                  console.error(data);
                }
                setErrorMessage(errorMessage);
                return errorMessage;
              },
            },
          },
          {
            autoClose: 1500,
          },
        );
        setShowMessagePopup(false);
        setErrorMessage('');
        setShowSendMessage(false);
        setText('');
      } catch(e) {

      }
    } else {
        setShowMessagePopup(false);
    }
  };

  const onSelectSendMessage = () => {
    setShowChoicePopup(false);
    setShowSendMessage(true);
  };

  const onSelectReceiveMessage = () => {
    setShowChoicePopup(false);
    setShowReceiveMessagePopup(true);
  };

  const onSelectBackground = () => {
    if (showSendMessage) {
      setShowMessagePopup(true);
    } else {
      setShowChoicePopup(true);
    }
  };

  // eslint-disable-next-line react/display-name
  const Arrows = memo(() => {
    return <div className="circle-container -translate-y-3/4">
        {countries.map((c, i) => (
          <CountryArrow key={c} name={c} rotation={i * 45 + 225} />
        ))}
      </div>;
  });

  return (
    <>
      <Modal showModal={showMessagePopup} closeModel={onSendMessage} title={`Send message to ${country}`}>
        <div className='flex flex-col'>
          {errorMessage && <span className='text-red-500'>{errorMessage}</span>}
          <h3 className='text-xl font-bold m-5'>Message</h3>
          <textarea onChange={(e) => setText(e.target.value)} value={text} />
        </div>
      </Modal>
      <Modal
        actionButton={{ hide: true }}
        showModal={showChoicePopup}
        closeModel={() => setShowChoicePopup(false)}
        title="Choose option"
      >
        <Button onClick={onSelectSendMessage}>Send Message</Button>
        <Button onClick={onSelectReceiveMessage}>Receive Message</Button>
      </Modal>
      <Modal
        actionButton={{ hide: true }}
        showModal={showReceiveMessagePopup}
        closeModel={() => setShowReceiveMessagePopup(false)}
        title={`Received bottle from ${country}`}
      >
        <ReceiveMessageComponent toCountry={country} isReceiving={showReceiveMessagePopup} />
      </Modal>
      <div>
        <img
          alt="ocean image"
          src="/ocean.png"
          className="absolute top-0 w-screen h-screen"
          onClick={() => onSelectBackground()}
        />
        <img
          alt="sky image"
          src="/sky.png"
          className="absolute top-0 w-screen h-screen"
          onClick={() => onSelectBackground()}
        />

        {!showSendMessage && (
          <div className="absolute z-10 left-1/2 top-1/4 -translate-x-1/2 text-2xl font-bold">
            Click anywhere to start
          </div>
        )}

        {showSendMessage && (
          <>
            <div className="absolute z-10 left-1/2 top-1/4 -translate-x-1/2 text-black font-bold text-5xl font-fipps">
              <div>{country}</div>
            </div>

            {/* <div className="absolute z-10 left-1/2 top-3/4">
              <div style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0% 0%' }}>
                <span className="arrow"></span>
              </div>
            </div> */}

            <div className="absolute z-11 right-20 bottom-36 text-black font-bold">
              <Button isCancel onClick={() => setShowSendMessage(false)}>Cancel send</Button>
            </div>
          </>
        )}

        <div className="absolute z-10 left-1/2 -translate-x-1/2 top-1/2">
          <AnimatedBoat />
          {showSendMessage && (<Arrows />)}
        </div>

        <div className="absolute z-10 text-black font-bold right-10 top-5">
          <div>Sending from {myCountry}</div>
        </div>

        <div className="absolute z-11 right-20 bottom-24 text-black font-bold">
          <Button onClick={() => toggle()}>Toggle Music</Button>
        </div>

        <div className="absolute z-11 right-20 bottom-12 text-black font-bold">
          <Button onClick={() => toggle2()}>Toggle Ambience</Button>
        </div>
      </div>
    </>
  );
};

export default Main;
