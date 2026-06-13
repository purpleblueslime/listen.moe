#![windows_subsystem = "windows"]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .unwrap();
}
