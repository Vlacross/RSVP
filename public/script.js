

/*allows toggle between signing in and creating a new user */
function toggleIntro() {
	$('.introView').removeClass('hidden');
	$('.accessView').remove();
	
};

/*changes the view and prompts login */
function renderSignIn() {

	console.log('Signing In!');
	$('.introView').addClass('hidden');
	$('main').append(introViewSwitch(loginForm))
	
	/*listens for 'loginSubmit' */
};

/*changes the view and prompts for details to create a new user */
function renderSignUp() {

	console.log('Signing Up!');
	$('.introView').addClass('hidden');
	$('main').append(introViewSwitch(eventCheck))
	
	/*eventCheck    eventNameButton*/
};

/*changes the view and prompts for details to create an event */
function createEvent() {

	console.log('invent an Event!')
	$('.introView').addClass('hidden');
	$('main').append(introViewSwitch(newEventCheck))
}


/********V*******EVENT*********V******************************************************************************************V*EVENT*ACTIONS*V*********************** */

function checkEvent(route) {
	
	let name = $('.eventNameInput').val();
	let event = {
		eventName: name
	}
	console.log(`Checking eventName @ ${route}`)
	fetch(route, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(event)})
	.then(res => res.json())
	.then(resj => {
		if(resj.message === 'false') {
		 flashNoEvent()
		}
		if(resj.message === 'true') {
			console.log('logDog')
		localStorage.setItem('event', JSON.stringify(resj.event))
		$('.accessView').replaceWith(introViewSwitch(signupForm))
		}
	})
	.catch(err => {
		console.log('eventFindFail', err)
		let type = 'login'
		handleFail(type)
	});
}

/******************************************************NEW*EVENT*************** */

function buildEvent() {

	// $('.accessView').replaceWith(introViewSwitch(newEventForm(name)))
	let route;
	route = 'login/newEvent'

	let fullName = $('.fullNameInput').val();
	let userName = $('.userNameInput').val();
	let pwd = $('.userPassInput').val();
	let contactInfo = $('.userContactInfoInput').val() 

	let eventName = $('.eventName').val()
	let dateOfEvent = $('.dateOfEventInput').val()
	let description = $('.eventDescriptionInput').val()
						
	let newEvent = {
		name: eventName,
		host: fullName,
		dateOfEvent: dateOfEvent,
		contactInfo: contactInfo,
		summary: description
	}
	console.log(newEvent)
	fetch(route, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newEvent)})
		.then(res => res.json())
		.then(resj => {

			let eventAdmin = {
					fullname: fullName,
					username: userName,
					password: pwd,
					event: resj.id,
					role: '1',
					attending: true
			}
			console.log(eventAdmin)
			route = 'login/create'
			fetch(route, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(eventAdmin)})
				.then(res => res.json())
				.then(resj => {
					console.log(resj)
					localStorage.setItem('user', JSON.stringify(resj.user))
					localStorage.setItem('token', `${resj.token}`)
					buildHome()
				})

		})
		.catch(err => {
			console.log(err)
		})


	
	
}


function checkEventName(route) {
	console.log('nameChecker')
	let name = $('.eventNameInput').val();
	let event = {
		eventName: name
	}
	console.log(`Checking eventName @ ${route}`)
	fetch(route, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(event)})
	.then(res => res.json())
	.then(resj => {
		console.log(resj)
		if(resj.message === 'false') {
			console.log('Good To Go - Not Taken')
			$('.accessView').replaceWith(introViewSwitch(newEventForm(name)))
		}
		if(resj.message === 'true') {
			console.log('troobin', resj)
		
		
		}
	})
	.catch(err => {
		console.log('eventFindFail', err)
		let type = 'login'
		handleFail(type)
	});
}

function getEventInfo() {

	let user = JSON.parse(localStorage.getItem('user'));
	let route = `events/find/${user.event}`;
	let method = 'GET';
	console.log('route', route)

	quickFetch(route, method)
	.then(res => res.json())
	.then(resj => {
		console.log('events', resj)
		$('.viewWrapper').replaceWith(viewSwitch(buildEventDetails(resj)))
	})
	.catch(err => {
		console.log(err)
	})

}



