package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type QuizMaster struct {
	ID     primitive.ObjectID `bson:"_id,omitempty"`
	Email 	   string 		  `bson:"email,omitempty"`
	Password   string         `bson:"password,omitempty"`
}

type Question struct {
	ID     primitive.ObjectID	`bson:"_id,omitempty"`
	QuestionString string 		`bson:"questionString,omitempty"`
	Answer map[string]bool			`bson:"answer,omitempty"`
}

type Quiz struct {
	ID     primitive.ObjectID 		`bson:"_id,omitempty"`
	Name   string             		`bson:"name,omitempty"`
	Questions map[int][]Question	`bson:"question,omitempty"`
}