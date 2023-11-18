use axum::{Router, routing::get, routing::post};
use crate::server::controllers::user::user_info;

// check if user information file exists
pub fn user_info_routes() -> Router {
    Router::new()
        .route("/", get(|| async { "Hello, User Information!" }))
        .route("/exist", get(user_info::check_user_info_handler))
        .route("/create", get(user_info::create_user_info_handler))
        .route("/add", post(user_info::add_user_info_handler))
        .route("/data", get(user_info::get_user_info_handler))
}


