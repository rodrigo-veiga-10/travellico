use axum::{Router, routing::{get, post}};
use crate::server::controllers::project::{project_env_cont, project_cont};

pub fn project_router() -> Router {
    Router::new()
        .route("/", get(|| async { "Hello, Project!" }))
        //routes related to the project environment
        .route("/exist_env", get(|| async { project_env_cont::exist_handler().await }))
        .route("/create_env", get(|| async { project_env_cont::create_handler().await }))
        //routes related to the project's
        .route("/add",post(project_cont::add_project_info_handler)) 
        .route("/data", post(project_cont::project_data_handler))
        .route("/delete", post(project_cont::delete_project_handler))
        .route("/rename", post(project_cont::rename_project_handler))
}
