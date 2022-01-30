package main
import (
	"Final-Year-Project/Back-End/router"
	"fmt"
	"log"
	"net/http"
)
func main() {
	fmt.Println("Test")
	r := router.Router()
	fmt.Println("Starting server on the port 9090...")
	log.Fatal(http.ListenAndServe(":9090", r))
}