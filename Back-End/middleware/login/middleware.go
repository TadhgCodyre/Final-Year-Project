package login

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
	"hash"
	"io/ioutil"
	"log"
	"time"
)

type (
	mongoClient func(opts ...*options.ClientOptions) (*mongo.Client, error)
	contextTimeout func(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc)
	sha256New func() hash.Hash
	fileRead func(filename string) ([]byte, error)
	Apply func(uri string) *options.ClientOptions
)

type Dependencies struct {
	mongoClient    mongoClient
	contextTimeout contextTimeout
	sha256New      sha256New
	fileRead       fileRead
	Apply          Apply
}

var client Dependencies
var quizMastersCollection *mongo.Collection
var ctx context.Context

func ServiceSetup() Dependencies {
	service := mongo.NewClient
	connect := context.WithTimeout
	shaNew := sha256.New
	read := ioutil.ReadFile
	uri := options.Client().ApplyURI

	client = Dependencies{
		mongoClient: service,
		contextTimeout: connect,
		sha256New: shaNew,
		fileRead: read,
		Apply: uri,
	}

	return client
}

// CreateAccount creates account to insert into the database
func (m Dependencies) CreateAccount(account models.QuizMaster) {
	m.connectDatabase()
	account.Password = m.encryptPassword(account.Password)

	m.newAccount(account)
}

func (m Dependencies) connectDatabase() {
	data := m.readFile()
	mongoDB := data["mongo"].(string)

	client, err := m.mongoClient(m.Apply(mongoDB))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ = m.contextTimeout(context.Background(), 10*time.Second)
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
	quizMastersCollection = tableQuizDatabase.Collection("QuizMaster")
}

func (m Dependencies) encryptPassword(password string) string {
	encrypt := sha256.New()
	_, err := encrypt.Write([]byte(password))
	if err != nil {
		log.Fatal(err)
	}

	password = fmt.Sprintf("%x", encrypt.Sum(nil))
	return password
}

func (m Dependencies) newAccount(account models.QuizMaster) {
	quizMasterResult, err := quizMastersCollection.InsertOne(ctx, bson.D{
		{Key: "username", Value: account.Username},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", quizMasterResult.InsertedID)
}

func (m Dependencies) readFile() map[string]interface{} {
	file, err := m.fileRead("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}