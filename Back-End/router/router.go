package router

import (
	"github.com/TadhgCodyre/Final-Year-Project/Back-End/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/sign-in", middleware.Login).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/sign-up", middleware.CreateAccount).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/quiz-setup", middleware.QuizSetup).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/get-quiz", middleware.GetQuiz).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/create-quiz", middleware.CreateQuiz).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/add-participant", middleware.AddParticipant).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/get-participants", middleware.GetParticipants).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/check-pin", middleware.CheckPIN).Methods("POST", "OPTIONS")
	return router
}
