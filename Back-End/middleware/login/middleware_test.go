package login

import (
	mocks2 "Final-Year-Project/Back-End/middleware/login/mocks"
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"hash"
	"testing"
	"time"
)

//type mockClient struct{}
//
//func (c mockClient) clientPing(ctx context.Context, rp *readpref.ReadPref) error {
//	return nil
//}
//
//func (c mockClient) clientConnect(ctx context.Context) error {
//	return nil
//}
//
//func (c mockClient) clientDatabase(name string, opts ...*options.DatabaseOptions) *mongo.Database {
//	return &mongo.Database{}
//}

func mockApplyURI(uri string) *options.ClientOptions {
	return &options.ClientOptions{}
}

func mockNewClient(opts ...*options.ClientOptions) (*mongo.Client, error) {
	//client := new(mockClient)
	return &mongo.Client{}, nil
}

func mockContextTimeout(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	return &mocks2.Context{}, nil
}

func mockSha256New() hash.Hash {
	return &mocks2.Hash{}
}

func mockReadFile(filename string) ([]byte, error) {
	return []byte("mongo: testing"), nil
}

var mockService Dependencies

func init() {
	mockService = Dependencies{
		mongoClient:    mockNewClient,
		contextTimeout: mockContextTimeout,
		sha256New:      mockSha256New,
		fileRead:       mockReadFile,
		Apply:          mockApplyURI,
	}
}

//func Test_connectDatabase(t *testing.T) {
//	mockService.connectDatabase()
//}

func Test_EncryptPassword(t *testing.T) {
	mockPassword := mockService.encryptPassword("12345")
	if mockPassword != "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5" {
		t.Error(mockPassword)
	}
}

func Test_readFile(t *testing.T) {
	mockMap := mockService.readFile()
	if mockMap == nil {
		t.Error("mockMap was not nil, instead it contained: ", mockMap)
	}
}
