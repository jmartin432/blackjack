
function setBackground() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let color_string = r + ', ' + b + ', ' + g;
    let r_step = [-1, 1][Math.floor(Math.random() * 2)];
    let g_step = [-1, 1][Math.floor(Math.random() * 2)];
    let b_step = [-1, 1][Math.floor(Math.random() * 2)];

    requestAnimationFrame(rotateColor);

    function rotateColor() {

        if (r + r_step < 0) {
            r_step = 1;
        } else if (r + r_step > 255) {
            r_step = -1;
        }
        if (b + b_step < 0) {
            b_step = 1;
        } else if (b + b_step > 255) {
            b_step = -1;
        }
        if (g + g_step < 0) {
            g_step = 1;
        } else if (g + g_step > 255) {
            g_step = -1;
        }

        r += r_step;
        g += g_step;
        b += b_step;

        color_string = r + ', ' + g + ', ' + b;

        table.setAttribute('style', 'background: radial-gradient(rgb(' + color_string + '), black)');
        requestAnimationFrame(rotateColor);
    }
}

function makeDeck() {
    let vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let suits = ['H', 'C', 'D', 'S'];
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 4; j++) {
            deck.push(vals[i] + suits[j]);
        }
    }
    console.log(deck);
}

function shuffleDeck(array) {
    let index = -1;
    let temp = '';

    // While there remain elements to shuffle...
    for (let i = 0; i < array.length; i++) {
        index = Math.floor(Math.random() * array.length);
        temp = array[i];
        array[i] = array[index];
        array[index] = temp;

    }
    console.log(array);
    return array;
}

function placeDeck(array) {
    let card_number = 0;
    let id_string = '';
    let img_string = '';
    let card_div;
    let face_div;
    let back_div;
    let img;
    for (let i = 0; i < array.length; i++) {
        card_number = i;
        id_string = array[i];
        img_string = 'images/' + array[i] + '.jpg';
        //create card container, card_div
        //create face_div
        // create back_div
        card_div = document.createElement('div');
        card_div.setAttribute('id', id_string);
        card_div.classList.add('card');

        face_div = document.createElement('div');
        face_div.classList.add('front');
        img = document.createElement("img");
        img.src = 'images/' + array[i] + '.jpg';
        face_div.appendChild(img);

        back_div = document.createElement('div');
        back_div.classList.add('back');

        card_div.appendChild(face_div);
        card_div.appendChild(back_div);
        table.appendChild(card_div);
    }
}

function dealPlayer() {
    let left = (200 + 60 * (player_count + 1)) + 'px';
    let card = document.getElementById(play_deck[card_count]);
    let face_value = play_deck[card_count].slice(0, -1);
    if (['J', "Q", 'K'].indexOf(face_value) > -1) {
        face_value = 10;
    } else if (face_value === 'A') {
        face_value = 11;
    } else {
        face_value = parseInt(face_value);
    }
    player_hand.push(face_value);
    player_score = player_hand.reduce(function (a, b) {
        return a + b;
    }, 0);
    if (player_score > 21) {
        if (player_hand.indexOf(11) > -1) {
            let index = player_hand.indexOf(11);
            player_hand[index] = 1;
            player_score = player_hand.reduce(function (a, b) {
                return a + b;
            }, 0);
        } else {
            player_message.innerText = 'You busted.';
            player_done = true;
            bt_hit.disabled = true;
            bt_stay.disabled = true;
            bt_next.disabled = false;
        }
    }
    if (player_score === 21 && player_hand.length === 2) {
        player_message.innerText = 'You got BlackJack.';
        player_done = true;
        bt_hit.disabled = true;
        bt_stay.disabled = true;
        bt_next.disabled = false;
    }

    console.log(player_hand);
    console.log(player_score);
    card.classList.add('dealt');
    card.style['top'] = '160px';
    card.style['left'] = left;
    card_count += 1;
    player_count += 1;
}

