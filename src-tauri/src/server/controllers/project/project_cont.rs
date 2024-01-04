use std::{fs::{self, File}, collections::{HashMap, hash_map::DefaultHasher}, io::{Read, self}, hash::{Hash, Hasher}, time::SystemTime};

use axum::response::Json;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::api::path::data_dir;







const BUNDLE_NAME: &str = "Travellico";


fn add_project_info(project_name: String, data: serde_json::Value) -> Result<bool, std::io::Error> {
    let name_of_project = project_name.clone() + ".json";

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

    let project_id = generate_project_id(&project_name.clone());
    existing_data.as_object_mut().unwrap().insert("id".to_owned(), serde_json::Value::String(project_id));
    existing_data.as_object_mut().unwrap().insert("project_name".to_owned(), serde_json::Value::String(project_name));

    for (key, value) in data.as_object().unwrap() {
        existing_data.as_object_mut().unwrap().insert(key.clone(), value.clone());
    }

    let pretty_json = serde_json::to_string_pretty(&existing_data)?;
    std::fs::write(&project_path, pretty_json)?;

    Ok(true)
}

fn generate_project_id(project_name: &str) -> String {
    let mut hasher = DefaultHasher::new();
    project_name.hash(&mut hasher);
    hasher.finish().to_string()
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
    id: String,
    name: String,
    size: String,
    date: String,
    from: String,
    to: String,
}

#[derive(Debug)]
enum ProjectDataResult {
    AllProjects(Vec<FileData>),
    JsonContent(Value),
}

fn project_data(option: &str) -> ProjectDataResult {
    const NOTHING: Vec<FileData> = Vec::new();
    const ALL_PROJECTS_OPTION: &str = "";

    let data_dir = data_dir().expect("Failed to get data dir");
    let project_path = data_dir.join(BUNDLE_NAME).join("project");

    if option == ALL_PROJECTS_OPTION {
        if let Ok(entries) = fs::read_dir(&project_path) {
            let mut json_objects: Vec<FileData> = Vec::new();

            for entry in entries.flatten() {
                let file_path = entry.path();
                let data = match read_file_contents(file_path.to_str().unwrap()) {
                    Ok(contents) => contents,
                    Err(_) => continue,
                };

                let data_json: serde_json::Value = serde_json::from_str(&data).unwrap();

                let from_name = data_json["from"]["name"].as_str().unwrap_or_default();
                let to_name = data_json["to"]["name"].as_str().unwrap_or_default();
                let id_var = data_json["id"].as_str().unwrap_or_default();

                if let Ok(metadata) = entry.metadata() {
                    let date_formatted = format_modified_time(metadata.modified());

                    let size_formats = get_size_formats();
                    let size_in_bytes = metadata.len();
                    let size_formated = format_size(size_in_bytes, &size_formats);

                    let file_data = FileData {
                        id: id_var.to_string(),
                        name: entry.file_name().to_string_lossy().to_string(),
                        size: size_formated,
                        date: date_formatted,
                        from: from_name.to_string(),
                        to: to_name.to_string(),
                    };

                    if file_data.name != ".DS_Store" {
                        json_objects.push(file_data);
                    }
                } else {
                    continue;
                }
            }

            return ProjectDataResult::AllProjects(json_objects);
        } else {
            return ProjectDataResult::AllProjects(NOTHING);
        }
    } else {
        let id_to_find: String = option.to_owned();

        if let Ok(entries) = fs::read_dir(&project_path) {
            for entry in entries {
                if let Ok(entry) = entry {

                    let file_path = entry.path();

                    if !(entry.file_name() == ".DS_Store"){


                        if let Ok(content) = fs::read_to_string(&file_path) {
                            let content_parsed: Result<Value, _> = serde_json::from_str(&content);
    
                            match content_parsed {
                                Ok(json_value) => {
                                    if json_value["id"] == id_to_find{
                                        return ProjectDataResult::JsonContent(json_value)
                                    }
                                }
                                Err(error) => {
                                    eprintln!("Error parsing JSON: {}", error);
                                }
                            }
                        } else {
                            eprintln!("Failed to read the contents of the file: {}", file_path.display());
                        }

                    }
                }
            }
        } else {
            eprintln!("Failed to read the project directory");
        }
    
        return ProjectDataResult::AllProjects(NOTHING);

    }
}

