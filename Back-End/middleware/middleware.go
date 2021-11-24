package middleware

import (
	"Final-Year-Project/Back-End/models"
	"Final-Year-Project/utils"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"log"
	"time"
)

var collection *mongo.Collection

func init() {
	data := readFile()
	mongoDB := data["mongo"].(string)
	clientOptions := options.Client().ApplyURI(mongoDB)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB!")

	collections := client.Database("TableQuiz")
	fmt.Println(collections.Name())
}

// Creates the account to insert into the database
func CreateAccount(user models.QuizMaster) {
	fmt.Println("Username: ", user.Username, "| Password: ", user.Password)
	newAccount(user)
}
//func CreateAccount(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	w.Header().Set("Access-Control-Allow-Methods", "POST")
//	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
//	var task models.QuizMaster
//	_ = json.NewDecoder(r.Body).Decode(&task)
//	// fmt.Println(task, r.Body)
//	newAccount(task)
//	json.NewEncoder(w).Encode(task)
//}

func newAccount(account models.QuizMaster) {
	insertResult, err := collection.InsertOne(context.Background(), account)
	utils.CheckErr(err)

	fmt.Println("Inserted a Single Record ", insertResult.InsertedID)
}

func readFile() map[string]interface{} {
	file, err := ioutil.ReadFile("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}