function $(id) {
    return document.getElementById(id);
}
function $$(element) {
	return document.createElement(element);
}
function setStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getStorage(key) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
}

//---------------------------------------------------init Search Field
$('search').oninput = function (e) {
    renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
};
function getCurrentSearchValue() {
	return $('search').value;
}

//---------------------------------------------------init Status Selector
$('status').onchange = function() {
	renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
};
fillStatusOptions();
function fillStatusOptions() {
	var statusOptions = ['all', 'open', 'done'];
	statusOptions.forEach(status => {
		var opt = $$('option');
		opt.value = status;
		opt.innerHTML = status;
		opt.name = 'status-' + status;
		$('status').appendChild(opt);
	});
}
function getCurrentStatus() {
	return $('status').options[$('status').options.selectedIndex].value;
}

//---------------------------------------------------init Priority Selector
$('priority').onchange = function() {
	renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
};
fillPriorityOptions();
function fillPriorityOptions() {
	var priorityOptions = ['all', 'high', 'normal', 'low'];
	priorityOptions.forEach(priority => {
		var opt = $$('option');
		opt.value = priority;
		opt.innerHTML = priority;
		opt.name = 'status-' + priority;
		$('priority').appendChild(opt);
	});
}
function getCurrentPriority() {
	return $('priority').options[$('priority').options.selectedIndex].value;
}

//---------------------------------------------------init Create Button
$('create-card-btn').onclick = function () {
    showTemplateCard();
};

//---------------------------------------------------draw cards on first loading
renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());

//---------------------------------------------------render functions, depend on selected filters
function renderCards(search, status, priority) {
	var tempCardsArray = [];
	cardsArray = getStorage('cards') || [];
    cardsArray.forEach( card => {
    	if (card.title.toLowerCase().includes(search.toLowerCase()) &&
			(card.status == status || status == 'all') &&
    		(card.priority == priority || priority == 'all'))
		tempCardsArray.push(genCardHTML(card.id, card.title, card.description, card.priority, card.status));
    });
    $('container').innerHTML = '';
    tempCardsArray.forEach( div => {
    	$('container').prepend(div);
    });
}
function genCardHTML(id, title, description, priority, status) {
	var baseDiv = $$('div');
    	baseDiv.id = id;
		baseDiv.className = status+'Card';
	var titleDiv = $$('div');
		titleDiv.name = titleDiv.className = 'title';
    var cardTitle = $$('p');
		cardTitle.innerHTML = title.length > 20 ? title.substring(0, 20) + '...' : title;
		titleDiv.appendChild(cardTitle);
	var statusImg = $$('div');
		statusImg.className = 'card-img-status';
		titleDiv.appendChild(statusImg);
	var descriptionDiv = $$('div');
		descriptionDiv.name = descriptionDiv.className = 'description';
    var cardDescriprion = $$('p');
		cardDescriprion.innerHTML = description.length > 140 ? description.substring(0, 140) + '...' : description;
		descriptionDiv.appendChild(cardDescriprion);
	var controlDiv = $$('div');
		controlDiv.name = controlDiv.className = 'control-panel';
    var cardPriority = $$('select');
    	cardPriority.name = cardPriority.className = 'priority';
    	let cardPriorityOptions = ['high', 'normal', 'low'];
		cardPriorityOptions.forEach(priority => {
			var opt = $$('option');
			opt.value = priority;
			opt.innerHTML = priority;
			opt.name = 'status-' + priority;
			cardPriority.appendChild(opt);
		});
    	for (var i = 0; i < cardPriority.length; i++) {
    		if (cardPriority.options[i].value == priority) cardPriority.options[i].selected = true;
		}
    	cardPriority.onchange = function (e) {
    		let cardsArray = getStorage('cards');
			cardsArray.forEach( card => {
				if(card.id == e.target.parentNode.parentNode.id) {
					card.priority = cardPriority.options[cardPriority.options.selectedIndex].value;
				}
			});
			setStorage('cards', cardsArray);
			renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
		};
	var invokeButtonsDiv = $$('div');
		invokeButtonsDiv.name = invokeButtonsDiv.className = 'invoke-buttons';
		invokeButtonsDiv.innerHTML = '...';
	var buttonsDiv = $$('div');
		buttonsDiv.name = buttonsDiv.className = 'card-buttons';
    var cardStatus = $$('button');
    	cardStatus.name = cardStatus.class = 'status';
    	cardStatus.innerHTML = status;
    	cardStatus.onclick = function (e) {
    		let cardsArray = getStorage('cards');
			cardsArray.forEach( card => {
				if(card.id == e.target.parentNode.parentNode.parentNode.parentNode.id) {
					card.status == 'open' ? card.status = 'done' : card.status = 'open';
				}
			});
			setStorage('cards', cardsArray);
			renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
    	};
    var cardEditBtn = $$('button');
    	cardEditBtn.name = cardEditBtn.class = 'edit-card-btn';
    	cardEditBtn.innerHTML = 'edit';
		cardEditBtn.onclick = function (e) {
			showTemplateCard(e.target.parentNode.parentNode.parentNode.parentNode.id);
		};
	var cardRemoveBtn = $$('button');
		cardRemoveBtn.name = 'remove-card';
		cardRemoveBtn.innerHTML = 'remove';
		cardRemoveBtn.onclick = function (e) {
			let cardsArray = getStorage('cards');
			cardsArray.forEach( card => {
				if (card.id == e.target.parentNode.parentNode.parentNode.parentNode.id) cardsArray.splice(cardsArray.indexOf(card), 1);
			});
			setStorage('cards', cardsArray);
			renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
		};
	buttonsDiv.appendChild(cardStatus);
	buttonsDiv.appendChild(cardEditBtn);
	buttonsDiv.appendChild(cardRemoveBtn);
	invokeButtonsDiv.appendChild(buttonsDiv);
	controlDiv.appendChild(cardPriority);
	controlDiv.appendChild(invokeButtonsDiv);
	baseDiv.appendChild(titleDiv);
	baseDiv.appendChild(descriptionDiv);
	baseDiv.appendChild(controlDiv);
    return baseDiv;
}

