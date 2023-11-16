import React, { useEffect, useState } from 'react';
import {} from '@emotion/react';
import Editor from '@monaco-editor/react';

const ConvertTool = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromLang, setFromLang] = useState('javascript');

  function convertSCSSToReactNative(scssCode) {
    const styles = {};

    // Remove comments from the SCSS code
    const cleanedCode = scssCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // Split the code into individual lines
    const lines = cleanedCode.split(';');

    // Process each line of SCSS code
    lines.forEach((line) => {
      if (line.trim().length === 0) {
        return;
      }

      // Split the line into property and value
      const [property, value] = line.split(':');

      // Convert property names
      const convertedProperty = property
        .trim()
        .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

      // Convert values
      const convertedValue = value?.trim().replace(/([0-9.]+)px/g, '$1');

      // Add the converted style to the stylesheet
      styles[convertedProperty] = convertedValue;
    });

    return styles;
  }

  const handleConvert = () => {
    if (!fromValue) return;
    setToValue(JSON.stringify(convertSCSSToReactNative(fromValue), null, 2));
  };

  return (
    <div className="flex h-0 flex-1 flex-shrink items-stretch space-x-3 p-5">
      <div className="flex h-full flex-1 rounded-md bg-white shadow-md">
        <div className="flex flex-1 flex-col">
          {/* <div className='h-10'>
              copy
          </div> */}
          <Editor
            theme="vs-dark"
            height="100%"
            width="100%"
            defaultLanguage="css"
            value={fromValue}
            onChange={(value) => setFromValue(value)}
            defaultValue=""
          />
        </div>
      </div>
      <div className="min-w-36 flex h-full items-center justify-center rounded-md bg-white shadow-md">
        <div>
          <button className="rounded-lg bg-blue-300 px-3 py-2 " onClick={handleConvert}>
            Convert
          </button>
        </div>
      </div>
      <div className="flex h-full flex-1 rounded-md bg-white shadow-md">
        <Editor
          theme="vs-dark"
          height="100%"
          width="100%"
          defaultLanguage="JSON"
          defaultValue=""
          value={toValue}
          onChange={(value) => setToValue(value)}
        />
      </div>
    </div>
  );
};

export default ConvertTool;