/********^*******EVENT**********^****************************************************************************************^*EVENT*ACTIONS*^*********************** */

/*********ACCOUNT*********** */

/*********deeletes current user account and related data*********** */

function deleteUser() {

	let user = JSON.parse(localStorage.getItem('user'));
	let route = `users/delete/${user.id}`
	let method = 'delete'
	console.log(`removing user at ${route}`, user);

	quickFetch(route, method)
		.then(res => {
			console.log('deletion suxess!', res.status)
			logOut()
		})
		.catch(err => {
			console.log('updateFail', err)
			let type = 'update'
			handleFail(type)
		});
};





/*********updates current user details and info*********** */

function submitEdit(route) {

	console.log(`sending update to ${route}`);
	let user = JSON.parse(localStorage.getItem('user'));
	let token = localStorage.getItem('token');
	let fullName = $('.fullNameInput').val();
	let userName = $('.userNameInput').val();
	let pwd = $('.userPassInput').val();
	const att = $('input[name=attendance]:checked').val()
	
	let updatedUser = {
		fullname: fullName,
		username: userName,
		password: pwd,
		attending: att
	};

	console.log(updatedUser, 'preUpdate send');
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
			localStorage.removeItem('token')
			localStorage.setItem('user', JSON.stringify(resj.user))
			localStorage.setItem('token', resj.token)
			let type = 'update'
			promptSuccess(type)
		})
		.catch(err => {
			console.log('updateFail', err)
			let type = 'update'
			handleFail(type)
		});
};

/*renders form with user info ready to edit - password not shown(needs attention) */
function editAccount() {
	let user = JSON.parse(localStorage.getItem('user'));
	let editForm = viewSwitch(editProfile(user));
	console.log(user, editForm);
	$('.viewWrapper').replaceWith(editForm);
};

/*uses stored user id to render user account details */
function getAccount() {
	let user = JSON.parse(localStorage.getItem('user'));
	let acc = viewSwitch(accountProfile(user));
	$('.viewWrapper').replaceWith(acc);
};


/*********USERLIST*********** */
/*Builds content with user data */
function buildUsers(usrs) {
	let listings = [];
	usrs.forEach(usr => {
		listings.push(usersListing(usr))
	});

	let list = listings.join(' ');
	return viewSwitch(list);
};

/*Gets a list of registered users and displays their name(eventually want role, join date, and attending or not) */
function showUsers() {

	let user = JSON.parse(localStorage.getItem('user'));

	let route = `users/find/${user.event}`;
	let method = 'GET';
	quickFetch(route, method)
		.then(res => res.json())
		.then(resj => {
			let users = buildUsers(resj)
			$('.viewWrapper').replaceWith(users)
		});
	console.log('showing users list');
};

/********^*****************^****************************************************************************************^*USER*ACTIONS*^*********************** */
/********V****************V******************************************************************************************V*POST*ACTIONS*V*********************** */
/*********POSTFEED-BUILD*********** */

/*Builds form for post data and renders to user to create post */

function createPost() {

	let postForm = viewSwitch(constructPost());
	$('.viewWrapper').replaceWith(postForm);
};

/*sends form to server with stored userId and token */
function shipPost(route) {

	let user = JSON.parse(localStorage.getItem('user'));
	let token = localStorage.getItem('token');
	let title = $('.eventPostTitleInput').val();
	let content = $('.eventPostContentInput').val();

	let newPost = {
		author: user.id,
		title: title,
		body: content,
		event: user.event
	};
	console.log(newPost, 'prePost shipment');
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
		})
		.catch(err => {
			console.log('postFail', err)
			let type = 'post'
			handleFail(type)
		});

};


/*********POSTFEED-SHOW********** */

/*Builds content with post data and renders in a viewable list */
function buildFeed(arr) {
	let count = 0;
	let feed = [];
	arr.forEach(post => {
		count++
		let postBody = eventPost(post, count)
		feed.push(postBody)
	});
	let food = feed.join(' ')
	return viewSwitch(food);
};

