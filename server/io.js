'use strict';

const _ = require('lodash');
const PRESET_NAMES = ['Rick', 'Morty', 'Jerry', 'Beth', 'Summer', 'Mr. Meeseeks'];

const io = require('socket.io').listen();

var players = {};
var randomScrubs = 0;


io.sockets.on('connection', socket => {
	console.log('connection seikou', socket.id);

	var playerNickname;

	for (let i=0; i<PRESET_NAMES.length && !playerNickname; i++) {
		let existing = Object.keys(players).find(socketId => players[socketId].name === PRESET_NAMES[i]);
		if (!existing) playerNickname = PRESET_NAMES[i];
	}

	players[socket.id] = {
		name: playerNickname || `Random Scrub #${++randomScrubs}`
	};

	console.log(players);

	socket.emit('player-info', players[socket.id]);

	socket.broadcast.emit('player-connect', {
		playerId: socket.id,
		playerName: players[socket.id].name
	});

	socket.on('disconnect', data => {
		console.log('sayonara', socket.id);


		socket.broadcast.emit('player-disconnect', {
			playerId: socket.id,
			playerName: players[socket.id].name
		});

		players = _.omit(players, socket.id);
		console.log(players);


	});

	socket.on('send-message', data => {
		data = Object.assign(data, { senderName: players[data.senderId].name });
		console.log(data);

		socket.broadcast.emit('receive-message', data);
	});

});

module.exports = io;