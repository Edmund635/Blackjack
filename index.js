let deal = document.querySelector('#deal');
deal.addEventListener('click', function(event){
fetch('http://deckofcardsapi.com/api/deck/new/draw/?count=4')
.then(res => res.json())
.then(data=> renderCards(data));
})

function renderCards(data){
    console.log(data);
    let player1 = document.querySelector('#player1');
    player1.src = data.cards[0].image;
    let player2 = document.querySelector('#player2');
    player2.src = "https://opengameart.org/sites/default/files/card%20back%20black.png";
    player2.addEventListener("mouseenter", () => {
    player2.src = data.cards[1].image;
    })
    player2.addEventListener("mouseleave", () => {
        player2.src = "https://opengameart.org/sites/default/files/card%20back%20black.png"
    })
    let playerHand = [player1, player2];
    let value = 0;
    for(let counter = 0; counter < playerHand.length; counter++){
        value += parseInt(data.cards[counter].value);
    }
    let playerCount = document.querySelector('#playerCount');
    playerCount.textContent = value;
    let dealer1 = document.querySelector('#ai1');
    let dealer2 = document.querySelector('#ai2');
    dealer1.src = data.cards[2].image;
    dealer2.src = "https://opengameart.org/sites/default/files/card%20back%20black.png";
    let revealButton = document.querySelector('.reveal');
    revealButton.addEventListener('click', function(event){
        dealer2.src = data.cards[3].image;
        player2.src = data.cards[1].image;
    })
    let hitMe = document.querySelector('#hit-me');
    hitMe.addEventListener('click', function(event){
        fetch(`http://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
        let newCard = document.createElement('img');
        newCard.src = data.cards[0].image;
        let playerDiv = document.querySelector('#player-div');
        playerDiv.append(newCard);
        })
    })
}


   
