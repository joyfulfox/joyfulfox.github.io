document.querySelector('.my-cv .cv-link').addEventListener('click', modalWindowCV, false);
var modalWindow = document.querySelector('.modalWindowCV');
modalWindow.addEventListener('click', closeModalWindow, false);

function modalWindowCV(){
    modalWindow.style.display = 'block';
}

function closeModalWindow(){
    modalWindow.style.display = 'none';
    document.querySelector('.cv-layer').addEventListener('click', function(e){
        e.stopPropagation();
    },false);
}