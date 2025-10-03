import React, { useEffect, useRef, useState } from 'react';
import { Child, Command } from '@tauri-apps/plugin-shell';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import path from 'path';
import { BaseDirectory, Dir, writeTextFile } from '@tauri-apps/plugin-fs';
import { join, appDataDir, homeDir } from '@tauri-apps/api/path';
import Editor from '@monaco-editor/react';

enum ProcessStatus {
  RUNNING = 'Running',
  SUCCESS = 'Success',
  ERROR = 'Error',
}

const TauriShell = () => {
  const [stdOut, setStdOut] = useState('');
  const [stdIn, setStdIn] = useState('');
  const child = useRef<Child>();
  const pythonDir = useRef<string>('');

  const [code, setCode] = useState('');

  const [status, setStatus] = useState<ProcessStatus>();

  const runCommand = async () => {
    setStdOut('');
    setStatus(ProcessStatus.RUNNING);
    const command = new Command('python', [pythonDir.current]);
    command.on('close', (data) => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`);
      setStatus(data.code === 0 ? ProcessStatus.SUCCESS : ProcessStatus.ERROR);
    });
    command.on('error', (error) => {});
    command.stdout.on('data', (line) => {
      setStdOut((prev) => prev + line);
    });
    command.stderr.on('data', (line) => {
      setStdOut((prev) => prev + line);
      console.error(line);
      setStatus(ProcessStatus.ERROR);
    });

    child.current = await command.spawn();
    console.log('pid:', child.current.pid);
  };

  const kill = async () => {
    await child.current?.kill();
    child.current = undefined;
    setStatus(undefined);
  };

  const clear = () => {
    setStdOut('');
    setStdIn('');
  };

  const sendInput = async () => {
    await child.current?.write(stdIn);
  };

  useEffect(() => {
    (async () => {
      const _homeDir = await homeDir();
      pythonDir.current = await join(_homeDir, '.pntools', 'python', 'python.py');
      await writeTextFile(
        { contents: code, path: await join(_homeDir, '.pntools', 'python', 'python.py') },
        { dir: BaseDirectory.Home },
      );
    })();
  }, [code]);

  return (
    <div className="bg-steal-200 flex flex-1">
      <div className="flex flex-1 p-1">
        <Editor
          theme="vs-dark"
          height="100%"
          width="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          defaultValue=""
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="">{status}</h1>
          <div className="flex flex-row space-x-2">
            <Button onClick={runCommand} type="primary">
              Run
            </Button>
            <Button onClick={clear}>Clear</Button>
            <Button onClick={kill} danger>
              Kill
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 bg-gray-500 ">
          <div className="flex flex-1">
            <Editor
              theme="vs-dark"
              // height="100%"
              width="100%"
              defaultLanguage="planText"
              value={stdIn}
              onChange={(value) => setStdIn(value ?? '')}
              defaultValue=""
            />
          </div>
          <div className="flex items-center justify-center">
            <Button onClick={sendInput}>Send</Button>
          </div>
          <div className="flex flex-1">
            <Editor
              theme="vs-dark"
              height="100%"
              // width="100%"
              defaultLanguage="planText"
              value={stdOut}
              defaultValue=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TauriShell;