/*Gets list of post data from server */
function getFeed() {

	let user = JSON.parse(localStorage.getItem('user'))
	console.log('raving??', user.event)
	let route = `posts/find/${user.event}`;
	let method = 'GET';
	quickFetch(route, method)
		.then(res => res.json())
		.then(resj => {
			let thread = buildFeed(resj)
			$('.viewWrapper').replaceWith(thread)
		})
		.catch(err => { console.log(err) });

};
/*********SINGLE*POST*SHOW********** */

/*gets post data from server and builds content then renders to viewer */
function getPost(postId) {
	let route = `posts/findPost/${postId}`;
	let method = 'GET';
	
	quickFetch(route, method)
	.then(res => res.json())
	.then(resj => {
		console.log('sinlinouts', resj)
		let singlePost = buildPost(resj)
		$('.viewWrapper').replaceWith(viewSwitch(singlePost))
	})
	.catch(err => { console.log(err) });
	
}

/*******************************************************************************************************incomplete*************************************/
/*********SINGLE*POST*EDIT********** */

/*user(admin or lead) can edit post */
function editPost() {

}

/* */
function updatePost(route) {

	console.log(`sending update to ${route}`)
	let user = JSON.parse(localStorage.getItem('user'))
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

		})
		.catch(err => {
			console.log('updateFail', err)
			let type = 'update'
			handleFail(type)
		})
}

/*******************************************************************************************************incomplete*************************************/
/*********SINGLE*POST*DELETE********** */

/*removes a post(eventually would like only the author and admin) */

function deletePost(route, postId) {
	console.log('at deletet')
	let method = 'delete';

	quickFetch(route, method)
		.then(res => {
			console.log('deposter Out', res.status)
			let type = 'delete'
			promptSuccess(type)
		})
		.catch(err => { console.log(err) });
};
/********^***************^*******************************************************************************^*POST*ACTIONS*^********************************* */
/********V***************V*******************************************************************************V*COMMENT*ACTIONS*V********************************** */
/*********HANDLE*COMMENTS********** */

function createComment() {
	
	$('.commentsList').append(commentPalette);	
};

function postComment(route, postId) {
	let user = JSON.parse(localStorage.getItem('user'));
	let token = localStorage.getItem('token');
	let text = $('.commentContentInput').val();

	let newComment = {
		userId: user.id,
		text: text,
		postId: postId,
		event: user.event
	};
	console.log(newComment, 'preSnark remark');
	fetch(route, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer' + ' ' + token
		},
		body: JSON.stringify(newComment)
	})
		.then(res => res.json())
		.then(resj => {
			console.log('middleFetch', resj)
		
			console.log('update suxess!', resj)
			let type = 'post'
			promptSuccess(type)

		})
		.catch(err => {
			console.log('updateFail', err)
			let type = 'post'
			handleFail(type)
		});
};


/**********COMMENTS**DELETE********** */
function deleteComment(removalId, postId, authorId) {
	let route = `comments/delete/${removalId}`;
	let user = JSON.parse(localStorage.getItem('user'));
	console.log('route', route);
	
	fetch(route, {
		method: 'delete',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer' + ' ' + token
		},
		body: JSON.stringify()
	})
	.then(res => console.log(res.status))
	
		console.log('middleFetch', removalId)
		route = `posts/decomment/${removalId}`
		let unPopulate = {
			postId: postId,
			commentId: removalId
		}
		fetch(route, {
			method: 'put',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer' + ' ' + token
			},
			body: JSON.stringify(unPopulate)
		})
		.then(res => res.json())
		.then(resj => {
		console.log('depopulation suxess!', resj)
		let type = 'delete'
		promptSuccess(type)

		})
		.catch(err => {
			console.log('updateFail', err)
			let type = 'delete'
			handleFail(type)
		});
};

/********^***********^**********************************************************************************^**COMMENT*ACTIONS*^***********************************/
/********V***********V***********************************************************************************V*SITE*FLOW*ACTIONS*V**********************************/

function checkRole() {
	let user = JSON.parse(localStorage.getItem('user'));
	if (user.role === 1) {
		$('.siteNav').append(eventDeleteButton)
	}

};


