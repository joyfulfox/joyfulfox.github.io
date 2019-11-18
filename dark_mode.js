var toggleBtn = document.getElementById('toggle-button-day-mode');
toggleBtn.addEventListener('click', changeLightMode, false);
document.getElementById('whiteCat').addEventListener('click', changeLightMode, false);

function changeLightMode(){
    if(toggleBtn.className == 'toggle-button-day-mode'){
        toggleBtn.className = 'toggle-button-night-mode';
        document.getElementById('container').className = 'containerDark';
    }else{
        toggleBtn.className = 'toggle-button-day-mode';
        document.getElementById('container').className = 'container';
    }
}