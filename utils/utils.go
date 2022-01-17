package utils

import (
	"log"
	"strconv"
)

func CheckErr(err error) {
	if err != nil {

	}
}

func ConvertStringToInt(array string) int {
	newString, err := strconv.Atoi(array)
	if err != nil {
		log.Fatal("Error converting string to int: ", err)
	}

	return newString
}

func CheckboxResponse(response string) bool {
	if response == "true" {
		return true
	} else {
		return false
	}
}
