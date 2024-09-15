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

    let mut python_server = modules::python::PythonServer::new();
    let python_server = Arc::new(Mutex::new(python_server));
    let python_server_clone = Arc::clone(&python_server);

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
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            // listen to the `event-name` (emitted on any window)
            let id = app.listen_global("click", |event| {
                println!("got event-name with payload {:?}", event.payload());
            });
            println!("Listening to event with id {}", id);
            // unlisten to the event using the `id` returned on the `listen_global` function
            // a `once_global` API is also exposed on the `App` struct
            let mut python_server = python_server_clone.lock().unwrap();
            python_server.start();

            // Sử dụng Arc<Mutex<T>> để chia sẻ và đồng bộ hóa quyền truy cập vào python_server

            // Đảm bảo rằng server Python được dừng khi ứng dụng thoát
            // let python_server_clone = Arc::clone(&python_server);
            // app.on_exit(move || {
            //     let mut python_server = python_server_clone.lock().unwrap();
            //     println!("Exiting app");
            //     python_server.stop();
            // });

            // let handle = thread::spawn(|| {
            //     events::handle_time_event(app);
            // });

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                // window.open_devtools();
                //   window.close_devtools();
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_, event| match event {
            RunEvent::ExitRequested { .. } => {
                // let main_window = app_handle.get_window("main").unwrap();
                // main_window.unlisten(id);
                let mut python_server = python_server_clone.lock().unwrap();
                python_server.stop();

                println!("Stopped listening to the event");
            }
            _ => {}
        });
}
