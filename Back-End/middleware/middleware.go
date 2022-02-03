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
var collection *mongo.Collection
var ctx context.Context

// create connection with mongo db
func connectDatabase() {
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

	collection = client.Database("TableQuiz").Collection("QuizMaster")

	fmt.Println("Collection instance created!")
}

//// GetAllTask get all the task route
//func GetAllTask(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	payload := getAllTask()
//	json.NewEncoder(w).Encode(payload)
//}

// CreateAccount creates account to send to database
func CreateAccount(w http.ResponseWriter, r *http.Request) {
	connectDatabase()

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var task models.QuizMaster
	_ = json.NewDecoder(r.Body).Decode(&task)
	// fmt.Println(task, r.Body)
	task.Password = encryptPassword(task.Password)
	insertAccount(task)
	json.NewEncoder(w).Encode(task)
}

func Login(w http.ResponseWriter, r *http.Request){
	connectDatabase()
	fmt.Println("Check 1")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	var task models.QuizMaster
	_ = json.NewDecoder(r.Body).Decode(&task)
	fmt.Println("Check 2")
	task.Password = encryptPassword(task.Password)
	checkAccount(task)
	json.NewEncoder(w).Encode(task)
}

func encryptPassword(password string) string {
	h, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	return string(h)
}

// Insert one task in the DB
func insertAccount(account models.QuizMaster) {
	fmt.Println(account)
	quizMasterResult, err := collection.InsertOne(ctx, bson.D{
		{Key: "email", Value: account.Email},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", quizMasterResult.InsertedID)
}

func checkAccount(account models.QuizMaster) {
	fmt.Println(account)
}


func readFile() map[string]interface{} {
	file, err := ioutil.ReadFile("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}
//// TaskComplete update task route
//func TaskComplete(w http.ResponseWriter, r *http.Request) {
//
//	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	w.Header().Set("Access-Control-Allow-Methods", "PUT")
//	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
//
//	params := mux.Vars(r)
//	taskComplete(params["id"])
//	json.NewEncoder(w).Encode(params["id"])
//}

//// UndoTask undo the complete task route
//func UndoTask(w http.ResponseWriter, r *http.Request) {
//
//	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	w.Header().Set("Access-Control-Allow-Methods", "PUT")
//	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
//
//	params := mux.Vars(r)
//	undoTask(params["id"])
//	json.NewEncoder(w).Encode(params["id"])
//}

//// DeleteTask delete one task route
//func DeleteTask(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
//	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
//	params := mux.Vars(r)
//	deleteOneTask(params["id"])
//	json.NewEncoder(w).Encode(params["id"])
//	// json.NewEncoder(w).Encode("Task not found")
//
//}

//// DeleteAllTask delete all tasks route
//func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
//	w.Header().Set("Access-Control-Allow-Origin", "*")
//	count := deleteAllTask()
//	json.NewEncoder(w).Encode(count)
//	// json.NewEncoder(w).Encode("Task not found")
//
//}

// get all task from the DB and return it
//func getAllTask() []primitive.M {
//	cur, err := collection.Find(context.Background(), bson.D{{}})
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	var results []primitive.M
//	for cur.Next(context.Background()) {
//		var result bson.M
//		e := cur.Decode(&result)
//		if e != nil {
//			log.Fatal(e)
//		}
//		// fmt.Println("cur..>", cur, "result", reflect.TypeOf(result), reflect.TypeOf(result["_id"]))
//		results = append(results, result)
//
//	}
//
//	if err := cur.Err(); err != nil {
//		log.Fatal(err)
//	}
//
//	cur.Close(context.Background())
//	return results
//}

//// task complete method, update task's status to true
//func taskComplete(task string) {
//	fmt.Println(task)
//	id, _ := primitive.ObjectIDFromHex(task)
//	filter := bson.M{"_id": id}
//	update := bson.M{"$set": bson.M{"status": true}}
//	result, err := collection.UpdateOne(context.Background(), filter, update)
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	fmt.Println("modified count: ", result.ModifiedCount)
//}
//
//// task undo method, update task's status to false
//func undoTask(task string) {
//	fmt.Println(task)
//	id, _ := primitive.ObjectIDFromHex(task)
//	filter := bson.M{"_id": id}
//	update := bson.M{"$set": bson.M{"status": false}}
//	result, err := collection.UpdateOne(context.Background(), filter, update)
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	fmt.Println("modified count: ", result.ModifiedCount)
//}
//
//// delete one task from the DB, delete by ID
//func deleteOneTask(task string) {
//	fmt.Println(task)
//	id, _ := primitive.ObjectIDFromHex(task)
//	filter := bson.M{"_id": id}
//	d, err := collection.DeleteOne(context.Background(), filter)
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	fmt.Println("Deleted Document", d.DeletedCount)
//}
//
//// delete all the tasks from the DB
//func deleteAllTask() int64 {
//	d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	fmt.Println("Deleted Document", d.DeletedCount)
//	return d.DeletedCount
//}
