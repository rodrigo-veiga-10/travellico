use axum::response::Json;
use serde::Deserialize;
use serde_json::json;




const BUNDLE_NAME: &str = "Travellico";


pub fn add_project_info(project_name: String, data: serde_json::Value) -> Result<bool, std::io::Error> {
    let name_of_project = project_name + ".json";

    let data_dir = tauri::api::path::data_dir().expect("Failed to get data dir");
    let project_path = 
        data_dir.join(BUNDLE_NAME)
        .join("project")
        .join(name_of_project);

    let mut existing_data = match std::fs::File::open(&project_path) {
        Ok(file) => serde_json::from_reader(std::io::BufReader::new(file))?,
        Err(_) => serde_json::Value::Object(Default::default()),
    };

    

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
                Json(json!({ "message": "Failed to add" }))
            }
        },
        Err(_) => Json(json!({ "message": "An error occurred" })),
    }
}

