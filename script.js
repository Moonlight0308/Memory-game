// Variabelen voor het spel, zoals spelers, scores, en kaarten.
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let currentPlayer = 0; 
let scores = [0, 0]; 
let score = 0;
const imgs = [
  { "name": "apple", "img": "./Images/apple.jpg" },
  { "name": "banana", "img": "./Images/banaan.png" },
  { "name": "cherry", "img": "./Images/cherry.png" },
  { "name": "grape", "img": "./Images/grape.png" },
  { "name": "blue", "img": "./Images/blue.png" },
  { "name": "salad", "img": "./Images/salad.png" },
  { "name": "taart", "img": "./Images/taart.png" },
  { "name": "water", "img": "./Images/water.png" },
  { "name": "rood", "img": "./Images/rood.jpg" },
];

// Zorgt dat kaarten worden klaargezet, geschud en weergegeven in het speelveld.
updateScoreDisplay();
cards = [...imgs, ...imgs];
shuffleCards();
generateCards();

// Schudt de kaarten willekeurig met het Fisher-Yates-algoritme.
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Maakt de HTML-structuur van elke kaart en voegt deze toe aan het speelveld.
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.img}" alt="${card.name}" />
      </div>
      <div class="back"></div>
    `;

    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Draait een kaart om. Als twee kaarten zijn geselecteerd, controleer of ze overeenkomen.
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

// Controleert of de twee omgedraaide kaarten een match zijn. Als dit niet zo is, wisselt het van speler.
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    scores[currentPlayer]++;
    updateScoreDisplay();
    disableCards();
  } else {
    unflipCards();
    switchPlayer();
  }
}

// Verwijdert correcte kaarten of draait verkeerde kaarten terug na een korte vertraging.
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
  checkWinner();
}
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
    
  }, 1000);
}

// Alle variabelen resetten voor volgende game
function resetBoard() {
  firstCard = null; 
  secondCard = null;
  lockBoard = false;
}

// Wissel speler
function switchPlayer() {
  currentPlayer = (currentPlayer + 1) % 2; // Wisselt tussen 0 en 1
  updateTurnDisplay();
}

// Score updaten
function updateScoreDisplay() {
  document.querySelector(".player1-score").textContent = `Speler 1: ${scores[0]}`;
  document.querySelector(".player2-score").textContent = `Speler 2: ${scores[1]}`;
}
function updateTurnDisplay() {
  document.querySelector(".current-player").textContent = `Aan de beurt: Speler ${currentPlayer + 1}`;

}

// Winnaar checken en alerten
function checkWinner() {
  // Controleer of alle kaarten zijn omgedraaid
  const flippedCards = document.querySelectorAll(".card.flipped");
  if (flippedCards.length === cards.length) {
    let winnerMessage;
    if (scores[0] > scores[1]) {
      winnerMessage = "Speler 1 wint met " + scores[0] + " punten!";
    } else if (scores[1] > scores[0]) {
      winnerMessage = "Speler 2 wint met " + scores[1] + " punten!";
    } else {
      winnerMessage = "Het is een gelijkspel! Beide spelers hebben " + scores[0] + " punten.";
    }

    setTimeout(() => {
      alert(winnerMessage);
    }, 500); // Zorg dat het alert na de laatste kaartflips verschijnt
  }
}

// Alles resetten inclusief variabelen (functie resetboard doet dat)
function restart() {
  resetBoard();
  shuffleCards();
  scores = [0, 0];
  currentPlayer = 0;
  score = 0;
  document.querySelector(".score").textContent = score;
  updateScoreDisplay();
  updateTurnDisplay();
  gridContainer.innerHTML = "";
  generateCards();
}

// Update beurtindicator
updateTurnDisplay();
