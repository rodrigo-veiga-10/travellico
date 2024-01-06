use axum::response::Json;
use serde_json::{json, Value};

const BUNDLE_NAME: &str = "Travellico";


pub fn check_user_info_file() -> bool {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let file_path = 
        data_dir.join(BUNDLE_NAME)
        .join("user")
        .join("user_info.json");

    file_path.exists() && file_path.is_file()
}

pub async fn check_user_info_handler() -> Json<serde_json::Value> {
    let file_exists = check_user_info_file();
    if file_exists {
        Json(json!({ "message": "true"}))
    } else {
        Json(json!({ "message": "false"}))
    }
}

pub fn create_user_info() -> bool {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let user_dir = data_dir.join(BUNDLE_NAME).join("user");
    let file_path = user_dir.join("user_info.json");

    std::fs::create_dir_all(&user_dir).is_ok()
        && std::fs::File::create(&file_path).is_ok()
}

pub async fn create_user_info_handler() -> Json<serde_json::Value> {
    if create_user_info() {
        Json(json!({ "message": "File created" }))
    } else {
        Json(json!({ "message": "Failed to create file" }))
    }
}

pub fn add_user_info(data: &str) -> Result<bool, Box<dyn std::error::Error>> {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let file_path = data_dir.join(BUNDLE_NAME).join("user").join("user_info.json");

    let json_data = serde_json::to_string_pretty(&serde_json::from_str::<Value>(data)?)?;

    let metadata = std::fs::metadata(&file_path)?;

    if !check_user_info_file() || metadata.len() == 0 {
        Ok(std::fs::write(&file_path, &json_data).is_ok())
    } else {
        let file = std::fs::File::open(&file_path)?;
        let reader = std::io::BufReader::new(file);
        let mut existing_data: Value = serde_json::from_reader(reader)?;

        if let Some(existing_object) = existing_data.as_object_mut() {
            if let Some(new_object) = serde_json::from_str::<serde_json::Value>(&json_data)?.as_object() {
                for (key, value) in new_object {
                    existing_object.insert(key.clone(), value.clone());
                }
            }
        }

        let pretty_json = serde_json::to_string_pretty(&existing_data)?;
        Ok(std::fs::write(&file_path, pretty_json).is_ok())
    }
}

pub async fn add_user_info_handler(body: Json<serde_json::Value>) -> Json<serde_json::Value> {
    match add_user_info(&body.to_string()) {
        Ok(result) => {
            if result {
                Json(json!({ "message": "File created" }))
            } else {
                Json(json!({ "message": "Failed to create file" }))
            }
        },
        Err(_) => Json(json!({ "message": "An error occurred" })),
    }
}

pub fn get_user_info() -> String {
    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let file_path = data_dir.join(BUNDLE_NAME).join("user").join("user_info.json");

    if check_user_info_file() {
        std::fs::read_to_string(&file_path).unwrap_or_default()
    } else {
        String::new()
    }
}

pub async fn get_user_info_handler() -> Json<serde_json::Value> {
    Json(json!({ "message": get_user_info() }))
}