package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func seedAccount(store Storage, firstName, lastName, email, password string) *Account {
	acc, err := NewAccount(firstName, lastName, email, password)
	if err != nil {
		log.Fatal(err)
	}

	if err := store.CreateAccount(acc); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("New account: %d\n", acc.Number)

	return acc
}

func seedAccounts(store Storage) {
	seedAccount(store, "John", "Doe", "john.doe@example.com", "password123")
}

func main() {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, relying on system environment variables.")
	}
	// This line is essential. It initializes the random number generator.
	seed := flag.Bool("seed", false, "Seed the database with initial data")
	flag.Parse()

	cfg, err := LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	store, err := NewPostgresStore(cfg)
	if err != nil {
		log.Fatal(err)
	}

	// Initialize the database schema if needed
	// if err := store.Init(); err != nil {
	// 	log.Fatal(err)
	// }

	if err := store.CreateAccountTable(); err != nil {
		log.Fatal(err)
	}

	if err := store.CreateCouponRedemptionTable(); err != nil {
		log.Fatal(err)
	}

	if err := store.CreatePendingAccountTable(); err != nil {
		log.Fatal(err)
	}

	if err := store.CreateTransferTable(); err != nil {
		log.Fatal(err)
	}

	if err := store.CreatePendingProfileUpdateTable(); err != nil {
		log.Fatal(err)
	}

	if err := store.CreateWebAuthnCredentialTable(); err != nil {
		log.Fatal(err)
	}

	//seed stuff
	if *seed {
		fmt.Println("Seeding database with initial data...")
		seedAccounts(store)
	}

	server := NewAPIServer(cfg.ListenAddr, store, cfg)
	server.Run()
}
