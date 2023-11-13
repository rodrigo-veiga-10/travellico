#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use travellico::server::home::server_init;

fn main() {
    println!("server is running");
    
    // Spawn a new thread to run the `server_init` function
    thread::spawn(|| {
        server_init();
    });

    // Continue running the main thread to run the `tauri::Builder`
    println!("tauri is running");
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}