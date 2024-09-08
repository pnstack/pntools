import { getAllDbKeys, getDbStorage, removeDbKey, setDbStorage } from '@/utils/db';
import { invoke } from '@tauri-apps/api';
import { Input, Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { includes as lodashIncludes, filter as lodashFilter, lowerCase } from 'lodash';
import Search from 'antd/es/input/Search';
import { CloseOutlined } from '@ant-design/icons';
const TauriStorage = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [dbKeys, setDbKeys] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState<string[]>([]);
  const [content, setContent] = useState('');
  useEffect(() => {
    fetchAllKey();
  }, []);

  async function fetchAllKey() {
    const keys = await getAllDbKeys();
    setDbKeys(keys);
    setSearchKey(keys);
  }

  async function put() {
    await setDbStorage(key, value);
    handleKeySelect(key);
    fetchAllKey();
    setKey('');
    setValue('');
  }

  const handleSerachKey = async (value: string) => {
    const searchResult = lodashFilter(dbKeys, (key) => lodashIncludes(key, value));
    setSearchKey(searchResult);
  };

  const handleRemoveKey = async (key: string) => {
    await removeDbKey(key);
    fetchAllKey();
  };

  const handleKeySelect = async (key: any) => {
    const _content = await getDbStorage(key);
    setContent(_content);
  };

  return (
    <div className="flex flex-1">
      <div className="flex w-[300px] flex-col space-y-3 px-3">
        <Search
          placeholder="Search..."
          allowClear
          enterButton
          onChange={(e) => handleSerachKey(e.target.value)}
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
                    handleKeySelect(key);
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
      <div className="flex flex-1 flex-col  p-3">
        <div className=" flex flex-1 rounded-md border border-gray-500 p-5">{content}</div>
        <div className="flex flex-row space-x-2">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            type="text"
            placeholder="key"
            className="max-w-[200px]"
          />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="value"
          />
          <Button onClick={put}>Put</Button>
        </div>
      </div>
    </div>
  );
};

export default TauriStorage;
