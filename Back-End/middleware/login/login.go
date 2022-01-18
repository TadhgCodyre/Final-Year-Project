package login

import (
	"Final-Year-Project/Back-End/middleware"
	"Final-Year-Project/Back-End/models"
	"context"
	"crypto/sha256"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"hash"
	"log"
	"time"
)

type(
	mongoClient func(opts ...*options.ClientOptions) (*mongo.Client, error)
	contextTimeout func(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc)
	sha256New func() hash.Hash
)

var quizMastersCollection *mongo.Collection
var dependencies middleware.Dependencies

func init() {
	dependencies = middleware.ServiceSetup()
}

// CreateAccount creates account to insert into the database
func CreateAccount(account models.QuizMaster) {
	ctx, client := dependencies.ConnectDatabase()

	tableQuizDatabase := client.Database("TableQuiz")
	quizMastersCollection = tableQuizDatabase.Collection("QuizMaster")

	account.Password = encryptPassword(account.Password)

	newAccount(account, ctx)
}

func encryptPassword(password string) string {
	encrypt := sha256.New()
	_, err := encrypt.Write([]byte(password))
	if err != nil {
		log.Fatal(err)
	}

	password = fmt.Sprintf("%x", encrypt.Sum(nil))
	return password
}

func newAccount(account models.QuizMaster, ctx context.Context) {
	quizMasterResult, err := quizMastersCollection.InsertOne(ctx, bson.D{
		{Key: "username", Value: account.Username},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", quizMasterResult.InsertedID)
}