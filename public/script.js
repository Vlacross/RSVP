
var token;

function renderSignIn() {

	console.log('Signing In!')
	const route = 'login'
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	promptAuth(route);
};


function renderSignUp() {

	console.log('Signing Up!')
	const route = 'users/create'
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	$('.fullNameLabel').removeClass('hidden').attr('required', true)
	promptAuth(route);
};

function watchIntro() {

	$('body').on('click', '.introPageFieldset', function(e) {
		e.preventDefault();
		if(event.target.name !== 'getLogIn') {
			renderSignUp()}
		else {renderSignIn()}
	})
};

/*********ACCOUNT*********** */

// function buildAccount(usr) {
// 	accountProfile(user) 
// }

function getAccount(token) {
	let route = 'users/findme';
	let method = 'GET';
	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let acc = viewSwitch(accountProfile(resj));
		$('.viewWrapper').replaceWith(acc)
	})

};

/*********USERLIST*********** */
function buildUsers(usrs) {
	let listings = [];
	usrs.forEach(usr => {
		listings.push(usersListing(usr))
	})
	
	let list = listings.join(' ')
	return viewSwitch(list)
}

function showUsers(token) {

	let route = 'users/find';
	let method = 'GET';
	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let users = buildUsers(resj)
		$('.viewWrapper').replaceWith(users)
		
	})
	console.log('showing users list')
};

/*********POSTFEED*********** */
function buildFeed(arr) {

	let feed = [];
	arr.forEach(post => {
		let postBody = eventPost(post)
		feed.push(postBody)
	})
	let food = feed.join(' ')
	return viewSwitch(food);
};

function getFeed(token) {

	let route = 'posts/find';
	let method = 'GET';

	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let thread = buildFeed(resj)
		$('.viewWrapper').replaceWith(thread)
	})
	.catch(err => {console.log(err)})

};


function buildHome(token) {

	$('body').prepend(homePage);
	getFeed(token)
	
}

/*********LOGINFAIL*********** */
function handleFail() {
	$('.accessView').addClass('hidden')
	$('main').append(failedLogin);

	

	$('.failedResponseButton').one('click', function(e) {
		e.preventDefault();
		routeFail()
	})
}

function routeFail() {
	console.log('reroute')
	$('.failedResponse').remove()
	$('.userNameInput').val('');
	$('.userPassInput').val('');
	$('.accessView').removeClass('hidden')
};

/*********LOGIN*********** */
function promptAuth(route) {
	console.log(`sending fetch to ${route}`)
	
		$('body').on('submit', '.authForm', function(e) {
			e.preventDefault();
			const fullname = $('.fullNameInput').val();
			const id = $('.userNameInput').val();
			const pwd = $('.userPassInput').val();
			const logIn = {
					fullname: fullname,
					username: id,
					password: pwd
				};
				console.log(logIn, 'preauth send')
			fetch(route, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(logIn)
			})
			.then(res => res.json())
			.then(resj => {
				console.log(resj)
				$('.accessView').addClass('hidden')
				$('main').addClass('sinkBack')
				token = resj.token
				buildHome(token)
				handleNav(token)
			})
			.catch(err => {
				console.log('loginFail')
				handleFail()
			})
		})
};

/*********NAVBAR*********** */
function handleNav(token) {
	$('a').on('click', function(e) {
		e.preventDefault();
		if(event.target.name === 'eventDetailsLink') {showDetails(token)}
		if(event.target.name === 'usersListLink') {showUsers(token)}
		if(event.target.name === 'eventNewsfeedLink') {getFeed(token)}
		if(event.target.name === 'accountLink') {getAccount(token)}
	})

}

$(document).ready(function() {

	console.log('hittingJQscript!')
	watchIntro()
	
})


