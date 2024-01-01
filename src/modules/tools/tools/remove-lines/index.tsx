import React, { useEffect, useState } from 'react';
import {} from '@emotion/react';
import Editor from '@monaco-editor/react';
import { Select } from 'antd';
import { BaseOptionType } from 'antd/es/select';
import { formatFunc, FormatTool } from './utils';

const convertOption: BaseOptionType[] = Object.keys(FormatTool).map((e) => {
  return {
    label: FormatTool[e as keyof typeof FormatTool],
    value: FormatTool[e as keyof typeof FormatTool],
  };
});

const RemoveLines = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [convertFunction, setConvertFunction] = useState('');
  const [convertSelected, setConvertSelected] = useState<FormatTool>(FormatTool.DEFAULT);

  const handleConvert = () => {
    console.log(convertSelected);
    const _formatFunc = formatFunc[convertSelected];
    try {
      const _output = _formatFunc(fromValue);
      console.log('🚀 ~ file: index.tsx:26 ~ handleConvert ~ _output:', _output);
      setToValue(_output);
    } catch (e) {
      setToValue(JSON.stringify(e, null, 2));
    }
  };

  return (
    <div className="flex h-0 flex-1 flex-shrink items-stretch space-x-3 rounded-md p-1">
      <div className="flex h-full flex-1 rounded-md bg-white shadow-md">
        <div className="flex flex-1 flex-col">
          {/* <div className='h-10'>
              copy
          </div> */}
          <Editor
            theme="vs-dark"
            height="100%"
            width="100%"
            defaultLanguage="plaintext"
            value={fromValue}
            onChange={(value) => value && setFromValue(value)}
            defaultValue=""
          />
        </div>
      </div>
      <div className="flex h-full min-w-[300px] flex-col items-stretch justify-center space-y-4 rounded-md bg-white shadow-md">
        <Select
          showSearch
          defaultValue="default"
          onChange={(value) => setConvertSelected(value)}
          value={convertSelected}
          options={convertOption}
          className="w-full"
        />
        <button className="rounded-lg bg-blue-300 px-3 py-2 " onClick={handleConvert}>
          Convert
        </button>
        {/* <Editor
          theme="vs-dark"
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          defaultValue=""
          value={convertFunction}
          onChange={(value) => value && setConvertFunction(value)}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        /> */}
      </div>
      <div className="flex h-full flex-1 rounded-md bg-white shadow-md">
        <Editor
          theme="vs-dark"
          height="100%"
          width="100%"
          defaultLanguage="plaintext"
          defaultValue=""
          value={toValue}
          onChange={(value) => value && setToValue(value)}
        />
      </div>
    </div>
  );
};

export default RemoveLines;
