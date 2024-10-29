use base64::encode;
use std::fs::File;
use std::io::Read;
use tauri::{CustomMenuItem, Menu, Submenu, WindowMenuEvent};
pub fn make_menu() -> Menu {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let open_file = CustomMenuItem::new("open_file".to_string(), "Open File");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_item(open_file)
            .add_item(quit)
            .add_item(close),
    );
    let menu = Menu::new().add_submenu(submenu);
    return menu;
}

pub fn handle_menu_event(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "quit" => {
            std::process::exit(0);
        }
        "close" => {
            event.window().close().unwrap();
        }
        "open_file" => {
            let window = event.window().clone();

            tauri::api::dialog::FileDialogBuilder::default().pick_file(move |path_buf| {
                match path_buf {
                    Some(path) => {
                        // Xử lý file được chọn ở đây

                        println!("File path: {:?}", path);
                        window
                            .emit("file-selected", path.to_string_lossy().to_string())
                            .unwrap();

                        // Read file content and emit it to the front-end
                        let mut file = File::open(&path).expect("Unable to open file");
                        let mut buffer = Vec::new();
                        file.read_to_end(&mut buffer).expect("Unable to read file");
                        let base64_image = encode(&buffer);
                        window.emit("file-selected-content", base64_image).unwrap();
                    }
                    None => {}
                }
            });
            // Handle open file logic here
            println!("Open File menu item clicked");
        }
        _ => {}
    }
}
