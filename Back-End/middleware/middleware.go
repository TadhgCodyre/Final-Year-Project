package middleware

import (
	"Final-Year-Project/Back-End/models"
	"Final-Year-Project/utils"
	"context"
	"crypto/sha256"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"log"
	"time"
)

//type (
//	mongoClient func() *options.ClientOptions
//	mongoConnect func(ctx context.Context, opts ...*options.ClientOptions) (*mongo.Client, error)
//	sha256New func() hash.Hash
//	jsonMarshal func(v interface{}) ([]byte, error)
//	fileRead func(filename string) ([]byte, error)
//	yamlUnmarshal func(in []byte, out interface{}) (err error)
//)
//
//type Dependencies struct {
//	mongoClient mongoClient
//	mongoConnect mongoConnect
//	sha256New sha256New
//	jsonMarshal jsonMarshal
//	fileRead fileRead
//	yamlUnmarshal yamlUnmarshal
//}

//var service Dependencies
var quizMastersCollection *mongo.Collection
var ctx context.Context

//func init() {
//	client := options.Client
//	connect := mongo.Connect
//	shaNew := sha256.New
//	marshal := json.Marshal
//	read := ioutil.ReadFile
//	unmarshal := yaml.Unmarshal
//
//	service = Dependencies{
//		mongoClient: client,
//		mongoConnect: connect,
//		sha256New: shaNew,
//		fileRead: read,
//		jsonMarshal: marshal,
//		yamlUnmarshal: unmarshal,
//	}
//
//	service.databaseConnect()
//}
//
//func ServiceSetup() Dependencies {
//	client := options.Client
//	connect := mongo.Connect
//	shaNew := sha256.New
//	marshal := json.Marshal
//	read := ioutil.ReadFile
//	unmarshal := yaml.Unmarshal
//
//	service = Dependencies{
//		mongoClient: client,
//		mongoConnect: connect,
//		sha256New: shaNew,
//		fileRead: read,
//		jsonMarshal: marshal,
//		yamlUnmarshal: unmarshal,
//	}
//
//	return service
//}

func connectDatabase() {
	data := readFile()
	mongoDB := data["mongo"].(string)

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoDB))
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

	tableQuizDatabase := client.Database("TableQuiz")
	fmt.Println(tableQuizDatabase.Name())


	quizMastersCollection = tableQuizDatabase.Collection("QuizMaster")
}

// CreateAccount creates account to insert into the database
func CreateAccount(account models.QuizMaster) {
	connectDatabase()
	account.Password = encryptPassword(account.Password)

	newAccount(account)
}

func encryptPassword(password string) string {
	encrypt := sha256.New()
	encrypt.Write([]byte(password))
	password = fmt.Sprintf("%x", encrypt.Sum(nil))

	return password
}

func newAccount(account models.QuizMaster) {
	fmt.Println(account.Username+"|"+account.Password)
	quizMasterResult, err := quizMastersCollection.InsertOne(ctx, bson.D{
		{Key: "username", Value: account.Username},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", quizMasterResult.InsertedID)
}

func readFile() map[string]interface{} {
	file, err := ioutil.ReadFile ("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}