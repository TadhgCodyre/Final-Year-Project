package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TadhgCodyre/Final-Year-Project/Back-End/router"

	"github.com/go-chi/cors"
)

func main() {
	r := router.Router()
	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	fmt.Println("Starting server on the port 9090...")
	log.Fatal(http.ListenAndServe(":9090", r))
}
