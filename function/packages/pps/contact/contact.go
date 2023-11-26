package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/mailgun/mailgun-go/v4"
)

type Request struct {
	SenderName string `json:"name"`
	Sender     string `json:"from"`
	Content    string `json:"content"`
}

type Response struct {
	StatusCode int               `json:"statusCode,omitempty"`
	Headers    map[string]string `json:"headers,omitempty"`
	Body       string            `json:"body,omitempty"`
}

func Main(in Request) (*Response, error) {
	mg := mailgun.NewMailgun(os.Getenv("DOMAIN"), os.Getenv("MAILGUN_API_KEY"))

	sender := in.Sender
	subject := fmt.Sprintf("Message from %s", in.SenderName)
	body := in.Content
	recipient := os.Getenv("EMAIL")

	message := mg.NewMessage(sender, subject, body, recipient)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	// Send the message with a 10 second timeout
	_, _, err := mg.Send(ctx, message)

	if err != nil {
		return &Response{
			Body: err.Error(),
		}, nil
	}

	return &Response{
		Body: "Thank you for contacting Parliament Petroleum Services!",
	}, nil
}
