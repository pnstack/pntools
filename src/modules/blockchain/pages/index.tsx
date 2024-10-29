import { Blockchain } from '@/utils/blockchain';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import './style.css';
Blockchain.initBlockchain();

const BlockchainPage = () => {
  const [blocks, setBlocks] = useState<any[]>([]);

  const [value, setValue] = useState<string>('');

  const handleAddBlock = async () => {
    console.log('value', value);
    await Blockchain.addBlock(value);
    setBlocks(await Blockchain.getBlocks());
    setValue('');
  };

  console.log(blocks);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1">
        <div className="blockchain-visualization">
          <h1>Blockchain Visualization</h1>
          {blocks.map((block, index) => (
            <div key={index} className="block">
              <h2>Block {index + 1}</h2>
              <p>Hash: {block.hash}</p>
              <p>Data: {block.data}</p>
              <p>Previous Hash: {block.prev_hash}</p>
              <p>Nonce: {block.nonce}</p>
              {block.prev_hash !== '' && (
                <div className="connection">
                  <div className="connection-line"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)}></Input>
        <Button onClick={handleAddBlock}>Submit</Button>
      </div>
    </div>
  );
};

export default BlockchainPage;
