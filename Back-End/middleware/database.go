package middleware

import (
	"Final-Year-Project/utils"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"log"
	"time"
)

type (
	mongoClient func(opts ...*options.ClientOptions) (*mongo.Client, error)
	contextTimeout func(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc)
	fileRead func(filename string) ([]byte, error)
	Apply func(uri string) *options.ClientOptions
)

type Dependencies struct {
	mongoClient    mongoClient
	contextTimeout contextTimeout
	fileRead       fileRead
	Apply          Apply
}

var client Dependencies
var ctx context.Context

func ServiceSetup() Dependencies {
	service := mongo.NewClient
	connect := context.WithTimeout
	read := ioutil.ReadFile
	uri := options.Client().ApplyURI

	client = Dependencies{
		mongoClient: service,
		contextTimeout: connect,
		fileRead: read,
		Apply: uri,
	}

	return client
}

func (m Dependencies) ConnectDatabase() (context.Context, *mongo.Client) {
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

	return ctx, client
}

func (m Dependencies) readFile() map[string]interface{} {
	file, err := m.fileRead("../utils/config.yaml")
	utils.CheckErr(err)

	data := make(map[string]interface{})

	err = yaml.Unmarshal(file, &data)
	utils.CheckErr(err)

	return data
}