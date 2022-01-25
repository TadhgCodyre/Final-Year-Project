package account

import (
	"Final-Year-Project/Back-End/middleware"
	"Final-Year-Project/Back-End/models"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
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

func Login(quizMaster models.QuizMaster) bool {
	ctx, client := dependencies.ConnectDatabase()

	tableQuizDatabase := client.Database("TableQuiz")
	quizMastersCollection = tableQuizDatabase.Collection("QuizMaster")

	//var returnedAccount []bson.M
	var returnedAccount models.QuizMaster
	err := quizMastersCollection.FindOne(ctx, bson.M{"email":quizMaster.Email}).Decode(&returnedAccount)
	if err != nil {
		fmt.Println(err)
		return false
	}

	fmt.Println(returnedAccount.Password)
	if err = bcrypt.CompareHashAndPassword([]byte(returnedAccount.Password), []byte(quizMaster.Password)); err != nil {
		return false
	} else {
		return true
	}
}

// CreateAccount creates account to insert into the database
func CreateAccount(account models.QuizMaster) {
	ctx, client := dependencies.ConnectDatabase()

	tableQuizDatabase := client.Database("TableQuiz")
	quizMastersCollection = tableQuizDatabase.Collection("QuizMaster")

	account.Password = encryptPassword(account.Email)

	newAccount(account, ctx)
}

func encryptPassword(password string) string {
	h, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(h))

	return string(h)
}

func newAccount(account models.QuizMaster, ctx context.Context) {
	quizMasterResult, err := quizMastersCollection.InsertOne(ctx, bson.D{
		{Key: "email", Value: account.Email},
		{Key: "username", Value: account.Username},
		{Key: "password", Value: account.Password},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", quizMasterResult.InsertedID)
}

