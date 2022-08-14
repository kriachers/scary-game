class AudioController {
    constructor() {
        this.bgMusic = new Audio('./Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('./Assets/Audio/flip.wav');
        this.matchSound = new Audio('./Assets/Audio/match.wav');
        this.victorySound = new Audio('./Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('./Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    flip() {
        this.flipSound.play();
    }

    match() {
        this.matchSound.play();
    }

    victory() {
        this.stopMusic();
        this.victorySound.play();
    }

    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }

    // victory() {
    //     clearInterval(this.countDown);
    //     this.AudioController.victory();
    //     document.getElementById('victory-text').classList.add('visible');
    // }

}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.AudioController = new AudioController();
    } 

    startGame() {
        this.cardsToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.AudioController.startMusic();
            this.shuffleCrds();  
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500)

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }





    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countDown);
        this.AudioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    flipCard(card) {
        if(this.camFlipCard(card)) {
            this.AudioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
     else 
        this.cardMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.AudioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countDown);
        this.AudioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        this.AudioController.victory();
        document.getElementById('victory-text').classList.add('visible');
        this.hideCards(); 
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    shuffleCrds(){
        for(let i = this.cardsArray.length -1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    camFlipCard(card) {
        // return true;
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardsToCheck)
    }

}

function ready() {

let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let game = new MixOrMatch(100, cards);

overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        game.startGame();
    });
});

cards.forEach(card => {
    card.addEventListener('click', () => {
        game.flipCard(card);
    });
});

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

// let AudioController = new AudioController();
// AudioController.startMusic();