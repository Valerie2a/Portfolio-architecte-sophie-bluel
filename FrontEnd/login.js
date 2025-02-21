// Attendre que le contenu du DOM soit complètement chargé avant d'exécuter la fonction
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector(".varLogin a");
  const editionBanner = document.querySelector(".edition");
  const token = localStorage.getItem("authToken");
  const buttonModifier = document.querySelector(".js-modal");
  // Vérifie si l'utilisateur est connecté
  if (token) {
    loginLink.textContent = "logout";
    loginLink.style.cursor = "pointer";
    editionBanner.classList.add("edition_selected");
    buttonModifier.classList.add("js-modal_selected");

    // Ajout de l'événement de déconnexion
    loginLink.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      window.location.href = "index.html"; // Recharge la page pour revenir à l'état non connecté
    });
  } else {
    loginLink.textContent = "login";
    loginLink.href = "login.html"; // Redirige vers la page de connexion si non connecté
  }
});

// Gestion de la soumission du formulaire de connexion
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  if (!loginForm) return; // Vérifie si le formulaire est présent sur la page
  // Ajout de l'écouteur d'événement lors de la soumission du formulaire
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs email et mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Envoyer une requête POST au serveur avec les informations d'identification
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Envoyer les informations sous forme de JSON
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        // Si la réponse n'est pas correcte (status pas dans la plage 200), lancer une erreur
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error("Erreur dans l'identifiant ou le mot de passe");
          });
        }
        return response.json(); // Convertir la réponse en JSON
      })
      .then((json) => {
        // Si la réponse contient un token, l'enregistrer dans le localStorage et rediriger vers la page d'accueil
        if (json.token) {
          localStorage.setItem("authToken", json.token);
          window.location.href = "index.html"; // Rediriger vers la page d'accueil après la connexion
        }
      })
      .catch((error) => {
        // Afficher l'erreur dans la console et alerter l'utilisateur en cas de problème de connexion
        console.error("Erreur lors de la connexion:", error);
        alert(error.message); // Afficher le message d'erreur dans une alerte
      });
  });
});
