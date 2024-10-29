import { useReadme } from '@/hooks/useReadme';
import { menus } from '@/routes';
import { listen } from '@tauri-apps/api/event';
import React, { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
const HomePage = () => {
  const [docs, setDocs] = useState<string>('ccc');

  useEffect(() => {
    listen('file-selected-content', (event) => {
      const base64Image = event.payload;
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${base64Image}`;
      document.body.appendChild(img);
    });
  }, []);

  return (
    <div className="flex items-center justify-center overflow-auto">
      <div>csjdhcnjshdcnjsdhcbs</div>
    </div>
  );
};

export default HomePage;
