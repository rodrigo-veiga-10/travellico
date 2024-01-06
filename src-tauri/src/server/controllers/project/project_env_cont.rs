use axum::response::Json;
use serde_json::json;


const BUNDLE_NAME: &str = "Travellico";

/// Check if the project folder exists
/// 
/// # Returns
/// 
/// - `true` if the project folder exists
/// - `false` if the project folder does not exist

pub fn exist() -> bool {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let folder_path = 
        data_dir.join(BUNDLE_NAME)
        .join("project");
    if folder_path.exists() {
        return true;
    } else {
        return false;
    }
 
}

pub async fn exist_handler() -> Json<serde_json::Value> {
    let file_exists = exist();
    if file_exists {
        Json(json!({ "project_env_exist": "true"}))
    } else {
        Json(json!({ "project_env_exist": "false"}))
    }
}

/// Creates the project environment or folder
///
/// # Returns
/// 
/// - `true` if the environment was successfully created
/// - `false` if environment couldn't be created
/// 
pub fn create() -> bool {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let folder_path = 
        data_dir.join(BUNDLE_NAME)
        .join("project");

    std::fs::create_dir_all(&folder_path).is_ok()
}

pub async fn create_handler() -> Json<serde_json::Value> {
    let folder_created = create();
    if folder_created {
        Json(json!({ "project_env_created": "true"}))
    } else {
        Json(json!({ "project_env_created": "false"}))
    }
}