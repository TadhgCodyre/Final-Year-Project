package models
import "go.mongodb.org/mongo-driver/bson/primitive"
type QuizMaster struct {
	ID     primitive.ObjectID `bson:"_id,omitempty"`
	Email 	   string 		  `bson:"email,omitempty"`
	Username   string         `bson:"username,omitempty"`
	Password   string         `bson:"password,omitempty"`
}

type Quiz struct {
	ID     primitive.ObjectID `bson:"_id,omitempty"`
	Name   string             `bson:"name,omitempty"`
	NumberRounds int		  `bson:"rounds,omitempty"`
	NumberQuestions int 	  `bson:"questions,omitempty"`
	QuestionPool bool 		  `bson:"pool,omitempty"`
	ContributeQuestions bool  `bson:"contribute,omitempty"`
	QuickResponses bool 	  `bson:"quick,omitempty"`
}