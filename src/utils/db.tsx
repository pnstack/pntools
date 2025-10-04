import { invoke } from '@tauri-apps/api/core';

export const setDbStorage = async (key: string, value: string) => {
  return await invoke('put_db', { key, value });
};

export const getDbStorage = async (key: string): Promise<string> => {
  return (await invoke('get_db', { key })) || '';
};

export const getAllDbKeys = async (): Promise<string[]> => {
  return (await invoke('get_all_db_keys', {})) || [];
};

export const removeDbKey = async (key: string) => {
  return await invoke('remove_key', { key });
};

export class DbStorage {
  private namespace: string;

  constructor(namespace: string = 'db') {
    this.namespace = namespace;
  }

  async setDbStorage(key: string, value: string) {
    return await invoke('put_db', { namespace: this.namespace, key, value });
  }

  async getDbStorage(key: string): Promise<string> {
    return (await invoke('get_db', { namespace: this.namespace, key })) || '';
  }

  async getAllDbKeys(): Promise<string[]> {
    return (await invoke('get_all_db_keys', { namespace: this.namespace })) || [];
  }

  async removeDbKey(key: string) {
    return await invoke('remove_key', { namespace: this.namespace, key });
  }
}

export const dbStorage = new DbStorage('db');
