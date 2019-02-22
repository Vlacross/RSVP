let author; 
let body; 
let comments; 
let title;
let date;

let fullname;
let username;
let password;


function quickFetch(route, method) {
	
	token = localStorage.getItem('token')
	return fetch(route, {
		method: method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer' + ' ' + token
		}
	})

};


/*Let user know delete success */
const deleteSuccessPrompt = 
`
<section class="deleteResponse" >
	<h1>Success!</h1>
	<h3>details successfully deleted!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
</section>
`;


/*Let user know update success */
const updateSuccessPrompt = 
`
<section class="successResponse" >
	<h1>Success!</h1>
	<h3>details successfully updated!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
</section>
`;

/*Let user know on post success */
const postSuccessPrompt = 
`
<section class="successResponse" >
	<h1>Success!</h1>
	<h3>Content Posted!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
	<button class="successResponseReturnButton" name="successResponseReturn">Back</button>
</section>
`;


/*popup with details on returned fail */
 var failedLogin =
	`<section class="failedResponse" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Log in failed! Check your username and password and try again! </p>
		<button class="failedResponseButton" name="failedResponse">Retry</button>
 </section>
 `;

 /*popup with details on returned fail */
 var failedUpdate =
	`<section class="failedUpdate" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
	var failedPost =
	`<section class="failedUpdate" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
	var failedDelete =
	`<section class="failedUpdate" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*eventFeed */

/*Main app home page- left-side nav bar */
let homePage =
	`
	<section class="homePageView">

	<nav class="siteNav">
		
		<button type="submit" class="usersListLink" name="usersListLink">Event Users</button>
		<button type="submit" class="eventDetailsLink" name="eventDetailsLink">Event Details</button>
		<button type="submit" class="eventNewsfeedLink" name="eventNewsfeedLink">Event News Feed</button>
		<button type="submit" class="accountLink" name="accountLink">Account</button>
		<button type="submit" class="logOut" name="Logout">Logout</button>
		<button type="submit" class="addPost" name="addPost">AddPost</button>
	</nav>

	<section class="viewWrapper">
		<span>viewing some of all topic posts</span>
		<ul class="updatePosts">

		</ul>
		<span>viewing some of all topic posts</span>
	</section>

</section>

`;

function viewSwitch(currentView) {

let viewWrap =
`
<section class="viewWrapper">${currentView}</section>
`;
return viewWrap;
}

/*List of users in DB with role="atendee" */

function usersListing(usr) {
let { fullname } = usr;
let usersListing =

`
<li>
	<p>${fullname}</p>
</li>
`;
return usersListing;
};


/*Simple user account info card for current user to update details */

function accountProfile() {
	let user = JSON.parse(localStorage.getItem('user'));
	console.log(user, "inprof");
let { fullname, username } = user;
let accountDetails = 
`
<section class="accountProfile">
	<span class="fullnameSpan">Fullname: ${fullname}</span>
	<span class="usernameSpan">Username: ${username}</span>
	<span  class="passwordSpan">Password: ${password}</span>
	<button type="submit" class="profileEditButton" name="profileEditButton">Edit profile</button>
</section>
`;
return accountDetails;

};

function editProfile() {
	let user = JSON.parse(localStorage.getItem('user'));
	let { fullname, username } = user;

	const editForm =
`
				<form class="accountEditForm" autocomplete="off">
					<fieldset class="updateFieldset">		
						
	
						<label for="fullNameInput" class="fullNameLabel" >FullName
							<input id="fullNameInput" name="fullNameInput" class="fullNameInput" type="text" value="${fullname}">
						</label>
	
						<label for="userNameInput">Username
							<input id="userNameInput" name="userNameInput" class="userNameInput" type="text" value="${username}" required>
						</label>
	
						<label for="userPassInput">New PassWord
							<input id="userPassInput" name="userPassInput" class="userPassInput" type="text" placeholder="Enter new password here" required>
						</label>
						
						<button class="editSubmitButton" type="submit" name="editSubmitButton">Submit</button>

					</fieldset>
				</form>


`;
return editForm;
};


function constructPost() {

	const newPostForm =
`
	<form class="postForm">
		<fieldset class="eventPost">
		
			<div class="form-inputs">

				<label for="title-input">Title: 
					<input id="title-input" class="eventPostTitleInput" name="title-input" type="text" required>
				</label>

				<label for="content-input">Content: 
					<textarea class="eventPostContentInput" cols="40" rows="10" type="text" name="content-input"></textarea>
				</label>

				<button class="postFormSubmit" type ="submit">Post</button>

			</div>

		</fieldset>
	</form>

`;
return newPostForm;
};

/*template for event topic posts */

function eventPost(post, count) {
	let { title, author, body, comments, id, createdAt } = post;
	let date =  new Date(createdAt).toDateString();
	let eventPost =
`
<li  class="eventPost">

	<div class="subPostTitle">
		<a tabindex="${count}" class="postTitle" id="${id}">Title: ${title}</a>
	</div>

	<div class="subPost">
		<h3>By: ${author}</h3>
		<p>Posted on ${date}</p>
	</div>

	<p>${body}</p>
	<p>${comments.length} Comments</p>
	
</li>
`;
return eventPost;
};

/* compile comment Data into DOM content*/

function buildComment(comment) {
let { listing, text, id, createdAt } = comment;

let date =  new Date(createdAt).toDateString()
let remark = 
`
<li class="commentListing" id="${id}">

	<p>posted: ${date}</p>
	<h3>${listing}</h3>
	<p>${text}</p>
	<button class="removeComment">remove</button>
</li>
`;
return remark;
}

function generateRemarks(comments) {

	if(comments.length === 0) {
		let noComments = 
	`
	<li>
	<p>No Comments Yet!</p>
	</li>
	`;
	return noComments;
	};


	let commentList = []
	comments.forEach(comment => {
										let readable = buildComment(comment)
										commentList.push(readable)
	});

	
	return commentList.join(' ');
};


/*template for single-topic posts */

function buildPost(post) {
	let { title, author, body, comments, id, createdAt } = post;
	console.log('commies');
	let remarks = generateRemarks(comments);
	let date =  new Date(createdAt).toDateString();
	
	

	let eventPost =


`
<li  class="eventPost">

	<div class="subPostTitle">
		<h1 class="postTitle">Title: ${title}</h1>
	</div>

	

	<div class="subPost">
		<h3>By: ${author}</h3>
		<h3>Posted on ${date}</h3>
	</div>

	<p>${body}</p>

	<div class="subPostComment">

			<div class="postButtons">
				<button class="addComment">Comment</button>
				<button class="postDeleteButton" data="${id}">Remove Post</button>
			</div>
		<ul class="commentsList">${remarks} </ul>
	</div>

</li>

`;
return eventPost;
};

const toggleButton =
`
	<button class="cancelActionButton">Cancel</button>
`;

const commentButton =
`
<button class="addComment">Comment</button>
`;



function commentPalette() {

	let palette = 
`
<li class="palette">

	<form class="commentForm">
		
		<div class="form-inputs">

			<label for="content-input">
				<textarea class="commentContentInput" cols="60" rows="8" type="text" name="content-input" placeholder="Enter your comment here"></textarea>
			</label>

			<button class="commentFormSubmit" type ="submit">Post</button>

		</div>

		
	</form>

</li>


`;
return palette;
};


