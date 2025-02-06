// Variable globale pour stocker la modale actuellement ouverte
let modal = null;

// Fonction pour ouvrir la première modale
const openModal1 = function (e) {
e.preventDefault(); // Empêche le comportement par défaut du lien
    
// Récupère la modale cible à partir de l'attribut href du lien cliqué
const target = document.querySelector(e.target.getAttribute('href'));
if (target === null) return; // Vérifie si la modale existe
    
target.style.display = null; // Affiche la modale
target.removeAttribute('aria-hidden'); // Accessibilité : indique que la modale est visible
target.setAttribute('aria-modal', 'true'); // Indique que c'est une modale
modal = target; // Stocke la modale active

// Ajoute un écouteur d'événement pour fermer la modale en cliquant à l'extérieur
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal1(e);
    }
});

// Ajoute un écouteur pour fermer la modale avec le bouton de fermeture
 modal.querySelector('.js-modal-close').addEventListener('click', closeModal1);
};

// Fonction pour fermer la première modale
const closeModal1 = function (e) {
    if (modal === null) return; // Vérifie si une modale est ouverte
    e.preventDefault(); // Empêche l'action par défaut
    
modal.style.display = "none"; // Cache la modale
modal.setAttribute('aria-hidden', 'true'); // Indique que la modale est cachée
modal.removeAttribute('aria-modal'); // Supprime l'attribut modal
    
// Supprime les écouteurs d'événements pour éviter les fuites de mémoire
modal.removeEventListener('click', closeModal1);
modal.querySelector('.js-modal-close').removeEventListener('click', closeModal1);
    
modal = null; // Réinitialise la variable globale
};

// Fonction pour ouvrir la deuxième modale
const openModal2 = function (e) {
e.preventDefault(); // Empêche le comportement par défaut du bouton
    
const target = document.querySelector('#modal2'); // Sélectionne la deuxième modale
if (target === null) return; // Vérifie si la modale existe
    
document.getElementById('modal1').style.display = 'none'; // Cache la première modale
target.style.display = 'block'; // Affiche la deuxième modale
target.removeAttribute('aria-hidden'); // Accessibilité
target.setAttribute('aria-modal', 'true');
modal = target; // Stocke la nouvelle modale active

// Ajoute un écouteur pour fermer la deuxième modale en cliquant à l'extérieur
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal2(e);
    }
});
    
// Ajoute un écouteur pour fermer avec le bouton de fermeture
modal.querySelector('.js-modal-close').addEventListener('click', closeModal2);
    
// Ajoute un écouteur sur la flèche de retour pour revenir à la première modale
modal.querySelector('.return').addEventListener('click', returnToModal1);
};

// Fonction pour fermer la deuxième modale
const closeModal2 = function (e) {
    if (modal === null) return;
    e.preventDefault();
    
modal.style.display = "none";
modal.setAttribute('aria-hidden', 'true');
modal.removeAttribute('aria-modal');
    
// Supprime les écouteurs pour éviter les fuites de mémoire
modal.removeEventListener('click', closeModal2);
modal.querySelector('.js-modal-close').removeEventListener('click', closeModal2);
modal.querySelector('.return').removeEventListener('click', returnToModal1);
    
modal = null;
};

// Fonction pour revenir de la deuxième modale à la première
const returnToModal1 = function (e) {
    e.preventDefault(); // Empêche l'action par défaut
    closeModal2(e); // Ferme la deuxième modale
    
// Rouvre la première modale en simulant un clic sur le bouton de la première modale
openModal1({ preventDefault: () => {}, target: document.querySelector('.js-modal') });
};

// Ajoute les écouteurs d'événements sur tous les liens qui ouvrent la première modale
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal1);
});

// Ajoute les écouteurs d'événements sur tous les boutons qui ouvrent la deuxième modale
document.querySelectorAll('.js-modal2').forEach(button => {
    button.addEventListener('click', openModal2);
});


/*fileSelect.addEventListener(
  "click",
  (e) => {
    if (fileElem) {
      fileElem.click();
    }
  },
  false,
);
*/

