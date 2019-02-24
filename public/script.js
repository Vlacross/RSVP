

/*allows toggle between signing in and creating a new user */
function toggleIntro() {
	$('.introView').removeClass('hidden');
	$('.accessView').addClass('hidden');
	$('.fullNameLabel').addClass('hidden').attr('required', false);
};

/*changes the view and prompts login */
function renderSignIn() {

	console.log('Signing In!');
	$('.introView').addClass('hidden');
	$('main').append(introViewSwitch(loginForm))
	promptAuth();
	/*listens for loginSubmit */
};

/*changes the view and prompts for details to create a new user */
function renderSignUp() {

	console.log('Signing Up!');
	$('.introView').addClass('hidden');
	$('.accessView').removeClass('hidden');
	$('.fullNameLabel').removeClass('hidden').attr('required', true);
	promptAuth();
};


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
			// logOut()
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
	let updatedUser = {
		id: user.id,
		fullname: fullName,
		username: userName,
		password: pwd
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

	let route = 'users/find';
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
		body: content
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

	let route = 'posts/find';
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
	let route = `posts/find/${postId}`;
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


function purgeComments(postId) {
	console.log('at purge')
	let method = 'delete';
	let route = `posts/purgeComments/${postId}`
	console.log(route)

	quickFetch(route, method) 
	.then(res => {
		console.log('comments purged')
	})
}

function deletePost(route) {
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
		text: text
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
			let route = `posts/comment/${postId}`
			let populateNew = {
				postId: postId,
				commentId: resj.id
			}
			fetch(route, {
				method: 'put',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer' + ' ' + token
				},
				body: JSON.stringify(populateNew)
			})
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
function deleteComment(removalId, postId) {
	let route = `comments/delete/${removalId}`;
	console.log('...theres just nothing left to say...');
	console.log('route', route);
	fetch(route, {
		method: 'delete',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer' + ' ' + token
		}
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

/*********BUILDHOME*********** */
function buildHome() {

	$('main').addClass('sinkBack');
	$('body').prepend(homePage);
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
	$('.userNameInput').val('');
	$('.userPassInput').val('');
	
};

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
};
/*********^*LOGOUT*^***************************************************************************************************^*LOGOUT*^*********************** */


/*********V*LOGIN*V***************************************************************************************************V*LOGIN*V*********************** */
// function promptAuth() {

// 	const fullname = $('.fullNameInput').val('');
// 	const id = $('.userNameInput').val('');
// 	const pwd = $('.userPassInput').val('');
// };

/*Initial User Login */
function logIn(route) {
	console.log(`sending fetch to ${route}`);
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
			buildHome()
		})
		.catch(err => {
			console.log('loginFail')
			let type = 'login'
			handleFail(type)
		});
};
/********^*LOGIN*^*************************************************************************************************^*LOGIN*^********************** */


/********V*NAVBAR*V*************************************************************************************************V*NAVBAR*V********************** */
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
		route = 'login/create'
		renderSignUp();
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
		console.log('Just Building a home for the console dwarves!')
		postId = $(this).attr('id')
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
		deleteComment(removalId, postId)
	});
	/*post remove */
	$('body').on('click', 'button.postDeleteButton', function (e) {
		e.preventDefault();
		console.log('Just drop the ship then...')
		route = `posts/delete/${postId}`
		purgeComments(postId)
		deletePost(route)
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

