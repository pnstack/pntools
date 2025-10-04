import { DbStorage } from '@/utils/db';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { fetch } from '@tauri-apps/plugin-http';
import { Button } from 'antd';
import Search from 'antd/es/input/Search';
import * as cheerio from 'cheerio';
import { filter as lodashFilter, includes as lodashIncludes, lowerCase } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import './dictionary.css';

const storage = new DbStorage('dictionary');

const DictionaryPage = () => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    setIsloading(true);
    const _key = lowerCase(keywords).trim();
    contentRef.current && (contentRef.current.innerHTML = 'loading');
    const dt = await storage.getDbStorage(_key);
    if (dt && dt !== 'None') {
      contentRef.current && (contentRef.current.innerHTML = dt);
      setIsloading(false);
      return;
    }

    const steamUrl = `https://dictionary.cambridge.org/dictionary/english-vietnamese/${_key}`;
    const response = await fetch(steamUrl, {
      method: 'GET',
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const dic = $('.entry-body').html() || '';
    if (dic) {
      contentRef.current && (contentRef.current.innerHTML = $('.entry-body').html() || '');
      await storage.setDbStorage(_key, $('.entry-body').html() || '');
    } else {
      contentRef.current && (contentRef.current.innerHTML = 'Not found');
    }

    setIsloading(false);
  };

  const [searchKey, setSearchKey] = useState<string[]>([]);
  const [dbKeys, setDbKeys] = useState<string[]>([]);
  useEffect(() => {
    if (isLoading) return;
    (async () => {
      const keys = await storage.getAllDbKeys();
      setDbKeys(keys);
      setSearchKey(keys);
    })();
  }, [isLoading]);

  const handleExport = async () => {};

  const handleSerachKey = async (value: string) => {
    const searchResult = lodashFilter(dbKeys, (key) => lodashIncludes(key, value));
    setSearchKey(searchResult);
  };

  const handleRemoveKey = async (key: string) => {
    setIsloading(true);
    await storage.removeDbKey(key);
    setIsloading(false);
  };

  const handleKeywordClick = async (key: string) => {
    setKeywords(key);
    if (!contentRef.current) return;
    contentRef.current && (contentRef.current.innerHTML = 'loading');
    const dt = await storage.getDbStorage(key);
    if (dt && dt !== 'None') {
      contentRef.current && (contentRef.current.innerHTML = dt);
      return;
    } else {
      contentRef.current.innerHTML = 'Not found';
    }
  };

  return (
    <div className="flex  h-full min-h-0  flex-1 flex-row space-x-3  dark:bg-gray-700 dark:text-gray-100 ">
      <div className="flex w-[300px] flex-col  space-y-3 px-3">
        <Search
          placeholder="Search..."
          allowClear
          enterButton
          onChange={(e) => handleSerachKey(e.target.value)}
          onSearch={handleSearch}
        />
        <div className="flex h-full min-h-0 flex-col overflow-y-auto ">
          {searchKey.map((key: string) => {
            return (
              <div
                className="flex  flex-row items-center justify-between border-b-[1px] border-gray-400 px-5 py-3 text-xl font-bold text-gray-700 hover:shadow-md"
                key={key}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    handleKeywordClick(key);
                  }}
                >
                  {key}
                </div>
                <CloseOutlined
                  className="text-red-500 hover:cursor-pointer"
                  onClick={() => handleRemoveKey(key)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-1 flex-col  space-y-3">
        <div className="flex flex-row items-center space-x-2">
          <Search
            placeholder="Search..."
            loading={isLoading}
            allowClear
            enterButton
            onChange={(e) => setKeywords(e.target.value)}
            onSearch={handleSearch}
          />

          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            className="cursor-pointer"
          ></Button>
        </div>

        <div
          className="h-full min-h-0 flex-1 overflow-y-auto rounded-md bg-gray-100 p-5 text-left"
          ref={contentRef}
        ></div>
      </div>
    </div>
  );
};

export default DictionaryPage;
