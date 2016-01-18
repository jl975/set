'use strict';

// const ORIGIN = window.location.href;
// const socket = io.connect(ORIGIN);
const socket = io();

function xTilt(deg) {
	console.log(document.getElementsByClassName('cards-wrapper')[0].style.transform);
	$('.cards-wrapper').css({'transform': `rotateX(${deg}deg)`});
}
function yTilt(deg) {
	$('.cards-wrapper').css({'transform': `rotateY(${deg}deg)`});
}


$(document).ready(() => {

	const NUMBERS = [1, 2, 3];
	const COLORS = ['red', 'green', 'purple'];
	const SHAPES = ['diamond', 'squiggle', 'oval'];
	const SHADINGS = ['solid', 'striped', 'open'];


	var deck = [];
	var selectedCards = [];
	var players = [];

	var my;


	$('.chat-input').on('keydown', function(e) {
		if (e.keyCode == 13) {
			sendChatMessage();
		}
	});


	/** Socket stuff */

	function sendChatMessage() {
		const $input = $('.chat-input');

		$('.chat-messages').append(`<li class="chat-message sent-by-me" data-player="${socket.id}">${my.name}: ${$input.val()}</li>`);
		socket.emit('send-message', {
			message: $input.val(),
			senderId: socket.id
		});

		// UX
		chatScrollToBottom();
		$input.val('');	
		return false;	
	}

	socket.on('player-info', data => {
		my = data;
	});

	socket.on('receive-message', data => {
		$('.chat-messages').append(`<li class="chat-message sent-by-other" data-player="${data.senderId}">${data.senderName}: ${data.message}</li>`);
		chatScrollToBottom();
	});
	socket.on('player-connect', data => {
		$('.chat-messages').append(`<li class="chat-message server-message">${data.playerName} has connected.</li>`);
		chatScrollToBottom();
	});
	socket.on('player-disconnect', data => {
		$('.chat-messages').append(`<li class="chat-message server-message">${data.playerName} has disconnected.</li>`);
		chatScrollToBottom();
	});

	function chatScrollToBottom() {
		$('.chat-message-container').scrollTop($('.chat-message-container').prop('scrollHeight'));
	}

	/** End socket stuff */


	function setupPlayers() {
		players.push({
			name: 'Rick',
			score: 0
		}, {
			name: 'Morty',
			score: 0
		});

		const $playerList = $('.player-list');

		players.forEach((player, idx) => {
			const playerNum = idx+1;
			const playerName = player.name || `Player ${playerNum}`;

			let scoreElement
				= `<li>`
					+ `<label>${playerName}:&nbsp;</label>`
					+ `<span class="score p${playerNum}-score">${players[idx].score}</span>`
				+ `</li>`;

			$playerList.append(scoreElement);
		})
	}


	function setupDeck() {
		deck = [];
		var cardId = 1;

		NUMBERS.forEach(number => {
			COLORS.forEach(color => {
				SHAPES.forEach(shape => {
					SHADINGS.forEach(shading => {
						(id => {
							deck.push({number, color, shape, shading, id});
						})(cardId);
						cardId++;
					})
				})
			})
		});

		$('.cards-left').text(deck.length);

		shuffleDeck();

		// deck = deck.slice(0, 15);

		$('.btn-shuffle').click(() => {
			shuffleDeck();
			distributeCards();
		});

		$('.btn-add3').click(() => {
			distributeExtraRow();
		});

		$('.btn-checksets').click(() => {
			checkNumberOfSets();
		});

		// $('#xtilt').change(function() {
		// 	$('.cards-wrapper').css({'transform': `rotateX(${$(this).val()}deg)`});
		// })
	}








	function shuffleDeck() {
		let temp = deck.slice();
		deck = [];
		while (temp.length) {
			deck.push(temp.splice(Math.floor(Math.random()*temp.length), 1)[0]);
		}


	}

	function renderSVG(number, color, shape, shading) {
		let group = `<div class="shape-wrapper-${number}">`;

		for (let i=0; i<number; i++) {
			let element = `<svg class="shape">`;

			var fill, shapeElement;
			if (shading === 'striped') {
				let stripes 
					= `<defs>`
						+ `<pattern id="${color}-dashed" width="1" height="6" patternUnits="userSpaceOnUse">`
							+ `<polygon points="50,1 0,1 0,0 50,0" style="stroke: ${color}" />`
						+ `</pattern>`
					+ `</defs>`;
				element += stripes;
				fill = `url(#${color}-dashed)`;
			}
			else fill = (shading === 'solid') ? color : 'transparent';

			if (shape === 'oval') {
				shapeElement = `<rect x="0" y="0" width="50" height="100" rx="25" fill="${fill}" stroke="${color}" stroke-width="4" />`;
			}
			else if (shape === 'diamond') {
				shapeElement = `<polygon points="25,0 0,50 25,100, 50,50" fill="${fill}" stroke="${color}" stroke-width="4" />`;
			}
			else if (shape === 'squiggle') {
				shapeElement = `<g><path class="st0" d="M0.7,11.2C0.5,8.7,1.8,6.6,2.2,5.9c4.2-6.4,18-7.7,28.3-3.5c5.8,2.3,9,5.7,9.6,6.5c3.9,4.3,5.1,8.7,5.7,10.8
					c0,0,2.4,9-0.8,18.3c-0.8,2.4-3.3,8.4-3.5,9c-1.3,3.3-1.4,3.3-1.8,4.3c-2,5.5-2,10.3-2,11.8c0.1,6.7,2.3,11.6,3.5,14.3
					c1.1,2.4,1.7,3.9,3.1,5.7c1.7,2.2,2.7,2.6,3.7,4.7c0.5,1,1.5,3.1,1,5.3c-0.7,2.7-3.5,4-5.3,4.9c-6,2.9-12.1,1.7-14.7,1.2
					c-1.8-0.4-5.9-1.4-10.4-4.3c-4.1-2.7-6.7-5.8-7.9-7.5c-2.8-3.9-4-7.4-4.7-9.8c-0.7-2.2-1.8-6.4-1.8-11.8c0-4.1,0.7-7.2,1.2-9.4
					c0.7-3.2,1.1-5,2.2-7.3c1.2-2.6,2.1-3.3,2.9-5.9c0.7-2.3,0.8-4.1,0.8-5.3c0.1-3.8-0.9-6.7-1.6-8.8c-0.5-1.4-1.3-3.4-2.6-5.7
					c-1.6-2.7-2.9-4.8-3.7-6.1C1.5,14,0.8,12.9,0.7,11.2z" fill="${fill}" stroke="${color}" stroke-width="4" /></g>`;
			}

			element += shapeElement;

			element += `</svg>`;
			group += element;
		}

		group += `</div>`;
		return group;
	}


	function distributeCards() {
		let cards = $('.cards-wrapper');
		cards.empty();

		for (let i=0; i<=3; i++) {
			cards.append(`<div id="row${i}"></div>`);
			for (let j=0; j<=2; j++) {
					let cardElement 
						= `<div class="card-wrapper col-xs-4">`
							+ `<div class="card" id="${i}-${j}"></div>`
						+ `</div>`;
					$(`#row${i}`).append(cardElement);

					addNewCard(i, j);

					$(`#${i}-${j}`).click(function(e) {
						e.preventDefault();
						selectCard($(this));
					});
			}
		}

		selectedCards = [];
	}

	function distributeExtraRow() {
		let cards = $('.cards-wrapper');

		let i = cards.children().length;
		cards.append(`<div id="row${i}"></div>`);
		for (let j=0; j<=2; j++) {
			if (!deck.length) return;

			let cardElement 
				= `<div class="card-wrapper col-xs-4">`
					+ `<div class="card" id="${i}-${j}"></div>`
				+ `</div>`;
			$(`#row${i}`).append(cardElement);

			addNewCard(i, j);

			$(`#${i}-${j}`).click(function() {
				selectCard($(this));
			});
		}

		checkNumberOfSets();


	}

	function addNewCard(i, j) {
		let card = deck.splice(Math.floor(Math.random()*deck.length), 1)[0];
		let element = $(`#${i}-${j}`);
		element.hide().append(renderSVG(...Object.keys(card).map(prop => {
			element.data(prop, card[prop]);
			return card[prop];
		}))).fadeIn(700);
		element.data('$id', element.attr('id'));

		$('.cards-left').text(deck.length);	
	}

	function checkNumberOfSets() {
		const numCards = $('.card').length;

		var sets = 0;

		for (let i=0; i<numCards; i++) {
			for (let j=i+1; j<numCards; j++) {
				for (let k=j+1; k<numCards; k++) {

					let cards = [];
					[i,j,k].forEach(num => {
						let $card = $(`#${Math.floor(num/3)}-${num%3}`);
						if ($card.length) {
							let card = {};
							['number', 'color', 'shape', 'shading'].forEach(prop => {
								card[prop] = $card.data(prop);
							});
							cards.push(card);				
						}
					});
					if (cards.length == 3 && checkIfSet(cards, true)) sets++;
				}
			}
		}

		if (sets) console.log(`number of sets: ${sets}`);
		else alert('No more sets remaining!');
		return sets;
	}



	function selectCard($card) {
		const props = {};
		['number', 'color', 'shape', 'shading', 'id', '$id'].forEach(prop => {
			props[prop] = $card.data(prop);
		});

		if ($card.hasClass('selected')) {
			$card.removeClass('selected');
			selectedCards.splice(selectedCards.indexOf(props), 1);
		}
		else {
			$card.addClass('selected');
			selectedCards.push(props);
		}


		if (selectedCards.length == 3) {
			setTimeout(function() {
				checkIfSet(selectedCards);
			}, 600);
		}
	}


	function checkIfSet(cards, testing) {
		let props = { number: [], color: [], shape: [], shading: [] };
		cards.forEach(card => {
			['number', 'color', 'shape', 'shading'].forEach(prop => {
				if (props[prop].indexOf(card[prop]) == -1) props[prop].push(card[prop]);
			});
		});

		let set = true;
		if (cards.length != 3) set = false;
		
		Object.keys(props).forEach(prop => {
			if (props[prop].length === 1) {
				// console.log(`${prop}s all the same.`);
			}
			else if (props[prop].length === 2) {
				// console.log(`One of the ${prop}s is different. Boo`);
				set = false;
			}
			else if (props[prop].length === 3) {
				// console.log(`${prop}s all different.`);
			}
		})

		if (testing) return set;

		if (set) {
			alert('SET!');

			cards.forEach((card, idx) => {
				$(`#${card.$id}`).animate({
					opacity: 0
				}, 700, function() {
					$(this).children().remove();
					if (deck.length) {
						$(this).css({opacity: 1});
						addNewCard(card.$id.charAt(0), card.$id.charAt(2));
					}
					else {
						$(this).remove();
					}

					if (idx == cards.length - 1) checkNumberOfSets();
				});
			});

			players[0].score++;
			$('.p1-score').text(players[0].score);



		} else console.log('not a set :(');

		selectedCards = [];
		$('.selected').each(function() {
			$(this).removeClass('selected');
		});


	}


	setupPlayers();
	setupDeck();
	distributeCards();
	checkNumberOfSets();




});