document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const timerDisplay = document.getElementById('timer');
    const messageDisplay = document.getElementById('message');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    const emojis = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝', '🍍', '🥭'];

    let cards = [];
    let flipped = [];
    let matched = [];
    let moves = 0;
    let matches = 0;
    let gameActive = false;
    let startTime = 0;
    let timerInterval = null;
    let difficulty = 'easy';

 
    function showMessage(text, type) {
        messageDisplay.textContent = text;
        messageDisplay.className = `message ${type}`;
        

        if (type !== 'complete') {
            setTimeout(() => {
                if (gameActive) {
                    messageDisplay.textContent = '';
                    messageDisplay.className = 'message';
                }
            }, 2000);
        }
    }


    function initGame() {
        difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const pairs = difficulty === 'easy' ? 8 : 12;
        
        cards = [];
        const selectedEmojis = emojis.slice(0, pairs);
        const gameCards = [...selectedEmojis, ...selectedEmojis].sort(() => Math.random() - 0.5);
        
        gameCards.forEach((emoji, index) => {
            cards.push({
                id: index,
                emoji: emoji,
                flipped: false,
                matched: false
            });
        });

        flipped = [];
        matched = [];
        moves = 0;
        matches = 0;
        gameActive = true;
        startTime = Date.now();

        updateDisplay();
        renderBoard();
        startTimer();
        showMessage(`🎮 ${difficulty.toUpperCase()} MODE - Find all pairs!`, 'success');
        startBtn.textContent = 'Resume';
    }


    function renderBoard() {
        gameBoard.innerHTML = '';
        const cols = difficulty === 'easy' ? 4 : 4;
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        cards.forEach(card => {
            const cardElement = document.createElement('button');
            cardElement.className = 'card';
            
            if (card.matched) {
                cardElement.classList.add('matched');
                cardElement.textContent = card.emoji;
                cardElement.disabled = true;
            } else if (card.flipped) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.emoji;
            } else {
                cardElement.textContent = '?';
            }

            cardElement.addEventListener('click', () => flipCard(card.id));
            gameBoard.appendChild(cardElement);
        });
    }


    function flipCard(id) {
        if (!gameActive || flipped.length >= 2) return;
        if (cards[id].flipped || cards[id].matched) return;

        cards[id].flipped = true;
        flipped.push(id);
        renderBoard();

        if (flipped.length === 2) {
            moves++;
            updateDisplay();
            checkMatch();
        }
    }


    function checkMatch() {
        const [first, second] = flipped;
        const isMatch = cards[first].emoji === cards[second].emoji;

        setTimeout(() => {
            if (isMatch) {
                cards[first].matched = true;
                cards[second].matched = true;
                matches++;
                showMessage(`✨ Match found! (${matches}/${difficulty === 'easy' ? 8 : 12})`, 'success');
                
                // Add extra visual feedback for matched cards
                const matchedCards = document.querySelectorAll('.card.matched');
                matchedCards[matchedCards.length - 2].style.animation = 'pulse 0.5s ease';
                matchedCards[matchedCards.length - 1].style.animation = 'pulse 0.5s ease';
            } else {
                cards[first].flipped = false;
                cards[second].flipped = false;
                showMessage('❌ No match! Try again.', 'error');
            }

            flipped = [];
            updateDisplay();
            renderBoard();


            if (matches === (difficulty === 'easy' ? 8 : 12)) {
                endGame();
            }
        }, 1000);
    }


    function updateDisplay() {
        movesDisplay.textContent = moves;
        matchesDisplay.textContent = matches;
        

        movesDisplay.style.animation = 'none';
        setTimeout(() => {
            movesDisplay.style.animation = 'pulse 0.3s ease';
        }, 10);
    }


    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = seconds + 's';
        }, 100);
    }


    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        

        let rating = '⭐⭐⭐⭐⭐';
        if (moves > 20) rating = '⭐⭐⭐';
        if (moves > 30) rating = '⭐⭐';
        
        showMessage(`🎉 YOU WON! ${rating}\n${moves} moves in ${seconds}s`, 'complete');
        startBtn.textContent = 'Play Again';
    }


    function resetGame() {
        gameActive = false;
        clearInterval(timerInterval);
        cards = [];
        flipped = [];
        matched = [];
        moves = 0;
        matches = 0;
        gameBoard.innerHTML = '';
        messageDisplay.textContent = '👋 Click "Start Game" to begin!';
        messageDisplay.className = 'message';
        movesDisplay.textContent = '0';
        matchesDisplay.textContent = '0';
        timerDisplay.textContent = '0s';
        startBtn.textContent = 'Start Game';
    }

  
    startBtn.addEventListener('click', initGame);
    resetBtn.addEventListener('click', resetGame);


    resetGame();
});