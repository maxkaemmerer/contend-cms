use axum::{
    routing::{post},
    http::StatusCode,
    Router,
    Json,
};

use crate::user::domain::aggregate::User;
use crate::user::domain::create::CreateUser;

async fn create_user(Json(payload): Json<CreateUser>) -> (StatusCode, Json<User>) {
    let user = User {
        id: 1337,
        username: payload.username,
    };

    (StatusCode::CREATED, Json(user))
}

pub fn create(app: Router) -> Router {
    app.route("/users", post(create_user))
}