package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type QuizMaster struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email,omitempty"`
	Password string             `bson:"password,omitempty"`
}

//type Question struct {
//	ID             primitive.ObjectID `bson:"_id,omitempty"`
//	Answer         map[string]bool    `bson:"answer,omitempty"`
//}

type Quiz struct {
	ID       primitive.ObjectID       `bson:"_id,omitempty"`
	QuizName string                   `bson:"quizName,omitempty"`
	Quiz     []map[string]interface{} `bson:"quiz,omitempty"`
}

type Participant struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	QuizName string             `bson:"quizName,omitempty"`
	UserName string             `bson:"userName,omitempty"`
	Score    int                `bson:"score,omitempty"`
}

// ReturnQuiz Used for getting the quiz from the database
type ReturnQuiz struct {
	ID       primitive.ObjectID         `bson:"_id,omitempty"`
	QuizName string                     `bson:"quizName,omitempty"`
	Quiz     [][]map[string]interface{} `bson:"quiz,omitempty"`
}
