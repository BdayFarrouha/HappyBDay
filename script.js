const puzzleContainer = document.getElementById('puzzle-container');
const checkButton = document.getElementById('check-button');
const message = document.getElementById('message');
const nextLevelButton = document.getElementById('next-level-button');
const crosswordContainer = document.getElementById('crossword-container');
const crosswordMessage = document.getElementById('crossword-message');
const crosswordGrid = document.getElementById('crossword-grid');
const secretWordInput = document.getElementById('secret-word-input'); // New input for secret word
const secretWordButton = document.getElementById('secret-word-button'); // Button to submit secret word

// Array of puzzle images for each level
const puzzleImages = [
    'images/puzzle1.jpg', 'images/puzzle2.jpg', 'images/puzzle3.jpg',
    'images/puzzle4.jpg', 'images/puzzle5.jpg', 'images/puzzle6.jpg',
    'images/puzzle7.jpg'
];

// Array of messages for each level
const levelMessages = [
  'l win jet farrouha bsh aamalna l 9ahwa? (klma mn 8 7rouf)',
  'Chnia klina ki ihtafetna b 3id miled farrouha l mwakher ? (klma mn 4 7rouf)',
  'ahna mshina l mall of ... ? (klma mn x 7rouf)',
  'chesmo l nahj li fih l 9ahwa hedhi ? (klma mn 9 7rouf)',
  'farrouha baad l jaw hne knt khayfa tatla3? (klma mn 5 7rouf)',
  'Win l taswira hedhi ? (klma mn 6 7rouf)',
  'chemsha l blasa hedhi ? (klma mn 10 7rouf)',
];

let currentLevel = 0;

// Initialize a puzzle by creating pieces and assigning positions
const createPuzzle = () => {
  puzzleContainer.innerHTML = '';
  nextLevelButton.style.display = 'none';

  // Create shuffled 3x3 grid pieces
  const positions = Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5);

  positions.forEach((pos, index) => {
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.style.backgroundImage = `url('${puzzleImages[currentLevel]}')`;
    piece.style.backgroundPosition = `${(pos % 3) * -100}px ${(Math.floor(pos / 3)) * -100}px`;
    piece.dataset.correctPosition = index;
    piece.dataset.currentPosition = pos;
    piece.draggable = true;

    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('drop', handleDrop);
    piece.addEventListener('dragover', (e) => e.preventDefault());
    piece.addEventListener('dragenter', (e) => e.preventDefault());

    puzzleContainer.appendChild(piece);
  });
};

let draggedPiece = null;

const handleDragStart = (e) => {
  draggedPiece = e.target;
};

const handleDrop = (e) => {
  const droppedPiece = e.target;

  const draggedPosition = draggedPiece.dataset.currentPosition;
  draggedPiece.dataset.currentPosition = droppedPiece.dataset.currentPosition;
  droppedPiece.dataset.currentPosition = draggedPosition;

  const draggedBgPosition = draggedPiece.style.backgroundPosition;
  draggedPiece.style.backgroundPosition = droppedPiece.style.backgroundPosition;
  droppedPiece.style.backgroundPosition = draggedBgPosition;
};

// Check if puzzle is solved
checkButton.addEventListener('click', () => {
  const pieces = Array.from(puzzleContainer.children);
  const isSolved = pieces.every(piece => piece.dataset.currentPosition === piece.dataset.correctPosition);

  if (isSolved) {
    message.textContent = levelMessages[currentLevel] || 'Puzzle Solved! Sahhit!';
    if (currentLevel === puzzleImages.length - 1) {
      puzzleContainer.style.display = 'none';
      nextLevelButton.style.display = 'none';
      checkButton.style.display = 'none'; // Hide check button for crossword stage
      crosswordContainer.style.display = 'block';
      secretWordButton.style.display = 'block'
      secretWordInput.style.display = 'block'
      message.textContent = '';
      createCrosswordGrid();
    } else {
      nextLevelButton.style.display = 'block';
    }
  } else {
    message.textContent = 'ti khademli mo5k, rak mohandsa !';
  }
});

// Proceed to the next puzzle level
nextLevelButton.addEventListener('click', () => {
  currentLevel++;
  message.textContent = '';
  createPuzzle();
});

// Crossword grid creation function
const createCrosswordGrid = () => {
  crosswordGrid.style.display = 'grid';
  crosswordGrid.style.gridTemplateRows = 'repeat(7, 1fr)';
  crosswordGrid.style.gridTemplateColumns = 'repeat(12, 1fr)';

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 12; col++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1;
      cell.classList.add('crossword-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      if ((row === 0 && col < 2) || (row === 0 && col > 7) ||
          (row === 1 && col < 6) || (row === 1 && col > 10) ||
          (row === 2 && col < 1) || (row === 2 && col > 6) ||
          (row === 3 && col < 2) ||
          (row === 4 && col < 2) || (row === 4 && col === 11) ||
          (row === 5 && col > 7) ||
          (row === 6 && col < 4) || (row === 6 && col > 7)) {
        cell.disabled = true;
        cell.classList.add('disabled-cell');
      }

      crosswordGrid.appendChild(cell);
    }
  }

  // Enable cells for specified words and highlight intersections
  const words = [
    { length: 6, row: 0, startCol: 2 },
    { length: 5, row: 1, startCol: 6 },
    { length: 6, row: 2, startCol: 1 },
    { length: 9, row: 3, startCol: 2 },
    { length: 10, row: 4, startCol: 2 },
    { length: 8, row: 5, startCol: 0 },
    { length: 4, row: 6, startCol: 4 }
  ];

  words.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      const cell = document.querySelector(`input[data-row="${word.row}"][data-col="${word.startCol + i}"]`);
      if (cell) cell.disabled = false;
    }
  });
};

// Check crossword answers
document.getElementById('crossword-check-button').addEventListener('click', () => {
  crosswordMessage.textContent = 'Crossword checked! Fill in correct answers to complete the game.';
});

// Check the secret word input
secretWordButton.addEventListener('click', () => {
    const secretWord = secretWordInput.value.toLowerCase();
    if (secretWord === "n7ebbk") { 
      crosswordMessage.textContent = 'Happy birthday ey wazza ! Nshllh kol aam w nti haya b 1000 5ir ! ';
      // Store the authenticated state
      sessionStorage.setItem("authenticated", "n7ebbk");
      // Redirect to the secret page
      setTimeout(() => {
        window.location.href = "ki_tatla3_ll_sme_le_taarfha_l_page.html";
      }, 2000); // Redirect after 2 seconds
    } else {
      crosswordMessage.textContent = 'mahosh shih. Trah 3awed.';
    }
  });
  
// Initialize the first puzzle
createPuzzle();
