package middleware

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

func init() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://Tadhg-Codyre:rKtXh6yazbS4z9uN@tablequiz.xkifj.mongodb.net/TableQuiz?retryWrites=true&w=majority")
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
	fmt.Println(collections)
}
