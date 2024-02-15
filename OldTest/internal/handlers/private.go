package handlers

import (
	"net/http"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	// Import other necessary packages
)

// PrivateScopedHandler handles the /api/private-scoped endpoint
func PrivateScopedHandler() http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", "https://localhost")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")

			w.Header().Set("Content-Type", "application/json")

			token := r.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)

			claims := token.CustomClaims.(*middleware.CustomClaims)
			if !claims.HasScope("read:messages") {
				w.WriteHeader(http.StatusForbidden)
				w.Write([]byte(`{"message":"Insufficient scope."}`))
				return
			}

			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"message":"Hello fro a private endpoint! You need to be authenticated to see this."}`))
		}),
	)
}