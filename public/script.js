


function toggleIntro() {
	$('.introView').removeClass('hidden')
	$('.accessView').addClass('hidden')
	$('.fullNameLabel').addClass('hidden').attr('required', false)
}

function renderSignIn() {

	console.log('Signing In!')
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	promptAuth();
};


function renderSignUp() {

	console.log('Signing Up!')
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	$('.fullNameLabel').removeClass('hidden').attr('required', true)
	promptAuth();
};

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

function submitEdit(route) {

	console.log(`sending update to ${route}`)

	let user = JSON.parse(localStorage.getItem('user'))
	console.log(user.id)
	let token = localStorage.getItem('token')
	let fullName = $('.fullNameInput').val();
	let userName = $('.userNameInput').val();
	let pwd = $('.userPassInput').val();
	let updatedUser = {
		id: user.id,
		fullname: fullName,
		username: userName,
		password: pwd
	};
		console.log(updatedUser, 'preUpdate send')
		fetch(route, {
			method: 'put',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer' + ' ' + token
			},
			body: JSON.stringify(updatedUser)
		})
		.then(res => res.json())
		.then(resj => {
			console.log('update suxess!', resj)
			localStorage.removeItem('user')
			localStorage.setItem('user', JSON.stringify(resj.user))
				let type = 'update'
				promptSuccess(type)
				
				
				// buildHome()
			})
			.catch(err => {
				console.log('updateFail', err)
				let type = 'update'
				handleFail(type)
			})
};

function editAccount() {
	let user = JSON.parse(localStorage.getItem('user'))
	let editForm = viewSwitch(editProfile(user))
	console.log(user, editForm)
	$('.viewWrapper').replaceWith(editForm)

}

function getAccount() {
	let user = JSON.parse(localStorage.getItem('user'))

	let acc = viewSwitch(accountProfile(user));
	
			$('.viewWrapper').replaceWith(acc)

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
/*********POSTFEED-BUILD*********** */

function createPost() {

	let postForm = viewSwitch(constructPost())
	$('.viewWrapper').replaceWith(postForm)
};


function shipPost(route) {

	let user = JSON.parse(localStorage.getItem('user'))
	let token = localStorage.getItem('token')

	let title = $('.eventPostTitleInput').val();
	let content = $('.eventPostContentInput').val();
	
	let newPost = {
		author: user.id,
		title: title,
		body: content
	};
		console.log(newPost, 'prePost shipment')
		fetch(route, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer' + ' ' + token
			},
			body: JSON.stringify(newPost)
		})
		.then(res => res.json())
		.then(resj => {
			console.log('update suxess!', resj)
			let type = 'post'
				promptSuccess(type)
				
				
				// buildHome()
			})
			.catch(err => {
				console.log('updateFail', err)
				let type = 'update'
				handleFail(type)
			})

};

