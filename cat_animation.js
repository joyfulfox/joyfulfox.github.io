var card1 = document.querySelector('.projects .card1');
var card2 = document.querySelector('.projects .card2');
card1.addEventListener('click', walkingCatFunc, false);
card2.addEventListener('click', flyingCatFunc, false);
var leftPos = -120;
var rightPos = -120;
var validWalkingCat = true;
var validFlyingCat = true;

var walkingCat = document.querySelector('.walkingCat');
var flyingCat = document.querySelector('.flyingCat');
function walkingCatFunc() {

    if (validWalkingCat == true) {
        let walkingInterval = setInterval(walking, 10);
        validWalkingCat = false;
        if (validCardsPos == false) {
            card1.style.left = 20 + '%';
            card1.style.transform = 'rotate(0deg)';
            card2.style.right = 20 + '%';
            card2.style.transform = 'rotate(0deg)';
            validCardsPos = true;
        }
        document.querySelector(".projects .card1").className = 'card1Active';
        setTimeout(() => { clearInterval(walkingInterval), validWalkingCat = true, leftPos = -120; }, 3500);
    }
}
function walking() {
    walkingCat.style.left = leftPos + '%';
    leftPos += 1.5;
}
function flyingCatFunc() {
    if (validFlyingCat == true) {
        let flyingInterval = setInterval(flying, 10);
        validFlyingCat = false;
        if (validCardsPos == false) {
            card1.style.left = 20 + '%';
            card1.style.transform = 'rotate(0deg)';
            card2.style.right = 20 + '%';
            card2.style.transform = 'rotate(0deg)';
            validCardsPos = true;
        }
        document.querySelector(".projects .card2").className = 'card2Active';
        setTimeout(() => { clearInterval(flyingInterval), validFlyingCat = true, rightPos = -120; }, 3500);
    }
}
function flying() {
    flyingCat.style.right = rightPos + '%';
    rightPos += 1.5;
}

//------------------cat in the wall
document.querySelector('.cat-in-the-wall').addEventListener('click', changeCardsPos, false);
var validCardsPos = true;

function changeCardsPos() {
    if (validCardsPos == true) {
        card1.style.left = 60 + '%';
        card1.style.transform = 'rotate(360deg)';
        card2.style.right = 60 + '%';
        card2.style.transform = 'rotate(-360deg)';
        validCardsPos = false;
    } else {
        card1.style.left = 20 + '%';
        card1.style.transform = 'rotate(0deg)';
        card2.style.right = 20 + '%';
        card2.style.transform = 'rotate(0deg)';
        validCardsPos = true;
    }
}