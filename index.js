let purseDisplay = document.querySelector("#purse-display")
let purseDisplayAmount;
let betDisplay = document.querySelector("#bet-display")
let betAmount;
let betForm = document.querySelector("#bet-form")

fetch("http://localhost:3000/purse")
.then(res => res.json())
.then (purse => {
    console.log(purse)
    purseDisplayAmount = (purse[0].amount)
    console.log(purseDisplayAmount)
    purseDisplay.textContent = purseDisplayAmount
})



betForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let betDisplay = document.querySelector("#bet-display")
    betAmount = document.querySelector("#bet-amount").value

    if(parseInt(betAmount) > parseInt(purseDisplayAmount)){
        alert("YOU DON'T HAVE THAT MUCH MONEY!!!");
    }
    else{
        purseDisplayAmount -= betAmount
        purseDisplay.textContent = purseDisplayAmount
        betDisplay.textContent = parseInt(betDisplay.textContent) + parseInt(betAmount)
    }
    //$('#'+place_bet).prop("disabled",true);
    betForm.reset();
})

let deal = document.querySelector('#deal');
deal.addEventListener('click', function(event){
fetch('http://deckofcardsapi.com/api/deck/new/draw/?count=10')
.then(res => res.json())
.then(data => {
    if (!betAmount){
        alert("Place a real wager")
    } else {
    renderCards(data)
    }
});

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

    let dealer1 = document.querySelector('#ai1');
    let dealer2 = document.querySelector('#ai2');

    dealer1.src = data.cards[2].image;
    dealer2.src = "https://opengameart.org/sites/default/files/card%20back%20black.png";

    data.cards.forEach((ele) => faceCardFixer(ele))
    
    let c1v = data.cards[0]
    let c2v = data.cards[1]
    let c3v = data.cards[2]
    let c4v = data.cards[3]

    let cardValues = [c1v, c2v, c3v, c4v]

    let pValue = 0;
    for(let counter = 0; counter < 2; counter++){
        pValue += parseInt(cardValues[counter].value);
    }
    let playerCount = document.querySelector('#playerCount');
    playerCount.textContent = pValue;

    let dValue = 0;
    for(let counter = 2; counter < 4; counter++){
        
        dValue += parseInt(cardValues[counter].value);
    }
    let dealerCount = document.querySelector("#dealerCount")
    //dealerCount.textContent = dValue

    console.log(pValue)

    let playerHand = [data.cards[0], data.cards[1]];
    let dealerHand = [data.cards[2], data.cards[3]];

    let found = false;
    let hitMe = document.querySelector('#hit-me');
    hitMe.addEventListener('click', function(event){
        player2.src = data.cards[1].image;
        fetch(`http://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
        let newCard = document.createElement('img');
        newCard.src = data.cards[0].image;
        let playerDiv = document.querySelector('#player-div');
        playerDiv.append(newCard);
        
        faceCardFixer(data.cards[0])

        playerHand.push(data.cards[0])
        
        pValue += parseInt(data.cards[0].value)
        playerCount.textContent = pValue;

        let playerHandValues = playerHand.map(card => card.value)
        
            if (pValue > 21 && found === false && playerHandValues.includes('11') === true) {
                found = true
                pValue -=10;
                playerCount.textContent = pValue;
            }
            if (pValue > 21) {
                alert("You busted!!! Click Shuffle")
                let purseL = {
                    amount: purseDisplayAmount
                }
                prusePatcher(purseL)
            }
            })
    })

    let find = false;
    let standBtn = document.querySelector("#stand")
    standBtn.addEventListener("click", function(event) {
        while(dValue < 17) {
            let i = 4
            let newCard = document.createElement('img');
            newCard.src = data.cards[i].image;
            let dealerDiv = document.querySelector('#ai-div');
            dealerDiv.append(newCard);
            dealerHand.push(data.cards[i])
            console.log(data.cards[i].value)
            dValue += parseInt(data.cards[i].value)
            ++i
            let dealerHandValues = dealerHand.map(card => card.value)
        
            if (dValue > 21 && find === false && dealerHandValues.includes('11') === true) {
                find = true
                dValue -=10;
                dealerCount.textContent = dValue;
            }
        }
        
            dealer2.src = data.cards[3].image;
            player2.src = data.cards[1].image;
            dealerCount.textContent = dValue;

            
            if(pValue > 21) {
                alert("Um... you busted, click Shuffle")
            } else if(dValue < 22 && dValue >= pValue) {
                    alert("The House always wins! Click Shuffle")
                    betDisplay.textContent = ""
                    let purseL = {
                        amount: purseDisplayAmount
                    }
                    prusePatcher(purseL)
            } else if (dValue < 22 && pValue > dValue) {
                    alert("You Win!!!")
                    purseDisplay.textContent = `${(betAmount * 2) + purseDisplayAmount}`
                    betDisplay.textContent = ""
                    let purseW = {
                        amount: purseDisplay.textContent
                    }
                    prusePatcher(purseW) 
            }else {
                alert("Dealer busts, You win!")
                purseDisplay.textContent = `${(betAmount * 2) + purseDisplayAmount}`
                betDisplay.textContent = ""
                let purseW = {
                    amount: purseDisplay.textContent
                }
                prusePatcher(purseW)
            }
        
        
    })
}

function prusePatcher(purseObj) {
    fetch("http://localhost:3000/purse/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(purseObj)
    })
    .then(res => res.json())
    .then(purse => console.log(purse))
}

function faceCardFixer(ele) {
    if(ele.value === "ACE") {
          return ele.value = '11'
     } else if(ele.value === "KING" || ele.value === "QUEEN" || ele.value === "JACK") {
         return ele.value = '10'
     } else 
         return ele.value
  }
