use std::fs;
use std::process::Command;
use notify::{RecommendedWatcher, RecursiveMode, Watcher, Config};
use std::sync::mpsc::channel;
use std::time::Duration;
use tauri::{Window, Emitter};
use std::time::SystemTime;
use tauri_plugin_opener::open_url;
use std::path::Path;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn list_dir(path: String) -> Result<Vec<FileEntry>, String> {
    let dir = match std::fs::read_dir(&path) {
        Ok(d) => d,
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    };

    let mut entries = Vec::new();

    for entry in dir {
        match entry {
            Ok(entry) => {
                let path_obj = entry.path();
                match std::fs::metadata(&path_obj) {
                    Ok(metadata) => {
                        entries.push(FileEntry {
                            name: entry.file_name().to_string_lossy().to_string(),
                            path: path_obj.to_string_lossy().to_string(),
                            is_dir: metadata.is_dir(),
                        });
                    },
                    Err(e) => return Err(format!("Failed to get metadata: {}", e)),
                }
            },
            Err(e) => return Err(format!("Failed to read entry: {}", e)),
        }
    }

    entries.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.cmp(&b.name)
        } else {
            b.is_dir.cmp(&a.is_dir)
        }
    });

    Ok(entries)
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String) -> Result<(), String> {
    fs::File::create(path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn create_dir(path: String) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn rename_path(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(old_path, new_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_path(path: String) -> Result<(), String> {
    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
    if metadata.is_dir() {
        fs::remove_dir_all(path).map_err(|e| e.to_string())
    } else {
        fs::remove_file(path).map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn create_dryad_project(name: String, location: String, template: String) -> Result<String, String> {
    let project_type = if template == "library" { "library" } else { "project" };
    let oak_path = "dryad_core/oak.exe"; 

    let output = Command::new(oak_path)
        .arg("init")
        .arg(&name)
        .arg(format!("--type={}", project_type))
        .current_dir(&location)
        .output()
        .map_err(|e| format!("Failed to execute oak init: {}", e))?;

    if output.status.success() {
        Ok(format!("Project {} created successfully at {}", name, location))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn run_dryad_script(path: String) -> Result<String, String> {
    let dryad_path = "dryad_core/dryad.exe";

    let output = Command::new(dryad_path)
        .arg("run")
        .arg(&path)
        .output()
        .map_err(|e| format!("Failed to execute dryad run: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn start_file_watcher(path: String) -> Result<(), String> {
    let (tx, rx) = channel();
    let mut watcher: RecommendedWatcher = Watcher::new(tx, Config::default()).map_err(|e| e.to_string())?;

    watcher
        .watch(Path::new(&path), RecursiveMode::Recursive)
        .map_err(|e| e.to_string())?;

    std::thread::spawn(move || {
        while let Ok(event) = rx.recv() {
            println!("File system event: {:?}", event);
        }
    });

    Ok(())
}

#[tauri::command]
fn show_notification(window: Window, title: String, message: String) -> Result<(), String> {
    window.emit("notification", (title, message)).map_err(|e| format!("Failed to emit notification: {}", e))
}

#[tauri::command]
fn open_in_external(path: String) -> Result<(), String> {
    tauri_plugin_opener::open_url(path, None::<&str>).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_dir,
            show_notification,
            open_in_external
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

