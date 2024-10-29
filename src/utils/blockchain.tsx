import { invoke } from '@tauri-apps/api/tauri';

export class Blockchain {
  static async initBlockchain(): Promise<void> {
    try {
      await invoke('init_blockchain_command');
      console.log('Blockchain initialized');
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
    }
  }

  static async addBlock(data: string): Promise<void> {
    try {
      await invoke('add_block_command', { data });
      console.log('Block added:', data);
    } catch (error) {
      console.error('Failed to add block:', error);
    }
  }

  static async getBlocks(): Promise<any[]> {
    try {
      const blocks: any = await invoke('get_blocks_command');
      console.log('Blocks retrieved:', blocks);
      return blocks;
    } catch (error) {
      console.error('Failed to get blocks:', error);
      return [];
    }
  }
}
