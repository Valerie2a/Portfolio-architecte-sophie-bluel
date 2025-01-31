document.querySelector("form").addEventListener("submit", function(event) { // Ajout d'un écouteur d'événement pour la soumission du formulaire
  event.preventDefault(); // Empêche la soumission du formulaire (évite le rechargement de la page)

  const email = document.getElementById("email").value; // Récupère la valeur du champ email
  const password = document.getElementById("password").value; // Récupère la valeur du champ mot de passe

  fetch("http://localhost:5678/api/users/login", { // Effectue une requête HTTP POST vers l'API de connexion
    method: "POST", // Méthode HTTP utilisée pour envoyer les données
    headers: { // Définit les en-têtes de la requête
      "Content-Type": "application/json", // Indique que le corps de la requête est en format JSON
    },
    body: JSON.stringify({ email, password }), // Envoie les données (email et mot de passe) sous forme JSON
  })
  .then(response => { // Une fois la réponse reçue, on la traite
    console.log("Réponse brute de l'API:", response); // Affiche la réponse brute dans la console

        if (!response.ok) { // Si la réponse n'est pas correcte (erreur HTTP 4xx ou 5xx)
          return response.json() // Tente de lire la réponse en JSON
            .catch(() => { throw new Error("Erreur de connexion. Vérifiez votre saisie."); }) // Si la réponse n'est pas en JSON valide
            .then(error => { 
              console.log("Erreur API:", error); // Affiche l'erreur pour diagnostic
              throw new Error("Erreur dans l'identifiant ou le mot de passe"); 
            });
        }

    return response.json(); // Si la réponse est ok, on la transforme en JSON
  })
  .then((json) => { // Une fois que le JSON a été récupéré, on le traite
    console.log("Réponse JSON:", json); // Affiche la réponse JSON dans la console

    if (json.token) { // Si un token est renvoyé (connexion réussie)
      localStorage.setItem("authToken", json.token); // On stocke le token d'authentification dans le localStorage
      console.log("Token stocké :", json.token); // Affiche le token stocké dans la console
      window.location.href = "./index.html"; // Redirige vers la page d'accueil après la connexion
    } else { // Si aucun token n'est renvoyé
      console.log("Erreur : pas de token reçu"); // Affiche un message d'erreur dans la console
    }
  })
  .catch((error) => { // En cas d'erreur lors de la requête ou du traitement
    console.error("Erreur lors de la requête fetch:", error); // Affiche l'erreur dans la console
    alert("Erreur de connexion : " + error.message); // Affiche un message d'erreur dans une alerte
  });
});