fn read_file_contents(file_path: &str) -> Result<String, io::Error> {
    let mut file = File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn format_modified_time(modified_time: Result<SystemTime, std::io::Error>) -> String {
    match modified_time {
        Ok(datetime) => {
            let datetime: DateTime<Utc> = datetime.into();
            let today = Utc::now().date_naive();
            if datetime.date_naive() == today {
                datetime.format("%H:%M:%S").to_string()
            } else {
                datetime.format("%d/%m/%Y").to_string()
            }
        }
        Err(error) => format!("Error: {}", error),
    }
}

fn get_size_formats() -> HashMap<&'static str, &'static str> {
    let mut size_formats: HashMap<&'static str, &'static str> = HashMap::new();
    size_formats.insert("byte", "B");
    size_formats.insert("kilobyte", "KB");
    size_formats.insert("megabyte", "MB");
    size_formats.insert("gigabyte", "GB");
    size_formats.insert("terabyte", "TB");
    size_formats
}

fn format_size(size_in_bytes: u64, size_formats: &HashMap<&'static str, &'static str>) -> String {
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

#[derive(Deserialize)]
pub struct ProjectDataStruct {
    option: String,
}

pub async fn project_data_handler(Json(payload): Json<ProjectDataStruct>) -> Json<Value> {
    let result = project_data(&payload.option);

    match result {
        ProjectDataResult::AllProjects(files_data) => {
            Json(json!({ "message": files_data }))
        }
        ProjectDataResult::JsonContent(json_content) => {
            // Print or process the JSON content
            Json(json!({ "message": json_content }))
        }
    }
}
fn delete_file(id: String) -> Result<bool, String> {
    let data_dir = data_dir().expect("Failed to get data dir");
    let project_path = data_dir.join(BUNDLE_NAME).join("project");

    let id_to_find: String = id.to_owned();

    if let Ok(entries) = fs::read_dir(&project_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let file_path = entry.path();

                if entry.file_name() != ".DS_Store" {
                    if let Ok(content) = fs::read_to_string(&file_path) {
                        let content_parsed: Result<Value, _> = serde_json::from_str(&content);

                        match content_parsed {
                            Ok(json_value) => {
                                if json_value["id"] == id_to_find {
                                    if let Err(err) = fs::remove_file(&file_path) {
                                        eprintln!("Failed to delete file {}: {}", file_path.display(), err);
                                        return Err(format!("Failed to delete file {}: {}", file_path.display(), err));
                                    } else {
                                        return Ok(true);
                                    }
                                }
                            }
                            Err(error) => {
                                eprintln!("Error parsing JSON: {}", error);
                            }
                        }
                    } else {
                        eprintln!("Failed to read the contents of the file: {}", file_path.display());
                    }
                }
            }
        }
    } else {
        eprintln!("Failed to read the project directory");
    }

    Ok(false)
}

#[derive(Deserialize)]
pub struct DeleteProjectStruct {
    id: String,
}

pub async fn delete_project_handler(Json(payload): Json<DeleteProjectStruct>) -> Json<serde_json::Value> {
    match delete_file(payload.id) {
        Ok(result) => {
            if result {
                Json(json!({ "message": "File deleted successfully" }))
            } else {
                Json(json!({ "message": "File not found or unable to delete" }))
            }
        },
        Err(error) => {
            eprintln!("An error occurred while deleting file: {}", error);
            Json(json!({ "message": format!("An error occurred: {}", error) }))
        },
    }
}

#[derive(Deserialize)]
pub struct RenameProjectStruct {
    id: String,
    name: String
}

pub async fn rename_project_handler(Json(payload): Json<RenameProjectStruct>) -> Json<serde_json::Value> {
    match rename_file(payload.id, payload.name) {
        Ok(result) => {
            if result {
                Json(json!({ "message": "File renamed with success" }))
            } else {
                Json(json!({ "message": "File not found or unable to rename" }))
            }
        },
        Err(error) => {
            eprintln!("An error occurred while renaming file: {}", error);
            Json(json!({ "message": format!("An error occurred: {}", error) }))
        },
    }
}

fn rename_file(id: String, new_name: String) -> Result<bool, String> {
    let data_dir = data_dir().expect("Failed to get data dir");
    let project_path = data_dir.join(BUNDLE_NAME).join("project");

    let id_to_find: String = id.to_owned();

    if let Ok(entries) = fs::read_dir(&project_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let file_path = entry.path();

                if entry.file_name() != ".DS_Store" {
                    if let Ok(content) = fs::read_to_string(&file_path) {
                        let content_parsed: Result<Value, _> = serde_json::from_str(&content);

                        match content_parsed {
                            Ok(json_value) => {
                                if json_value["id"] == id_to_find {
                                    let mut copy_file_path = file_path.clone();
                                    copy_file_path.pop();
                                    let new_file_name = new_name.clone() + ".json";
                                    copy_file_path.push(std::path::Path::new(&new_file_name));

                                    let mut new_json_value = json_value.clone();
                                    new_json_value.as_object_mut().unwrap().remove("project_name");
                                    new_json_value.as_object_mut().unwrap().insert("project_name".to_owned(), serde_json::Value::String(new_name));
                                    let id = generate_project_id(&new_file_name);
                                    new_json_value.as_object_mut().unwrap().remove("id");
                                    new_json_value.as_object_mut().unwrap().insert("id".to_owned(), serde_json::Value::String(id));
                                    
                                    let pretty_json = serde_json::to_string_pretty(&new_json_value).unwrap();

                                    if let Err(_err) = fs::rename(file_path, copy_file_path.clone()){
                                        return Err("failed to rename file".to_owned())
                                    }else{
                                        std::fs::write(&copy_file_path, pretty_json).unwrap();
                                        return Ok(true);
                                    }
                                }
                            }
                            Err(error) => {
                                eprintln!("Error parsing JSON: {}", error);
                            }
                        }
                    } else {
                        eprintln!("Failed to read the contents of the file: {}", file_path.display());
                    }
                }
            }
        }
    } else {
        eprintln!("Failed to read the project directory");
    }

    Ok(false)
}







