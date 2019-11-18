var I = {};
var create = $('create-new-card');
var search = $('search');
var popUpErr = $('popUp-err');
if (getStorage('cards')) {
    var arr = getStorage('cards');
} else {
    var arr = [];
}
if (getStorage('counter')) {
    var counter = getStorage('counter');
} else {
    var counter = 0;
}
var status = 'all';
var priority = 'all';
renderCards(arr);

function $(id) {
    return document.getElementById(id);
}

//Pattern card----------------------------------------------------------------------------------------------------------------
function htmlCode(title, priority, description, status, id) {

    return `
<div class='card' id='${id}'>
    <div class='text-fields-parent-div' name='text-fields-parent-div' onfocusin='focused(this)' onfocusout='lostFocus(this)' tabindex='0'>
        <div class='priority-list' name='priority-list'>
            <img src='img/${priority}.png' name='${priority}' class='priority-active' alt='${priority}' title='${priority}'>
            <img src='img/high.png' name='high' class='priority' onclick='changePriority(this)' alt='high' title='high'>
            <img src='img/normal.png' name='normal' class='priority' onclick='changePriority(this)' alt='normal' title='normal'>
            <img src='img/low.png' name='low' class='priority' onclick='changePriority(this)' alt='low' title='low'>
        </div>
        <input name='title' type="text" oninput='dynamicSaveText(this)' value='${title}'>
        <textarea name='description' class='oldSize' oninput='dynamicSaveText(this)'>${description}</textarea> <br>
    </div>
    <div class='del-Parent-Div' name='del-Parent-Div'>
        <img name='remove' class='delete' onclick='removeCard(this)' src='img/remove.png' alt='delete' title='delete'> <br>
    </div>
    <div name='parent-status'>
        <button name="status" onclick="changeStatus(this)" class='statusOpen' value='${status}'>${status}</button>
    </div>
</div>`
}

//Filter priority, status and search-----------------------------------------------------------------------------------------------
function validStatusFilter() {
    let s_parent = $('status');
    let s_items = document.getElementsByName('status-item');
    for (i = 0; i < s_items.length; i++) {
        if (s_parent.children[i].selected) {
            status = s_parent.children[i].value;
            return s_parent.children[i].value;
        }
    }
}

function validPriorityFilter() {
    let p_parent = $('priority');
    let p_items = document.getElementsByName('priority-item');
    for (i = 0; i < p_items.length; i++) {
        if (p_parent.children[i].selected) {
            priority = p_parent.children[i].value;
            return p_parent.children[i].value;
        }
    }
}

function statusFilter() {
    removeAllCards();
    validStatusFilter();
    renderCards(arr);
}

function priorityFilter() {
    removeAllCards();
    validPriorityFilter();
    renderCards(arr);
}

search.oninput = function (e) {
    let arr1 = [];
    arr.forEach(el => {
        if (el.title.toLowerCase().includes(e.target.value.toLowerCase())) {
            arr1.push(el);
        }
    });
    removeAllCards();
    validPriorityFilter();
    validStatusFilter();
    renderCards(arr1);
};

function changing(e, high, normal, low) {
    e.removeAttribute('class');
    e.classList.add('priority-active');
    e.parentNode.children[normal].removeAttribute('class');
    e.parentNode.children[normal].classList.add('priority');
    e.parentNode.children[low].removeAttribute('class');
    e.parentNode.children[low].classList.add('priority');
}

function changePriority(e) {
    arr.forEach(el => {
        if (el.id == e.parentNode.parentNode.parentNode.id) {
            el.priority = e.name;
            e.parentNode.children[0].src = `img/${e.name}.png`;
        }
    });
    setStorage('cards', arr);
    validPriorityFilter();
    validStatusFilter();
}

//Focused and lost focus--------------------------------------------------------------------------------------------------

function dynamicSaveText(e) {
    arr.forEach(el => {
        if (el.id == e.parentNode.parentNode.id) {
            if (e.name == 'title') {
                el.title = e.value;
            } else if (e.name == 'description') {
                el.description = e.value;
            }
        }
    });
    setStorage('cards', arr);
}

function lostFocus(e) {
    if (e.children['del-Parent-Div']) {
        e.parentNode.appendChild(e.children['del-Parent-Div']);
    }
    e.style.width = 150 + 'px';
    e.children['description'].classList.remove('newSize');
    e.children['description'].classList.add('oldSize');
    e.children['description'].scrollTop = 0;
}

