use std::{collections::HashMap, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Extension,
    },
    http::HeaderMap,
    response::IntoResponse,
    routing::{get, post},
    Router,
};

use futures::{
    sink::SinkExt,
    stream::{SplitSink, StreamExt},
};

use tokio::sync::Mutex;

use uuid::Uuid;

type WsMap = Arc<Mutex<HashMap<String, SplitSink<WebSocket, Message>>>>;

#[tokio::main]
async fn main() {
    let shared_state: WsMap = Arc::new(Mutex::new(HashMap::new()));

    let app = Router::new()
        .route("/ws", get(handler))
        .route("/out", post(handle_out))
        .layer(Extension(shared_state));

    axum::Server::bind(&"0.0.0.0:5001".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handler(ws: WebSocketUpgrade, Extension(state): Extension<WsMap>) -> impl IntoResponse {
    ws.on_upgrade(|w| handle_socket(w, state))
}

async fn handle_socket(socket: WebSocket, state: WsMap) {
    let uuid = Uuid::new_v4().to_simple().to_string();

    let (write, mut read) = socket.split();
    state.lock().await.insert(uuid.clone(), write);
    read.next().await;
    state.lock().await.remove(&uuid);
}

async fn handle_out(headers: HeaderMap, Extension(state): Extension<WsMap>) {
    let output = headers.get("output").unwrap().to_str().unwrap().to_string();

    for (_, ws) in state.lock().await.iter_mut() {
        if let Err(e) = ws.send(Message::Text(output.clone())).await {
            println!("Error: {}", e);
        }
    }
}
