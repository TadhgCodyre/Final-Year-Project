package main

import (
	"Final-Year-Project/Back-End/middleware"
	"Final-Year-Project/Back-End/models"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //Parse url parameters passed, then parse the response packet for the POST body (request body)
	// attention: If you do not call ParseForm method, the following data can not be obtained form
	fmt.Println(r.Form) // print information on server side.
	fmt.Println("method", r.Method)
	fmt.Println("method:", r.Method) //get request method
	if r.Method == "GET" {
		t, err := template.ParseFiles("../Front-End/homepage.html")
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
		t.Execute(w, nil)
	} else {
		r.ParseForm()
		// logic part of log in
		if len(r.Form["PIN"][0]) == 0 {
			fmt.Println("Not a PIN")
		}
		fmt.Println("PIN", r.Form["PIN"])
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //get request method
	if r.Method == "GET" {
		t, err := template.ParseFiles("../Front-End/login.html")
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
		t.Execute(w, nil)
	} else {
		r.ParseForm()
		// logic part of log in
		quizMaster := models.QuizMaster{Username: strings.Join(r.Form["username"],""), Password: strings.Join(r.Form["password"],"")}
		service := middleware.ServiceSetup()
		service.CreateAccount(quizMaster)
	}
}

func main() {
	port := 9090
	http.HandleFunc("/", homePage) // setting router rule
	http.HandleFunc("/login", login)
	log.Printf("Listening on Port %d", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil) // setting listening port
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}