/*********POSTFEED-SHOW********** */
function buildFeed(arr) {
	let count = 0;
	let feed = [];
	arr.forEach(post => {
		count++
		let postBody = eventPost(post, count)
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
		.catch(err => { console.log(err) })

};
/*********SINGLE*POST*SHOW********** */


							/*********HANDLE*COMMENTS********** */

function createComment() {
	// let commentPalette = commentPalette() 
	$('.commentsList').append(commentPalette)

}

function addComment() {

}


							/*********END*COMMENTS********** */
	function getPost(postId) {
		let route = `posts/find/${postId}`;
		let method = 'GET';

		quickFetch(route, method)
		.then(res => res.json())
		.then(resj => {
			console.log('sinlinouts', resj)
			let singlePost = buildPost(resj)
			$('.viewWrapper').replaceWith(viewSwitch(singlePost))
		})
		.catch(err => { console.log(err) })

	}

/*********BUILDHOME*********** */
function buildHome() {
	
	$('main').addClass('sinkBack')
	$('body').prepend(homePage);
	getFeed()


}

/********SHOW*SUCCESS*********** */
function promptSuccess(type) {

	let msg = type === 'update' ? updateSuccessPrompt : postSuccessPrompt

	$('.viewWrapper').replaceWith(viewSwitch(msg))
}

/*********HANDLEFAIL*********** */
function handleFail(type) {
	let msg = type === 'login' ? failedLogin : failedUpdate 
	console.log(type)
	$('.accessView').addClass('hidden')
	$('main').append(msg);



	$('.failedResponseButton').one('click', function (e) {
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
function promptAuth() {
	
	const fullname = $('.fullNameInput').val('');
	const id = $('.userNameInput').val('');
	const pwd = $('.userPassInput').val('');
}


function logIn(route, newUser) {
	console.log(`sending fetch to ${route}`)
	const fullname = $('.fullNameInput').val();
	const id = $('.userNameInput').val();
	const pwd = $('.userPassInput').val();
	const logIn = {
		username: id,
		password: pwd
	};
	const createNew = {
			fullname: fullname,
			username: id,
			password: pwd
	};
	let payLoad = !fullname ? logIn : createNew
		console.log(payLoad, 'preauth send')
		fetch(route, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payLoad)
		})
		.then(res => res.json())
		.then(resj => {
			console.log(resj, resj.user)
				localStorage.setItem('user', JSON.stringify(resj.user))
				localStorage.setItem('token', `${resj.token}`)
				// let user = JSON.parse(localStorage.getItem('user'))
				$('.accessView').addClass('hidden')
				buildHome()
			})
			.catch(err => {
				console.log('loginFail')
				let type = 'login'
				handleFail(type)
			})
};
		
		/*********NAVBAR*********** */
function handleNav() {
	console.log('handlinNAV')
	$('body').on('click', 'button.eventDetailsLink', function (e) {
		e.preventDefault();
		showDetails()
	});
	$('body').on('click', 'button.usersListLink', function (e) {
		e.preventDefault();
		showUsers()
	});
	$('body').on('click', 'button.eventNewsfeedLink', function (e) {
		e.preventDefault();
		getFeed()
	});
	$('body').on('click', 'button.accountLink', function (e) {
		e.preventDefault();
		getAccount()
	});
	$('body').on('click', 'button.logOut', function (e) {
		e.preventDefault();
		logOut()
	});
	$('body').on('click', 'button.addPost', function (e) {
		e.preventDefault();
		createPost()
	});

	// if(event.target.name === 'eventDetailsLink') {showDetails()}
	// if(event.target.name === 'usersListLink') {showUsers()}
	// if(event.target.name === 'eventNewsfeedLink') {getFeed()}
	// if(event.target.name === 'accountLink') {getAccount()}
	// if(event.target.name === 'Logout') {logOut()}
};
	

function watchFetchActions() {
	let route;

				/*START POST */
	$('body').on('click', 'button.postFormSubmit', function (e) {
		e.preventDefault();
		console.log('shipping newPost!')
		route = 'posts/create'
		shipPost(route);
	});
							/*STOP POST */
						/************************ */
							/*START EDIT */
	
	$('body').on('click', 'button.profileEditButton', function (e) {
		e.preventDefault();
		console.log('switching route for update')
		route = 'users/details'
		editAccount();
	});
	$('body').on('click', 'button.editSubmitButton', function (e) {
		e.preventDefault();
		submitEdit(route)
	})
							/*STOP EDIT */
						/************************ */
							/*START INTRO */

	$('body').on('click', 'button.introLoginButton', function (e) {
		e.preventDefault();
		console.log('switching route for login')
		route = 'login'
		renderSignIn();
	});
	$('body').on('click', 'button.introRegisterButton', function (e) {
		e.preventDefault();
		console.log('switching route for create')
		route = 'login/create'
		renderSignUp();
	});
	$('body').on('click', 'button.loginSubmit', function (e) {
		e.preventDefault();
		logIn(route);
	});
	$('body').on('click', 'button.toggleIntro', function (e) {
		e.preventDefault();
		toggleIntro()
	});
							/*STOP INTRO */
}




function watchPageActions() {
	$('body').on('click', 'button.successResponseButton', function (e) {
		e.preventDefault();
		console.log('going to home page!')
		buildHome();
	});
	$('body').on('click', 'a.postTitle', function (e) {
		e.preventDefault();
		console.log('Just Building a home for the console dwarves!')
		let postId = $(this).attr('id')
		getPost(postId)
	});
	$('body').on('click', 'button.addComment', function (e) {
		e.preventDefault();
		console.log('You may just be a bag full of soil', $(this).siblings())
		createComment()
	});
	$('body').on('click', 'button.commentFormSubmit', function (e) {
		e.preventDefault();
		console.log('DirtBag', $(this))
		addComment()
	});


	$('body').on('click', 'button.removeComment', function (e) {
		e.preventDefault();
		console.log('Just Building a home for the console dwarves!')
		let postId = $(this).attr('id')
		
	});



}


function evalPageState() {
	/*makes use of stored data on refresh */
	let token = localStorage.getItem('token');
	if (token !== null || undefined) {
		buildHome()
		$('.introView').addClass('hidden')
	}
}


$(document).ready(function () {
	console.log('hittingJQscript!')
	// watchEdit()
	handleNav()
	watchFetchActions()
	watchPageActions()
	evalPageState()
	
	
})
