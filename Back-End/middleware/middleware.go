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

func CreateQuiz(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var quizName string
	err := json.NewDecoder(r.Body).Decode(&quizName)
	if err != nil {
		log.Println(err)
	}

	fmt.Println("quizName", quizName)

	collection := client.Database("TableQuiz").Collection("Quiz")
	fmt.Println("Collection instance created!")

	check := createQuiz(quizName, collection)
	if check {
		log.Println("Quiz Created")
		json.NewEncoder(w).Encode(quizName)
	} else {
		log.Println("Failed to create quiz")
		http.Error(w, "Wrong Password", 500)
	}
}

func GetQuiz(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var name string
	err := json.NewDecoder(r.Body).Decode(&name)
	if err != nil {
		log.Println(err)
	}
	fmt.Println(name)

	collection := client.Database("TableQuiz").Collection("Quiz")
	fmt.Println("Collection instance created!")

	quiz, err := getQuiz(name, collection)
	if err != nil {
		log.Println(err)
		http.Error(w, "Couldn't retrieve quiz", 500)
	}

	json.NewEncoder(w).Encode(quiz)
}

// AddParticipant Api call to add a participant's results to database
func AddParticipant(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var participant models.Participant
	err := json.NewDecoder(r.Body).Decode(&participant)
	if err != nil {
		panic(err)
	}
	fmt.Println(participant)

	collection := client.Database("TableQuiz").Collection("Quiz")
	fmt.Println("Collection instance created!")

	setParticipant(participant, collection)
	json.NewEncoder(w).Encode(r.Body)
}

// Adds the participant and their score to the database
func setParticipant(participant models.Participant, collection *mongo.Collection) {
	update := bson.D{{"$push", bson.D{
		{"participants", bson.D{
			{"userName", participant.UserName},
			{"score", participant.Score}}}}}}

	quizMasterResult, err := collection.UpdateOne(ctx, bson.M{"quizName": participant.QuizName}, update)
	if err != nil {
		log.Print(err)
		//return false
	}

	fmt.Println("Inserted a Single Quiz Record ", quizMasterResult)
}

// QuizSetup Sends quiz details to database
func QuizSetup(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	client := connectDatabase()
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	var quiz models.Quiz
	err := json.NewDecoder(r.Body).Decode(&quiz)
	if err != nil {
		panic(err)
	}

	collection := client.Database("TableQuiz").Collection("Quiz")
	fmt.Println("Collection instance created!")

	updateQuiz(quiz, collection)
	json.NewEncoder(w).Encode(r.Body)
}

func getQuiz(quizName string, collection *mongo.Collection) (models.ReturnQuiz, error) {
	var returnedQuiz models.ReturnQuiz
	err := collection.FindOne(ctx, bson.M{"quizName": quizName}).Decode(&returnedQuiz)
	if err != nil {
		log.Print(err)
		return returnedQuiz, err
	}

	fmt.Println(returnedQuiz)
	return returnedQuiz, nil
}

func updateQuiz(quiz models.Quiz, collection *mongo.Collection) {
	quizMasterResult, err := collection.UpdateOne(ctx, bson.M{"quizName": quiz.QuizName}, bson.D{{"$push", bson.D{{"quiz", quiz.Quiz}}}})
	if err != nil {
		log.Print(err)
		//return false
	}

	fmt.Println("Inserted a Single Quiz Record ", quizMasterResult)
}

func createQuiz(name string, collection *mongo.Collection) bool {
	quizMasterResult, err := collection.InsertOne(ctx, bson.D{
		{Key: "quizName", Value: name},
	})
	if err != nil {
		log.Println(err)
		return false
	}

	fmt.Println("Inserted a Single Quiz Record ", quizMasterResult.InsertedID)
	return true
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

// Reads the config file for mongo connect string
func readFile() map[string]interface{} {
	file, err := ioutil.ReadFile("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}
