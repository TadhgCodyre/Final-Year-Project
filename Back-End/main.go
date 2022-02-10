package main

import (
	"Final-Year-Project/Back-End/router"
	"fmt"
	"github.com/rs/cors"
	"log"
	"net/http"
)

func main() {
	r := router.Router()
	handler := cors.Default().Handler(r)
	fmt.Println("Starting server on the port 9090...")
	log.Fatal(http.ListenAndServe(":9090", handler))
}