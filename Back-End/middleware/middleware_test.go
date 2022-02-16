package middleware

import (
	"reflect"
	"testing"
)

func Test_EncryptPassword(t *testing.T) {
	mockPassword := encryptPassword("12345")
	if mockPassword == "$2a$10$7MlMirEOXfu/UK3.0ASNd.d6XQgYUwMU9YlYnzxMpdS1Ed.GRbVwS" {
		t.Error(mockPassword)
	}
}

func Test_ReadFile(t *testing.T) {
	test := readFile()

	if "map[string]interface{}" == reflect.TypeOf(test).String() {
		t.Error(test)
	}
}
