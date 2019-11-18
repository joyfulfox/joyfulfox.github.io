document.querySelector('.projects .card1').addEventListener('click', followingLink1, false);
document.querySelector('.projects .card2').addEventListener('click', followingLink2, false);

function followingLink1(){
    setTimeout(firstLink, 1500);
}

function followingLink2(){
    setTimeout(secondLink, 1500);
}

function firstLink(){
    return location.href = 'test_ciklum_1/index.html';
}

function secondLink(){
    return location.href = 'test_ciklum_2/index.html';

}