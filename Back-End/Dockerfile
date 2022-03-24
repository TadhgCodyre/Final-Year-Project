FROM golang:1.18.0-alpine AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .
RUN go build -o /poolquiz -buildvcs=false

FROM alpine:latest
WORKDIR /
COPY --from=build /poolquiz /poolquiz
EXPOSE 9090
ENTRYPOINT [ "/poolquiz" ]