use axum::{
    Router,
    routing::get, http::{HeaderValue, Method},
};
use super::routes::{user::user_main, project::project::project_router};
use tower_http::cors::{CorsLayer, AllowHeaders};

fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(vec![
            HeaderValue::from_static("http://localhost:1420"),
            HeaderValue::from_static("tauri://localhost")
        ])
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(AllowHeaders::any())
}


#[tokio::main]
pub async fn server_init() {
    let project = project_router();
    let users = user_main::user_routes();
    // build our application with a single route

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .layer(cors_layer())
        .nest("/project", project)
        .nest("/user", users)
        .layer(cors_layer());




    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}