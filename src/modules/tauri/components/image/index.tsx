import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'antd';
import { listen } from '@tauri-apps/api/event';
const TauriImage = () => {
  const [img, setImg] = useState<string>('');
  useEffect(() => {
    let unListen: any;
    (async () => {
      unListen = listen('file-selected-content', (event) => {
        // console.log('file-selected', event.payload);
        const base64Image = event.payload;
        setImg(`data:image/png;base64,${base64Image}`);

        console.log(base64Image);
        // // Tạo một thẻ img và gán dữ liệu base64
        // const img = document.createElement('img');
        // img.src = `data:image/png;base64,${base64Image}`;
        // document.body.appendChild(img);
      });
    })();
    return () => {
      unListen();
    };
  }, []);
  return (
    <div className="flex flex-1">
      <Image src={img} className="flex-1" />
    </div>
  );
};

export default TauriImage;
