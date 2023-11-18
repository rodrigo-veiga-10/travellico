use super::user_info;
use axum::{
    Router,
    routing::get,
};

pub fn user_routes() -> Router {
    Router::new()
        .route("/", get(|| async { "Hello, User!" })) // add a GET route for the main route
        .nest("/info", user_info::user_info_routes()) // use the user_info module
}