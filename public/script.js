


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
/**********LOGOUT*********** */

function logOut() {
	console.log('loggingOut!')
	localStorage.removeItem('token')
	$('.homePageView').remove()
	$('.introView').removeClass('hidden')
	$('main').removeClass('sinkBack')
}

/*********ACCOUNT*********** */

function editAccount(user, token) {
	let editForm = viewSwitch(editProfile(user))
	$('.viewWrapper').replaceWith(editForm)
	
}

function getAccount(token) {
	let route = 'users/findme';
	let method = 'GET';
	quickFetch(route, method, token)
	.then(res => res.json())
	.then(resj => {
		let acc = viewSwitch(accountProfile(resj));
		$('.viewWrapper').replaceWith(acc)
		// TODO: move these to document.ready at bottom of file
	watchEdit(token, resj)
	watchForm(token, resj)

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
	handleNav()
	
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
				console.log(resj)
				localStorage.setItem('token', `${resj.token}`)
			
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
	$('nav').on('click', 'button.eventDetailsLink', function(e) {
		e.preventDefault();
		showDetails()
	});
	$('nav').on('click', 'button.usersListLink', function(e) {
		e.preventDefault();
		showUsers()
	});
	$('nav').on('click', 'button.eventNewsfeedLink', function(e) {
		e.preventDefault();
		getFeed()
	});
	$('nav').on('click', 'button.accountLink', function(e) {
		e.preventDefault();
		getAccount()
	});
	$('nav').on('click', 'button.logOut', function(e) {
		e.preventDefault();
		logOut()
	});
		// if(event.target.name === 'eventDetailsLink') {showDetails()}
		// if(event.target.name === 'usersListLink') {showUsers()}
		// if(event.target.name === 'eventNewsfeedLink') {getFeed()}
		// if(event.target.name === 'accountLink') {getAccount()}
		// if(event.target.name === 'Logout') {logOut()}
};



function watchEdit(user, token) {
$('form').on('click', 'button.profileEditButton', function(e) {
	e.preventDefault();
	editAccount(user);
});
$('form').on('click', 'button.editSubmitButton', function(e) {
	e.preventDefault();
	console.log('editsubmitworx')
})
	// if(event.target.name === 'profileEditButton') {editAccount(user, token)}
	// if(event.target.name === 'editSubmitButton') {console.log('editsubmitworx')}
};

// function watchForm(user, token) {
// 	$('body').on('submit', 'form.accountEditForm', function(e) {
// 		e.preventDefault();
// 		console.log('editsubmitworx')
// 		});
// 	};

$(document).ready(function() {
	let token = localStorage.getItem('token');
	console.log('hittingJQscript!')
	handleNav()
	if(token === null) {
		watchIntro()
	}
	else {
		buildHome()
	}
	
})