//Create new card functions--------------------------------------------------------------------------------------------------------
function CardConstructor(title, description, priority) {
    this.id = getStorage('counter') || 0;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = 'open';
}

function createObj() {
	let id, title, description, priority
	$('template').childNodes.forEach( element => {
		if (element.name == "edit") {
			id = element.id;
		}
		if (element.name == "title") {
			title = element.value;
		}
		if (element.name == "description") {
			description = element.value;
		}
		if (element.name == "card-priority") {
			priority = element.options[element.options.selectedIndex].value;
		}
	});
	if (title) {
		let cardsArray = getStorage('cards') || [];
		if (id) {
			cardsArray.forEach( card => {
				if (card.id == id) {
					card.title = title;
					card.description = description;
					card.priority = priority;
				}
			});
		} else {
			let cardObj = new CardConstructor(title, description, priority);
			setStorage('counter', cardObj.id + 1);
    		cardsArray.push(cardObj);
		}
    	setStorage('cards', cardsArray);
        hideTemplateCard();
        renderCards(getCurrentSearchValue(), getCurrentStatus(), getCurrentPriority());
    } else {
    	$('template-title').className = 'template-title-error';
    }
}

function hideTemplateCard() {
	$('template').childNodes.forEach( element => {
		if (element.name == 'title' || element.name == 'description') {
			element.value = '';
		} else if (element.name == 'card-priority') {
			element.options[0].selected = true;
		} else if (element.name == 'edit') {
			element.parentNode.removeChild(element);
		}
	});
    $('modalWindow').style.display = 'none';
}

function showTemplateCard(id) {
    $('modalWindow').style.display = 'block';    
    if (id) {
    	editOn = $$('span');
    	editOn.name = 'edit';
    	editOn.id = id;
		editOn.innerHTML = 'Edit Card';
		editOn.className = 'edit-title';
    	$('template').prepend(editOn);
    	let cardsArray = getStorage('cards');
    	cardsArray.forEach( card => {
				if (card.id == id) {
					$('template').childNodes.forEach( element => {
						if (element.name == "title") {
							element.value = card.title;
						}
						if (element.name == "description") {
							element.value = card.description;
						}						
						if (element.name == "card-priority") {
							for (var i = 0; i < element.options.length; i++) {
    							if (element.options[i].value == card.priority) element.options[i].selected = true;
							}
						}
					});
				}
			});
    }
}

$('template-title').oninput = function(){
	$('template-title').className = 'template-title';	
};

$('modalWindow').onclick = function () {
    if ($('modalWindow').style.display == 'block') hideTemplateCard();
};
$('templateLayer').onclick = function (e) {
    e.stopPropagation();
};

$('cancel').onclick = function () {
    if ($('modalWindow').style.display == 'block') hideTemplateCard();
};
$('save').onclick = function () {
    if ($('modalWindow').style.display == 'block') createObj();
};
