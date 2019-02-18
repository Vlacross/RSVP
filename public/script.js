
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

function buildUsers(usrs) {
	let listings = [];
	usrs.forEach(usr => {
		listings.push(usersListing(usr))
	})
	
	let list = `<section class="eventFeed">${listings.join(' ')}</section>`;
	return list
}

function showUsers(token) {
	let route = 'users/find';
	let method = 'GET';
	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let users = buildUsers(resj)
		$('.eventFeed').replaceWith(users)
		
	})
	console.log('showing users list')
};

function buildFeed(arr) {

	let feed = [];
	arr.forEach(post => {
		let postBody = eventPost(post)
		feed.push(postBody)
	})
	return feed.join(' ');
};

function buildHome(token) {

	$('.accessView').addClass('hidden')
	$('body').prepend(homePage);
	$('main').addClass('sinkBack')

	let route = 'posts/find';
	let method = 'GET'
	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let thread = buildFeed(resj)
		$('.updatePosts').append(thread)
	})
	.catch(err => {console.log(err)})
};

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

function handleNav(token) {
	$('a').on('click', function(e) {
		e.preventDefault();
		if(event.target.name === 'eventDetailsLink') {showDetails(token)}
		if(event.target.name === 'usersListLink') {showUsers(token)}
		if(event.target.name === 'eventNewsfeedLink') {}
		if(event.target.name === 'accountLink') {}
	})

}

// function watchIntro() {
// 	$('.failedResponseButton').on('click', function(e) {
// 		e.preventDefault();
// 		routeFail()
// 	})
	
// 	$('body').on('click', function(e) {
// 		e.preventDefault();
// 		console.log(event.target.name)
// 		if(event.target.name === 'getLogIn') { renderSignIn()};
// 		if(event.target.name === 'getRegister')	{renderSignUp()};
// 		if(event.target.name === 'failedResponse') {routeFail()}
// 	})

// };

$(document).ready(function() {

	console.log('hittingJQscript!')
	watchIntro()
	

		
})