/*********BUILDHOME*********** */
function buildHome() {

	$('.wrapper').addClass('inUse')
	$('.accessView').remove()
	$('main').addClass('sinkBack');
	$('body').prepend(homePage);
	checkRole()
	getFeed();
};

/********SHOW*SUCCESS*********** */
function promptSuccess(type) {
  let msg;
	switch(type) {
		case 'update':
			msg = updateSuccessPrompt;
			break;
		case 'post':
			msg = postSuccessPrompt;
			break;
		case 'delete':
			msg = deleteSuccessPrompt;
			break;
		};
		
	$('.viewWrapper').replaceWith(viewSwitch(msg));
};

/*********HANDLEFAIL*********** */
function handleFail(type) {
	let msg;
	switch(type) {
		case 'update':
			msg = failedUpdate;
			break;
		case 'post':
			msg = failedPost;
			break;
		case 'delete':
			msg = failedDelete;
		case 'login':
			msg = failedLogin;
			$('.accessView').addClass('hidden');
			break;	
		};

	$('main').append(msg);

	$('.failedResponseButton').one('click', function (e) {
		e.preventDefault();
		routeFail();
	});
};

function routeFail() {
	console.log('reroute');
	$('.failedResponse').remove();
	$('.accessView').removeClass('hidden');
	$('.userNameInput').val('');
	$('.userPassInput').val('');
	
};

function flashNoEvent() {

	$('.accessView').replaceWith(introViewSwitch(noEvent))

	$('.noEventButton').one('click', function (e) {
			e.preventDefault();
			$('.accessView').replaceWith(introViewSwitch(eventCheck))
		});
}

/*********^***********^**********************************************************************************^*SITE*FLOW*ACTIONS*^**********************************/

/*********V*LOGOUT*V***************************************************************************************************V*LOGOUT*V*********************** */
/*********clear stored data*********** */

function logOut() {

	console.log('loggingOut!');
	localStorage.removeItem('token');
	localStorage.clear();
	$('.homePageView').remove();
	$('.introView').removeClass('hidden');
	$('main').removeClass('sinkBack');
	$('.wrapper').removeClass('inUse')
};
/*********^*LOGOUT*^***************************************************************************************************^*LOGOUT*^*********************** */


/*********V*LOGIN*V***************************************************************************************************V*LOGIN*V*********************** */

/*Initial User Login */
function logIn(route) {
	
	console.log(`sending fetch to ${route}`);
	const userName = $('.userNameInput').val();
	const pwd = $('.userPassInput').val();
	const logIn = {
		username: userName,
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
			console.log(resj, resj.userData)
			localStorage.setItem('user', JSON.stringify(resj.userData))
			localStorage.setItem('token', `${resj.token}`)
			buildHome()
		})
		.catch(err => {
			console.log('loginFail')
			let type = 'login'
			handleFail(type)
		});
};
/********^*LOGIN*^*************************************************************************************************^*LOGIN*^********************** */

/*********V*SIGN*UP*V***************************************************************************************************V*SIGN*UP*V*********************** */


function signUp(route) {

	console.log(`sending fetch to ${route}`);
	const fullname = $('.fullNameInput').val();	
	const userName = $('.userNameInput').val();
	const pwd = $('.userPassInput').val();
	const att = $('input[name=attendance]:checked').val()
	let eventName = JSON.parse(localStorage.getItem('event'))
	const createNew = {
		fullname: fullname,
		username: userName,
		password: pwd,
		event: eventName[0].id,
		role: 3,
		attending: att
	};

	console.log(createNew, 'preauth newUser send')
	fetch(route, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(createNew)
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
			let type = 'login'
			handleFail(type)
		});
};




/*********^*SIGN*UP*^***************************************************************************************************^*SIGN*UP*^*********************** */

