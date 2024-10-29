// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::{Arc, Mutex};
use tauri::{CustomMenuItem, Manager, RunEvent, SystemTray, SystemTrayMenu, SystemTrayMenuItem};

mod commands;
pub mod db;
mod events;
mod menus;
pub mod modules;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);

    let tray = SystemTray::new().with_menu(tray_menu);

    let python_server = Arc::new(Mutex::new(modules::python::PythonServer::new()));

    tauri::Builder::default()
        .system_tray(tray)
        .menu(menus::make_menu())
        .on_menu_event(menus::handle_menu_event)
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::put_db,
            commands::get_db,
            commands::get_all_db_keys,
            commands::remove_key,
            commands::blockchain::init_blockchain_command,
            commands::blockchain::add_block_command,
            commands::blockchain::get_blocks_command,
        ])
        .setup({
            let python_server = Arc::clone(&python_server);
            move |app| {
                let main_window = app.get_window("main").unwrap();

                // listen to the `event-name` (emitted on any window)
                let id = app.listen_global("click", |event| {
                    println!("got event-name with payload {:?}", event.payload());
                });
                println!("Listening to event with id {}", id);

                python_server.lock().unwrap().start();

                #[cfg(debug_assertions)] // only include this code on debug builds
                {
                    let window = app.get_window("main").unwrap();
                    // window.open_devtools();
                    //   window.close_devtools();
                }

                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run({
            let python_server = Arc::clone(&python_server);
            move |_, event| match event {
                RunEvent::ExitRequested { .. } => {
                    python_server.lock().unwrap().stop();
                    println!("Stopped listening to the event");
                }
                _ => {}
            }
        });
}