function focused(e) {
    if (e.parentNode.children['del-Parent-Div']) {
        let el = e.parentNode.children['del-Parent-Div'];
        e.appendChild(el);
    }
    e.style.width = 20 + 'em';
    e.children['description'].classList.remove('oldSize');
    e.children['description'].classList.add('newSize');
}
//Remove card----------------------------------------------------------------------------------------------------------------------
function removeCard(e) {
    if (e.parentNode.parentNode.id) {
        let delParentDiv = e.parentNode;
        let textFieldsParentDiv = e.parentNode.parentNode.children['text-fields-parent-div'];
        textFieldsParentDiv.appendChild(delParentDiv);
    }
    arr.forEach(el => {
        if (e.parentNode.parentNode.parentNode.id == el.id) {
            e.parentNode.parentNode.parentNode.classList.add('deleteAnimation');
            setTimeout(() => {
                removeArrayElement(arr, el);
                setStorage('cards', arr);
                priorityFilter();
                statusFilter();
            }, 500);
        }
    });
}

//local storage--------------------------------------------------------------------------------------------------------------------
function setStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getStorage(key) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
}

function removeArrayElement(arr, index) {
    let idx = arr.indexOf(index);
    if (idx != -1) arr.splice(idx, 1);

}

//Change status onclick-----------------------------------------------------------------------------------------------------------
function changeStatus(e) {
    arr.forEach(el => {
        el.id == e.parentNode.parentNode.id ? (el.status == 'open' ? el.status = 'done' : el.status =
            'open') : false;
    });

    setStorage('cards', arr);
    priorityFilter();
    statusFilter();
    validStatusStyle();
}

function validStatusStyle() {
    let cards = document.querySelectorAll('.card');
    for (it = 0; it < cards.length; it++) {
        let elem = cards[it].children['parent-status'].children['status'];
        if (elem.value == 'done') {
            elem.removeAttribute('class');
            elem.classList.add('statusDone');
        }else{
            elem.removeAttribute('class');
            elem.classList.add('statusOpen');
        }
    }
}
//Create new card functions--------------------------------------------------------------------------------------------------------
function CardConstructor(Title, Description, Priority) {
    this.title = Title;
    this.description = Description;
    this.priority = Priority;
    this.id = counter;
    this.status = 'open';
    counter++;
    setStorage('counter', counter);
}

function catchPriority() {
    let elem = document.querySelector(".template");
    let options = elem.getElementsByTagName('option');
    for (i = 0; i < options.length; i++) {
        if (options[i].selected) {
            if (options[i].value == "Priority") {
                return "normal";
            } else {
                return options[i].value;
            }
        }
    }
}

function createNewObj() {
    let elem = document.querySelector(".template");

    if (elem) {

        let title = elem.getElementsByTagName('input')[0].value;
        let description = elem.getElementsByTagName('textarea')[0].value;
        let priority = catchPriority();
        let id = counter;
        let cardObj = new CardConstructor(title, description, priority, id);

        return cardObj;
    }
}

function setPriorityIcon() {
    let newCard = document.querySelector('.template');
    let option = newCard.getElementsByTagName('option');
    for (i = 0; i < option.length; i++) {
        if (option[i].selected.value == 'Priority' || option[i].selected.value == 'normal') {
            return PriorityIcon.normal;
        } else if (option[i].selected.value = 'high') {
            return PriorityIcon.high;
        } else {
            return PriorityIcon.low;
        }
    }
}

function validateCardTitle(title) {
    if (title == '') {
        return false;
    } else {
        return true;
    }
}

function removeAllCards() {
    let allCards = document.querySelectorAll('.card');
    for (i = 0; i < allCards.length; i++) {
        allCards[i].remove();
    }
}

function partialRender() {
    if (priority == 'all') {
        if (card.title.toLowerCase().includes(search.value.toLowerCase())) {
            create.insertAdjacentHTML('afterend', htmlCode(card.title, card.priority, card.description,
                card.status, card.id));
        }
    } else if (card.priority == priority) {
        if (card.title.toLowerCase().includes(search.value.toLowerCase())) {
            create.insertAdjacentHTML('afterend', htmlCode(card.title, card.priority, card.description,
                card.status, card.id));
        }
    }
}

function renderCards(arr) {
    let template = document.querySelector('.template');
    for (i = 0; i < arr.length; i++) {
        card = arr[i];
        if (status == 'all') {
            partialRender();
            validStatusStyle();
        } else if (card.status == status) {
            partialRender();
            validStatusStyle();
        }

    }
    template.getElementsByTagName('input')[0].value = '';
    template.getElementsByTagName('textarea')[0].value = '';

    let option = template.getElementsByTagName('option');
    for (i = 0; i < option.length; i++) {
        option[i].removeAttribute('selected');
    }
    template.getElementsByTagName('option')[0].setAttribute("selected", 'true');
}


create.onclick = function () {

    let card = createNewObj();
    let valid = validateCardTitle(card.title);
    if (valid) {
        $('addImg').style.transform += 'rotate(360deg)';
        arr.push(card);
        priorityFilter();
        statusFilter();
        setStorage('cards', arr);
        getStorage('cards');
    } else {
        popUpErr.style.opacity = 1;
        setTimeout(() => {
            popUpErr.style.opacity = 0;
        }, 2000);
    }
};