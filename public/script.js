


function renderSignIn() {

	console.log('Signing In!')
	const route = 'login'
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	promptAuth(route);
};


function renderSignUp() {

	console.log('Signing Up!')
	const route = 'login/create'
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	$('.fullNameLabel').removeClass('hidden').attr('required', true)
	promptAuth(route);
};

// function watchIntro() {

// 	$('body').on('click', '.introPageFieldset', function(e) {
// 		e.preventDefault();
// 		if(event.target.name !== 'getLogIn') {
// 			renderSignUp()}
// 		else {renderSignIn()}
// 	})
// };
/**********LOGOUT*********** */

function logOut() {
	console.log('loggingOut!')
	localStorage.removeItem('token')
	localStorage.clear()
	$('.homePageView').remove()
	$('.introView').removeClass('hidden')
	$('main').removeClass('sinkBack')
}

/*********ACCOUNT*********** */

function editAccount() {
	let user = JSON.parse(localStorage.getItem('user'))
	let editForm = viewSwitch(editProfile(user))
	$('.viewWrapper').replaceWith(editForm)
	
}

function getAccount() {
	let user = JSON.parse(localStorage.getItem('user'))
	let route = 'users/findme';
	let method = 'GET';
	quickFetch(route, method)
	.then(res => res.json())
	.then(resj => {
		console.log('reckled', user)
		let acc = viewSwitch(accountProfile(user));
		console.log(acc)
		$('.viewWrapper').replaceWith(acc)
		// TODO: move these to document.ready at bottom of file
	// watchEdit(resj)

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
	quickFetch(route, method)
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

function getFeed() {

	let route = 'posts/find';
	let method = 'GET';

	quickFetch(route, method)
	.then(res => res.json())
	.then(resj => {
		let thread = buildFeed(resj)
		$('.viewWrapper').replaceWith(thread)
	})
	.catch(err => {console.log(err)})

};


function buildHome() {
	$('.accessView').addClass('hidden')
	$('main').addClass('sinkBack')
	$('body').prepend(homePage);
	getFeed()
	
	
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
			const fullname = $('.fullNameInput').val('');
			const id = $('.userNameInput').val('');
			const pwd = $('.userPassInput').val('');


	
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
				console.log(resj, resj.user)
				localStorage.setItem('user', JSON.stringify(resj.user))
				localStorage.setItem('token', `${resj.token}`)
				// let user = JSON.parse(localStorage.getItem('user'))
	
				buildHome()
			})
			.catch(err => {
				console.log('loginFail')
				handleFail()
			})
		})
};

/*********NAVBAR*********** */
function handleNav() {
	console.log('handlinNAV')
	$('body').on('click', 'button.eventDetailsLink', function(e) {
		e.preventDefault();
		showDetails()
	});
	$('body').on('click', 'button.usersListLink', function(e) {
		e.preventDefault();
		showUsers()
	});
	$('body').on('click', 'button.eventNewsfeedLink', function(e) {
		e.preventDefault();
		getFeed()
	});
	$('body').on('click', 'button.accountLink', function(e) {
		e.preventDefault();
		getAccount()
	});
	$('body').on('click', 'button.logOut', function(e) {
		e.preventDefault();
		logOut()
	});
		// if(event.target.name === 'eventDetailsLink') {showDetails()}
		// if(event.target.name === 'usersListLink') {showUsers()}
		// if(event.target.name === 'eventNewsfeedLink') {getFeed()}
		// if(event.target.name === 'accountLink') {getAccount()}
		// if(event.target.name === 'Logout') {logOut()}
};



function watchEdit() {
	console.log('watchingEdit')
$('body').on('click', 'button.profileEditButton', function(e) {
	e.preventDefault();
	console.log('editedit')
	editAccount();
});
$('body').on('click', 'button.editSubmitButton', function(e) {
	e.preventDefault();
	console.log('editsubmitworx')
})
	// if(event.target.name === 'profileEditButton') {editAccount(user, token)}
	// if(event.target.name === 'editSubmitButton') {console.log('editsubmitworx')}
};

function watchIntro() {

	$('body').on('click', 'button.introLoginButton', function(e) {
		e.preventDefault();
		renderSignIn();
	});
	$('body').on('click', 'button.introRegisterButton', function(e) {
		e.preventDefault();
		renderSignUp();
	});
}
		

$(document).ready(function() {
	let token = localStorage.getItem('token');
	console.log('hittingJQscript!')
	watchEdit()
	handleNav()
	watchIntro()
	if(token !== null) {
		buildHome()
	}
	
	
})
