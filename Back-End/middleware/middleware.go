package middleware

import (
	"Final-Year-Project/utils"
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"Final-Year-Project/Back-End/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// collection object/instance
var ctx context.Context

// create connection with mongo db
func connectDatabase() *mongo.Client {
	data := readFile()
	connectionString := data["mongo"].(string)

	client, err := mongo.NewClient(options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ = context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//defer client.Disconnect(ctx)

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB!")

	return client
}

// CreateAccount creates account to send to database
func CreateAccount(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var task models.QuizMaster
	_ = json.NewDecoder(r.Body).Decode(&task)
	task.Password = encryptPassword(task.Password)

	collection := client.Database("TableQuiz").Collection("QuizMaster")
	fmt.Println("Collection instance created!")

	check := insertAccount(task, collection)
	if check {
		json.NewEncoder(w).Encode(task)
	} else {
		http.Error(w, "Email already exists", 500)
	}

}

// Login Gets credentials from database to check for correct details
func Login(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var task models.QuizMaster
	_ = json.NewDecoder(r.Body).Decode(&task)

	collection := client.Database("TableQuiz").Collection("QuizMaster")
	fmt.Println("Collection instance created!")

	check := checkAccount(task, collection)
	if check {
		log.Println("Login Successful")
		json.NewEncoder(w).Encode(task)
	} else {
		log.Println("Login Failed")
		http.Error(w, "Wrong Password", 500)
	}

}

// QuizSetup Sends quiz detials to database
func QuizSetup(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var quiz models.Quiz
	_ = json.NewDecoder(r.Body).Decode(&quiz)
	fmt.Println(quiz)

	collection := client.Database("TableQuiz").Collection("Quiz")
	fmt.Println("Collection instance created!")

	addQuiz(quiz, collection)
	json.NewEncoder(w).Encode(quiz)
}

// Encrypts plaintext into ciphertext
func encryptPassword(password string) string {
	h, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	return string(h)
}

// Insert one task in the DB
func insertAccount(account models.QuizMaster, collection *mongo.Collection) bool {
	var returnedAccount models.QuizMaster
	err := collection.FindOne(ctx, bson.M{"email": account.Email}).Decode(&returnedAccount)
	if err == nil {
		log.Print("Existing email found")
		return false
	}

	quizMasterResult, err := collection.InsertOne(ctx, bson.D{
		{Key: "email", Value: account.Email},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Print(err)
		return false
	}

	fmt.Println("Inserted a Single Account Record ", quizMasterResult.InsertedID)
	return true
}

// Checks if login credentials are correct
func checkAccount(account models.QuizMaster, collection *mongo.Collection) bool {
	//var returnedAccount []bson.M
	var returnedAccount models.QuizMaster
	err := collection.FindOne(ctx, bson.M{"email": account.Email}).Decode(&returnedAccount)
	if err != nil {
		log.Print(err)
		return false
	}

	//temporary override
	err = bcrypt.CompareHashAndPassword([]byte(returnedAccount.Password), []byte(account.Password))
	if err != nil {
		return false
	} else {
		return true
	}
}

func addQuiz(quiz models.Quiz, collection *mongo.Collection) {
	quizMasterResult, err := collection.InsertOne(ctx, bson.D{
		{Key: "name", Value: quiz.Name},
		{Key: "question", Value: quiz.Questions},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Quiz Record ", quizMasterResult.InsertedID)
}

// Reads the config file for mongo connect string
func readFile() map[string]interface{} {
	file, err := ioutil.ReadFile("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}
