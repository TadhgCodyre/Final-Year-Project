package middleware

import (
	"testing"
)

func mockYamlUnmarshal(in []byte, out interface{}) (err error) {
	return nil
}

func mockReadFile(filename string) ([]byte, error) {
	return []byte("Mock test"), nil
}

var mockService Dependencies

func init() {
	mockService = Dependencies{
		yamlUnmarshal: mockYamlUnmarshal,
		fileRead: mockReadFile,
	}
}

func Test_readFile(t *testing.T) {
	mockMap := mockService.readFile()

	if mockMap == nil {
		t.Error("mockMap was not nil, instead it contained: ", mockMap)
	}
}
