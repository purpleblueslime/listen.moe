'use client';
import { Window } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { Howl } from 'howler';

export default function page() {
  const [howl, $howl] = useState(false);
  const [song, $song] = useState(false);
  const [listen, $listen] = useState(false);
  const appWindow = new Window('main');

  useEffect(() => {
    const howl = new Howl({
      src: ['https://listen.moe/stream'],
      html5: true,
    });
    $howl(howl);

    const moeConnect = () => {
      const ws = new WebSocket('wss://listen.moe/gateway_v2');

      ws.onmessage = (event) => {
        const { op, d } = JSON.parse(event.data);

        if (op == 0) {
          setInterval(() => {
            ws.send(JSON.stringify({ op: 9 }));
          }, d.heartbeat);

          return;
        }

        const song = {};

        if (!d) return;

        if (!d.song.albums.length) {
          song.image = '/listenmoe.jpg';
        } else {
          const image = d.song.albums.shift().image;
          if (!image) song.image = '/listenmoe.jpg';
          else song.image = `https://cdn.listen.moe/covers/${image}`;
        }
        const artist = d.song.artists.shift();
        song.artist = artist.nameRomaji || artist.name;
        song.title = d.song.title;

        $song(song);
      };

      ws.onclose = (event) => {
        setTimeout(() => moeConnect(), 5000); // try in 5 secs :3
      };
    };

    moeConnect();
  }, []);

  const mouseDown = async () => {
    await appWindow.startDragging();
  };

  const toggle = () => {
    $listen((listen) => {
      if (listen) {
        howl.unload(); // better than pause ;-; dont ask
        return false;
      }

      howl.load();
      howl.play();
      return true;
    });
  };

  if (!song)
    return (
      <div id='app'>
        <img className='banner' src='/listenmoe.jpg' />
        <div className='moe'>
          <div className='startup'>listen.moe</div>
          <div className='bar' onMouseDown={() => mouseDown()}></div>
        </div>
      </div>
    );

  return (
    <div id='app'>
      <img className='banner' src={song.image} />
      <div className='moe'>
        <div className='box'>
          <div className='cover'>
            <img className='image' src={song.image} />
            <a className={listen ? 'pop' : 'blur'} onClick={toggle}>
              <img className='icon' src={listen ? 'pause.svg' : 'play.svg'} />
            </a>
          </div>
          <div className='about'>
            <div className='title'>{song.title}</div>
            <div className='artist'>{song.artist}</div>
          </div>
        </div>
        <div className='bar' onMouseDown={() => mouseDown()}></div>
      </div>
    </div>
  );
}
