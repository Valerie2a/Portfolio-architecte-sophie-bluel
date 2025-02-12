
let modal = null;

// Fonction pour ouvrir la première modale
const openModal1 = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien

    const target = document.querySelector(e.target.getAttribute('href'));
    if (!target) return;

    // Cache toute modale précédente avant d'afficher la nouvelle
    closeModal();

    target.classList.add("modal-active");
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    // Ajouter les écouteurs d'événements pour la fermeture de la modale
    addModalCloseListeners(modal, closeModal1);
};

// Fonction pour fermer la première modale
const closeModal1 = function (e) {
    if (!modal) return;

    e.preventDefault();
    closeModal();
};

// Fonction pour fermer la modale (gère la réinitialisation des événements)
const closeModal = function () {
    if (!modal) return;

    modal.classList.remove("modal-active");
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');

    // Supprimer les écouteurs d'événements
    removeModalCloseListeners(modal);
    modal = null;
};

// Ajout des écouteurs d'événements pour la fermeture de la modale
const addModalCloseListeners = function (modal, closeCallback) {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeCallback(e);
        }
    });

    modal.querySelector('.js-modal-close').addEventListener('click', closeCallback);
};

// Suppression des écouteurs d'événements
const removeModalCloseListeners = function (modal) {
    modal.removeEventListener('click', closeModal1);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal1);
};

// Fonction pour ouvrir la deuxième modale
const openModal2 = function (e) {
    e.preventDefault();

    const target = document.querySelector('#modal2');
    if (!target) return;

    closeModal(); // Ferme la première modale

    target.classList.add("modal-active");
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    // Ajouter les écouteurs pour la fermeture de la deuxième modale
    addModalCloseListeners(modal, closeModal2);

    // Ajouter l'écouteur pour revenir à la première modale
    modal.querySelector('.return').addEventListener('click', returnToModal1);
};

// Fonction pour fermer la deuxième modale
const closeModal2 = function (e) {
    if (!modal) return;

    e.preventDefault();
    closeModal();

    // Une fois la modale fermée, revenir à la première modale
    openModal1({ preventDefault: () => {}, target: document.querySelector('.js-modal') });
};

// Fonction pour revenir à la première modale
const returnToModal1 = function (e) {
    e.preventDefault();

    // Ferme la deuxième modale
    closeModal2(e); 

    // Rouvre la première modale
    openModal1({ preventDefault: () => {}, target: document.querySelector('.js-modal') });
};

// Ajout des écouteurs d'événements pour les boutons qui ouvrent la modale 1
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal1);
});

// Ajout des écouteurs d'événements pour les boutons qui ouvrent la modale 2
document.querySelectorAll('.js-modal2').forEach(button => {
    button.addEventListener('click', openModal2);
});


