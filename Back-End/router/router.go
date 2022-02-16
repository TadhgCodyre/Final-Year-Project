package router

import (
	"Final-Year-Project/Back-End/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/sign-in", middleware.Login).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/sign-up", middleware.CreateAccount).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/quiz-setup", middleware.QuizSetup).Methods("POST", "OPTIONS")
	return router
}