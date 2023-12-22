use std::{fs, collections::HashMap};

use axum::response::Json;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::json;





const BUNDLE_NAME: &str = "Travellico";


fn add_project_info(project_name: String, data: serde_json::Value) -> Result<bool, std::io::Error> {
    let name_of_project = project_name + ".json";

    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let project_path = 
        data_dir.join(BUNDLE_NAME)
        .join("project")
        .join(name_of_project);

    // Check if the file already exists
    if project_path.exists() {
        return Ok(false);
    }

    // If the file doesn't exist, proceed to create it
    let mut existing_data = serde_json::Value::Object(Default::default());

    for (key, value) in data.as_object().unwrap() {
        existing_data.as_object_mut().unwrap().insert(key.clone(), value.clone());
    }

    let pretty_json = serde_json::to_string_pretty(&existing_data)?;
    std::fs::write(&project_path, pretty_json)?;

    Ok(true)
}




 #[derive(Deserialize)]
pub struct ProjectInfoStruct {
    project_name: String,
    data: serde_json::Value,
}

pub async fn add_project_info_handler(Json(payload): Json<ProjectInfoStruct>) -> Json<serde_json::Value> {
    match add_project_info(payload.project_name, payload.data) {
        Ok(result) => {
            if result {
                Json(json!({ "message": "Added with success" }))
            } else {
                Json(json!({ "message": "Already exists" }))
            }
        },
        Err(_) => Json(json!({ "message": "An error occurred" })),
    }
}

#[derive(Serialize, Debug)]
struct FileData {
    name: String,
    size: String,
    date: String,
}

fn project_data(option: String) -> Vec<FileData> {
    const NOTHING: Vec<FileData> = Vec::new();
    const ALL_PROJECTS_OPTION: &str = "";

    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let project_path = 
        data_dir.join(BUNDLE_NAME)
        .join("project");



    if option == ALL_PROJECTS_OPTION {
        if let Ok(entries) = fs::read_dir(&project_path) {
            let mut json_objects: Vec<FileData> = Vec::new();

            for entry in entries {
                if let Ok(entry) = entry {
                    if let Ok(metadata) = entry.metadata() {
                        match metadata.modified() {
                            Ok(modified_time) => {
                                let datetime: DateTime<Utc> = modified_time.into();
                                let today = Utc::now().date_naive();
                                let date_formatted ;
                                if datetime.date_naive() == today {
                                    // If the date is the same as today, format it in hours
                                    date_formatted = datetime.format("%H:%M:%S").to_string();
                                } else {
                                    // If the date is not the same as today, format it in your original way
                                    date_formatted = datetime.format("%d/%m/%Y").to_string();
                                }

                                let mut size_formats: HashMap<&str, &str> = HashMap::new();
    
                                size_formats.insert("byte", "B");
                                size_formats.insert("kilobyte", "KB");
                                size_formats.insert("megabyte", "MB");
                                size_formats.insert("gigabyte", "GB");
                                size_formats.insert("terabyte", "TB");

                                let size_in_bytes = metadata.len();
                                let size_formated = format_size(size_in_bytes, &size_formats);

                                fn format_size(size_in_bytes: u64, size_formats: &HashMap<&str, &str>) -> String {
                                    let mut size = size_in_bytes as f64;
                                    let mut unit = "byte";
                                
                                    for (format, _symbol) in size_formats {
                                        if size >= 1024.0 {
                                            size /= 1024.0;
                                            unit = format;
                                        } else {
                                            break;
                                        }
                                    }
                                
                                    format!("{:.2}{}", size, size_formats.get(unit).unwrap_or(&""))
                                }


                                let file_data = FileData {
                                    name: entry.file_name().to_string_lossy().to_string(),
                                    size: size_formated,
                                    date: date_formatted,
                                };
                                if !(file_data.name == ".DS_Store"){
                                    json_objects.push(file_data);
                                }
                            }
                            Err(_err) => {
                                continue;
                            }
                        }
                    } else {
                        continue;
                    }
                } else {

                    return NOTHING;
                }
            }
            return json_objects;
        } else {
            return NOTHING;
        }
    } else {
        return NOTHING;
    }
}

#[derive(Deserialize)]
pub struct ProjectDataStruct {
    option: String
}

pub async fn project_data_handler(Json(payload): Json<ProjectDataStruct>) -> Json<serde_json::Value> {
    let result = project_data(payload.option);
    
    // Add some logging to check the result
    Json(json!({ "message": result }))
}

