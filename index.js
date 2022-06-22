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
    
     let c1v = data.cards[0]
     let c2v = data.cards[1]
     let c3v = data.cards[2]
     let c4v = data.cards[3]

     let cardValues = [c1v, c2v, c3v, c4v]

     cardValues.forEach(ele => faceCardFixer(ele))
        
        function faceCardFixer(ele) {
        if(ele.value === "ACE") {
            console.log(ele)
            alert("Click Ace and choose 1 or 11")
            let oneBtn = document.createElement("button")
            oneBtn.innerHTML = "One"
            let elevenBtn = document.createElement("button")
            elevenBtn.innerHTML = "Eleven"
            let btnDiv = document.querySelector("#one-or-eleven")
            btnDiv.append(oneBtn, elevenBtn)

            oneBtn.addEventListener("click", function(event) {
                return ele.value = 1
            }, {once: true})
            elevenBtn.addEventListener("click", function(event) {
                return ele.value = 11
            }, {once: true})
             
           
        } else if(ele.value === "KING" || ele.value === "QUEEN" || ele.value === "JACK") {
            console.log(ele)
            return ele.value = 10
        } else 
            return ele.value
     }
     
    
    let playerHand = [player1, player2];
    let pValue = 0;
    
    for(let counter = 0; counter < playerHand.length; counter++){
        pValue += parseInt(cardValues[counter].value);
    }
    let playerCount = document.querySelector('#playerCount');
    playerCount.textContent = pValue;

    


    let dealer1 = document.querySelector('#ai1');
    let dealer2 = document.querySelector('#ai2');


    dealer1.src = data.cards[2].image;
    dealer2.src = "https://opengameart.org/sites/default/files/card%20back%20black.png";

    let dValue = 0;
    for(let counter = 2; counter < data.cards.length; counter++){
        dValue += parseInt(cardValues[counter].value);
    }
    let dealerCount = document.querySelector("#dealerCount")
    dealerCount.textContent = dValue

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

        faceCardFixer(data.cards[0])
        
        pValue += parseInt(data.cards[0].value)
        playerCount.textContent = pValue;
        })
    })
}

let betForm = document.querySelector("#bet-form")
betForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let betDisplay = document.querySelector("#bet-display")
    let betAmount = document.querySelector("#bet-amount").value
    betDisplay.textContent = `$${betAmount} racks`

    let purseDisplay = document.querySelector("#purse-display")
    let purseDisplayAmount = parseInt(purseDisplay.textContent)
    console.log(purseDisplayAmount)
    console.log(betAmount)
    purseDisplayAmount -= betAmount
    //console.log(purseDisplayAmount)
    purseDisplay.textContent = `$${purseDisplayAmount}`
})






   
