use std::thread;
use travellico::server::server::server_init;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu,  AboutMetadata};



fn main() {
    println!("server is running");
    
    // Spawn a new thread to run the `server_init` function
    thread::spawn(|| {
        server_init();
    });

    // Continue running the main thread to run the `tauri::Builder`
    println!("tauri is running");
    tauri::Builder::default()
        .menu(menu())
        .on_menu_event(handle_menu_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



fn menu() -> Menu {
    let about_metadata = AboutMetadata::default();

    Menu::new()

      .add_submenu(
          Submenu::new(
              "Travellico",
              Menu::new()
                .add_native_item(MenuItem::About("Travellico".to_string(), about_metadata))
                .add_item(CustomMenuItem::new("settings", "Settings"))   
          )
      )
      .add_submenu(
          Submenu::new(
              "File",
              Menu::new()
                  .add_item(CustomMenuItem::new("new", "New"))
                  .add_item(CustomMenuItem::new("open", "Open"))
                  .add_item(CustomMenuItem::new("save", "Save"))
          )
        )
        .add_submenu(
            Submenu::new(
                "Edit",
                Menu::new()
                    .add_native_item(MenuItem::Undo)
                    .add_native_item(MenuItem::Redo)
                    .add_native_item(MenuItem::Cut)
                    .add_native_item(MenuItem::Copy)
                    .add_native_item(MenuItem::Paste)
            )
        )
        .add_submenu(
            Submenu::new(
                "View",
                Menu::new()
                    .add_native_item(MenuItem::Zoom)
            )
        )
        .add_submenu(
            Submenu::new(
                "Window",
                Menu::new()
                    .add_native_item(MenuItem::Minimize)
                    .add_item(CustomMenuItem::new("close", "Close")))
            )
        .add_submenu(
            Submenu::new(
                "Help",
                Menu::new()
            )
        )
}


fn handle_menu_event(event: tauri::WindowMenuEvent) {
    match event.menu_item_id() {
        "settings" => {
            tauri::Window::emit(&event.window(), "settings", Some("/settings")).unwrap();
        }
        _ => {}
    }
}