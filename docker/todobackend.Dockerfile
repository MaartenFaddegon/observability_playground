# FROM ekidd/rust-musl-builder:stable as builder
FROM rust:1.62.0-alpine3.16 as builder

RUN USER=root cargo new --bin todo-backend
RUN rm todo-backend/src/*

RUN apk add --no-cache musl-dev protobuf protobuf-dev
WORKDIR todo-backend
COPY ./todo-backend/Cargo.lock ./Cargo.lock
COPY ./todo-backend/Cargo.toml ./Cargo.toml
COPY ./todo-backend/src ./src
COPY ./todo-backend/build.rs ./build.rs
COPY ./todo-backend/proto ./proto
RUN cargo build --release
RUN cat Cargo.toml
RUN ls -l target/release

FROM alpine
COPY --from=builder /todo-backend/target/release/todobackend todobackend
CMD ./todobackend
