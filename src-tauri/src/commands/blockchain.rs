use crate::modules::blockchain::{init_blockchain, Block, Blockchain};
use lazy_static::lazy_static;
use std::sync::Mutex;
use tauri::command;

lazy_static! {
    static ref BLOCKCHAIN: Mutex<Blockchain> = Mutex::new(init_blockchain());
}

#[tauri::command]
pub fn init_blockchain_command() {
    let mut blockchain = BLOCKCHAIN.lock().unwrap();
    *blockchain = init_blockchain();
}

#[tauri::command]
pub fn add_block_command(data: String) {
    let mut blockchain = BLOCKCHAIN.lock().unwrap();
    blockchain.add_block(data);
}

#[tauri::command]
pub fn get_blocks_command() -> Vec<Block> {
    let blockchain = BLOCKCHAIN.lock().unwrap();
    blockchain.get_blocks()
}