/********V*NAVBAR*V*************************************************************************************************V*NAVBAR*V********************** */
function handleNav() {
	console.log('handlinNAV')
	$('body').on('click', 'button.eventDetailsLink', function (e) {
		e.preventDefault();
		getEventInfo()
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
};
/********^*NAVBAR*^**************************************************************************************************^*NAVBAR*^********************** */

/********V*LISTENERS*V**************************************************************************************************V*LISTENERS*V********************** */
/********^*LISTENERS*^**************************************************************************************************^*LISTENERS*^********************** */

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
	});
	$('body').on('click', 'button.userDeleteButton', function (e) {
		e.preventDefault();
		console.log('This is it ...')
		deleteUser()
	});
	
/*STOP EDIT */
	/************************ */
/*START INTRO */



	$('body').on('click', 'button.introLoginButton', function (e) {
		e.preventDefault();
		console.log('switching route for login')
		route = 'login'
		renderSignIn();
	});
	$('body').on('click', 'button.loginSubmit', function (e) {
		e.preventDefault();
		logIn(route);
	});

	$('body').on('click', 'button.introRegisterButton', function (e) {
		e.preventDefault();
		console.log('switching route for user create')
		renderSignUp();
	});
	$('body').on('click', 'button.eventNameButton', function (e) {
		e.preventDefault();
		route = 'login/eventCheck'
		checkEvent(route);
	});
		$('body').on('click', 'button.signUpSubmit', function (e) {
		e.preventDefault();
		route = 'login/create';
		signUp(route);
	});

	$('body').on('click', 'button.introCreateEventButton', function (e) {
		e.preventDefault();
		console.log('switching route for user create')
		createEvent()
	});
	$('body').on('click', 'button.newEventNameInput', function (e) {
		e.preventDefault();
		route = 'login/eventCheck'
		checkEventName(route);
	});
	$('body').on('click', 'button.newEventSubmit', function (e) {
		e.preventDefault()
		buildEvent();
	});
	

	$('body').on('click', 'button.toggleIntro', function (e) {
		e.preventDefault();
		toggleIntro()
	});
/*STOP INTRO */
}




function watchPageActions() {
	
	let postId;
	/*success response to home */
	$('body').on('click', 'button.successResponseButton', function (e) {
		e.preventDefault();
		console.log('going to home page!')
		$('.homePageView').remove()
		buildHome();
	});
	/*post title from list view to select single post */
	$('body').on('click', 'a.postTitle', function (e) {
		e.preventDefault();
		postId = $(this).attr('id')
		console.log('Just Building a home for the console dwarves!', postId)
		getPost(postId)
	});
	/*success response back to post */
	$('body').on('click', 'button.successResponseReturnButton', function (e) {
		e.preventDefault();
		console.log('lets double check what we did...!')
		getPost(postId);
	});
	/*toggle remove create comment form */
	$('body').on('click', 'button.cancelActionButton', function (e) {
		e.preventDefault();
		console.log('backing out, huh?')
		$('.cancelActionButton').replaceWith(commentButton)
		$('.palette').remove()
	});
	/*toggle create comment form */
	$('body').on('click', 'button.addComment', function (e) {
		e.preventDefault();
		$('.addComment').replaceWith(toggleButton)
		console.log('You may just be a bag full of soil', $(this).siblings())
		createComment()
	});
	/*submit new comment */
	$('body').on('click', 'button.commentFormSubmit', function (e) {
		e.preventDefault();
		console.log('DirtBag', $(this))
		let route = 'comments/create'
		postComment(route, postId)
	});

		/*comment remove */							/*************************************DELETE */
	$('body').on('click', 'button.removeComment', function (e) {
		e.preventDefault();
		console.log('Just put the Ants in the drawer!')
		let removalId = $(this).parent().attr('id')
		let authorId = $(this).parent().attr('data')
		deleteComment(removalId, postId, authorId)
	});
	/*post remove */
	$('body').on('click', 'button.postDeleteButton', function (e) {
		e.preventDefault();
		console.log('Just drop the ship then...')
		route = `posts/delete/${postId}`;
		deletePost(route, postId)
		
	});
	

	
}
/********^*LISTENERS*^**************************************************************************************************^*LISTENERS*^********************** */




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
	handleNav()
	watchFetchActions()
	watchPageActions()
	evalPageState()

})