function dealDealer() {
    let left = (200 + 60 * (dealer_count + 1)) + 'px';
    let card = document.getElementById(play_deck[card_count]);
    let face_value = play_deck[card_count].slice(0, -1);
    if (['J', "Q", 'K'].indexOf(face_value) > -1) {
        face_value = 10;
    } else if (face_value === 'A') {
        face_value = 11;
    } else {
        face_value = parseInt(face_value);
    }
    dealer_hand.push(face_value);
    dealer_score = dealer_hand.reduce(function (a, b) {
        return a + b;
    }, 0);
    if (dealer_score > 21) {
        if (dealer_hand.indexOf(11) > -1) {
            let index = dealer_hand.indexOf(11);
            dealer_hand[index] = 1;
            dealer_score = dealer_hand.reduce(function (a, b) {
                return a + b;
            }, 0);
        } else {
            dealer_message.innerText = 'Dealer busted!'
        }
    }
    console.log(dealer_hand);
    console.log(dealer_score);
    card.classList.add('dealt');
    card.style['top'] = '460px';
    card.style['left'] = left;
    card_count += 1;
    dealer_count += 1;
}

function advisePlayer() {
    if (player_score >= 17 && player_score <= 21) {
        player_message.innerText = 'You should stay.';
    } else if (player_score < 17) {
        player_message.innerText = 'You should hit.';
    }
}

function nextTurn() {
    if (this.innerText === 'Stay') {
        bt_stay.disabled = true;
        bt_hit.disabled = true;
        bt_next.disabled = false;
        player_done = true;
    } else if (this.innerText === "Hit") {
        dealPlayer();
        advisePlayer();
    }

    if (dealer_score < 17) {
        dealer_message.innerText = 'Dealer takes a hit.';
        dealDealer();
    } else if (dealer_score >= 17 && dealer_score <= 21) {
        dealer_message.innerText = 'Dealer stays.';
        dealer_done = true;
    } else if (dealer_score > 21) {
        dealer_message.innerText = 'Dealer busted.';
        dealer_done = true;
    }

    if (player_done && dealer_done) {
        if (player_message.innerText === 'You got BlackJack') {
            alert('You win!');
        } else if (player_score <= 21 && player_score >= dealer_score) {
            alert('You win!');
        } else if (player_score <= 21 && dealer_score > 21) {
            alert('You win!');
        } else if (player_score > 21 && dealer_score > 21) {
            alert('You both busted');
        } else if (dealer_score <= 21 && dealer_score > player_score) {
            alert('Dealer wins!');
        } else if (dealer_score <= 21 && player_score > 21) {
            alert('Dealer wins!');
        }
    }
}

function initializeGame() {
    table = document.querySelector('#table');
    player_message = document.querySelector('#player_message');
    dealer_message = document.querySelector('#dealer_message');
    bt_hit = document.querySelector('#bt_hit');
    bt_stay = document.querySelector('#bt_stay');
    bt_next = document.querySelector('#bt_next');
    console.log(bt_hit, bt_stay, bt_next);
    bt_hit.onclick = nextTurn;
    bt_stay.onclick = nextTurn;
    bt_next.onclick = nextTurn;
    console.log(bt_hit, bt_stay, bt_next);
    bt_hit.disabled = false;
    bt_stay.disabled = false;
    bt_next.disabled = true;

    setBackground();
    makeDeck();
    play_deck = shuffleDeck(deck);
    placeDeck(play_deck);

    setTimeout(dealPlayer, 1000);
    setTimeout(dealDealer, 1500);
    setTimeout(dealPlayer, 2000);
    setTimeout(dealDealer, 2500);
    setTimeout(advisePlayer, 2500);
}

//Play BlackJack!
let table;
let deck = [];
let play_deck = [];
let player_count = 0;
let dealer_count = 0;
let card_count = 0;
let dealer_hand = [];
let player_hand = [];
let player_score = 0;
let dealer_score = 0;
let player_done = false;
let dealer_done = false;
let player_message;
let dealer_message;
let bt_hit;
let bt_stay;
let bt_next;

window.onload = initializeGame;

