package main

import (
	quizLogin "Final-Year-Project/Back-End/middleware/account"
	"Final-Year-Project/Back-End/middleware/quizSetup"
	"Final-Year-Project/Back-End/models"
	"Final-Year-Project/utils"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //Parse url parameters passed, then parse the response packet for the POST body (request body)
	// attention: If you do not call ParseForm method, the following data can not be obtained form
	fmt.Println(r.Form) // print information on server side.
	fmt.Println("method:", r.Method) //get request method
	if r.Method == "GET" {
		t, err := template.ParseFiles("../Front-End/homepage.html")
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
		err = t.Execute(w, nil)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		err := r.ParseForm()
		if err != nil {
			log.Fatal(err)
		}
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

		quizMaster := models.QuizMaster{Email: r.FormValue("email"), Password: r.FormValue("password")}
		if !quizLogin.Login(quizMaster) {
			fmt.Println("Wrong email or password, please try again")
			t, err := template.ParseFiles("../Front-End/login.html")
			if err != nil {
				log.Fatal("ListenAndServe: ", err)
			}
			t.Execute(w, nil)
		}
	}
}

func setupQuiz(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //get request method
	if r.Method == "POST" {
		r.ParseForm()

		//sends  account data to mongoDB
		quizMaster := models.QuizMaster{Email: r.FormValue("email"),Username: r.FormValue("username"), Password:  r.FormValue("password")}
		quizLogin.CreateAccount(quizMaster)

		//displays quiz setup page
		t, err := template.ParseFiles("../Front-End/quizSetup.html")
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
		if t.Execute(w, nil) != nil {
			log.Fatal(t.Execute(w, nil))
		}
	} else {
		//Handles setting up the quiz
		r.ParseForm()
		fmt.Println(r.Form)
		question := models.Quiz{Name: r.FormValue("name"),
			NumberRounds: utils.ConvertStringToInt(r.FormValue("rounds")),
			NumberQuestions: utils.ConvertStringToInt(r.FormValue("questions")),
			QuestionPool: utils.CheckboxResponse(r.FormValue("pool")),
			ContributeQuestions: utils.CheckboxResponse(r.FormValue("contribute")),
			QuickResponses: utils.CheckboxResponse(r.FormValue("quick"))}
		quizSetup.AddQuestion(question)
	}
}

func lobby(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //get request method
	if r.Method == "POST" {
		//Handles setting up the quiz
		r.ParseForm()
		question := models.Quiz{Name: r.FormValue("name"),
			NumberRounds:        utils.ConvertStringToInt(r.FormValue("rounds")),
			NumberQuestions:     utils.ConvertStringToInt(r.FormValue("questions")),
			QuestionPool:        utils.CheckboxResponse(r.FormValue("pool")),
			ContributeQuestions: utils.CheckboxResponse(r.FormValue("contribute")),
			QuickResponses:      utils.CheckboxResponse(r.FormValue("quick"))}
		quizSetup.AddQuestion(question)
	}
}

func main() {
	port := 9090
	http.HandleFunc("/", homePage) // setting router rule
	http.HandleFunc("/login", login)
	http.HandleFunc("/quizSetup", setupQuiz)
	http.HandleFunc("/lobby", lobby)
	log.Printf("Listening on Port %d", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil) // setting listening port
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}