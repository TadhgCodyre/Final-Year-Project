package login

import (
	"testing"
)

func Test_EncryptPassword(t *testing.T) {
	mockPassword := encryptPassword("12345")
	if mockPassword != "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5" {
		t.Error(mockPassword)
	}
}
