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


function viewSwitch(currentView) {

	let viewWrap =
		`
<section class="viewWrapper">${currentView}</section>
`;
	return viewWrap;
};


function introViewSwitch(currentView) {

	let viewWrap =
		`
<section class="accessView">${currentView}</section>
`;
	return viewWrap;
}


/**************PROMPTS*******************************************************************************************PROMPTS*************** */
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

/*popup with details on returned fail */
var noEvent =
	`<section class="noEvent" >
	<h1>Woops!</h1>
	<h3>Couldn't find an event with that name!</h3>
	<p>Check your spelling and try again! </p>
	<button class="noEventButton" name="noEventButton">Retry</button>
</section>
`;

/**************PROMPTS*******************************************************************************************PROMPTS*************** */

/*************V*LOGIN*REGISTER*V*****************************************************************************************V*LOGIN*REGISTER*V************** */

/*for existing users to log in */
const loginForm =
	`
<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">

				<label for="userNameInput">UserId--demoUser: "big"
					<input id="userNameInput" name="userNameInput" class="userNameInput" type="text" required>
				</label>

				<label for="userPassInput">PassWord-demoPassword: "ben"
					<input id="userPassInput" name="userPassInput" class="userPassInput" type="text" required>
				</label>

				<button class="loginSubmit" type="submit" name="submitButton">Submit</button>
					
	</fieldset>
					<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>

</form>

`;

/*checks if given event exists */
const eventCheck =
	`
<form class="eventCheck">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">

	<label for="eventNameCheck" class="eventNameCheckLabel " >Search for an event to sign up for
		<input id="eventNameInput" name="eventNameInput" class="eventNameInput" type="text">
	</label>

	<button class="eventNameButton">Find</button>

	<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>

</form>
`

/*same as 'eventCheck', but different label and handled differently on output side */
const newEventCheck =
	`
<form class="eventCheck">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">

	<label for="eventNameInput" class="eventNameCheckLabel " >Pick a name for your event and check for availablility!
		<input id="eventNameInput" name="eventNameInput" class="eventNameInput" type="text">
	</label>

	<button class="newEventNameInput">Find</button>

	<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>

</form>
`



/*form for new user */
const signupForm =

	`
<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">

			<label for="fullNameInput" class="fullNameLabel " >FullName
				<input id="fullNameInput" name="fullNameInput" class="fullNameInput" type="text">
			</label>

				<label for="userNameInput">UserName
					<input id="userNameInput" name="userNameInput" class="userNameInput" type="text" required>
				</label>

				<label for="userPassInput">PassWord 
					<input id="userPassInput" name="userPassInput" class="userPassInput" type="text" required>
				</label>

				<div class="attending">
					<label for"going">Going
						<input type="radio" id="going" name="attendance" class="radioChoice" value="true" checked>
					</label>
					<label for"notGoing">Not Going
						<input type="radio" id="notGoing" name="attendance" class="radioChoice" value="false" checked>
					</label>
				</div>

						<button class="signUpSubmit" type="submit" name="signUpSubmit">Submit</button>
	</fieldset>
					<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>
</form>
`;



/*form for creating a new event-- follows after creating host account / master admin */
function newEventForm(name) {
	let today = new Date()

	let eventForm =

		`
<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">


				<h2>Enter Details for your new event!</h2>
				<input class="eventName hidden" value="${name}">
				<p>Event Name: ${name}</p>			

				
				<label for="dateOfEventInput">Choose a date for your event: 
					<input id="dateOfEventInput" name="dateOfEventInput" class="dateOfEventInput" type="date" min="${today}" required>
				</label>

				<label for="eventDescriptionInput">Add a quick description about your event: 
					<input id="eventDescriptionInput" name="eventDescriptionInput" class="eventDescriptionInput" type="text" required>
				</label>

				<h2>Enter details for your new Event-Host account!</h2>

				<label for="fullNameInput" class="fullNameLabel" >FullName
					<input id="fullNameInput" name="fullNameInput" class="fullNameInput" type="text">
				</label>

				<label for="userNameInput">UserName
					<input id="userNameInput" name="userNameInput" class="userNameInput" type="text" required>
				</label>

				<label for="userPassInput">PassWord 
					<input id="userPassInput" name="userPassInput" class="userPassInput" type="text" required>
				</label>

				<label for="userContactInfoInput">Enter an e-mail
					<input id="userContactInfoInput" name="userContactInfoInput" class="userContactInfoInput" type="email" required>
				</label>


						<button class="newEventSubmit" type="submit" name="newEventSubmit">Submit</button>
	</fieldset>
					<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>
</form>
`;

	return eventForm;
}


/*************^*LOGIN*REGISTER*^*****************************************************************************************^*LOGIN*REGISTER*^************** */

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

/*List of users in DB with role="atendee" */

function usersListing(usr) {
	let { fullname, joinDate, attending } = usr;
	let date = new Date(joinDate).toDateString();
	let usersListing =

		`
				<li class="userListing">
					<p>Name: ${fullname}</p>
					<p>Join Date: ${date}</p>
					<p>Attending: ${attending}</p>
				</li>
				`;
	return usersListing;
};


/*************V*ACCOUNT*V*****************************************************************************************V*ACCOUNT*V************** */

/*Simple user account info card for current user to update details */

function accountProfile() {
	let user = JSON.parse(localStorage.getItem('user'));
	console.log(user, "inprof");
	let { fullname, username, attending } = user;
	let accountDetails =
		`
	<section class="accountProfile">
					<span class="fullnameSpan">Fullname: ${fullname}</span>
					<span class="usernameSpan">Username: ${username}</span>
					<span class="attending">Attending: ${attending}</span>
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

	<div class="attending">

		<label for"going">Going
			<input type="radio" id="going" name="attendance" class="radioChoice" value="true" checked>
		</label>

		<label for"notGoing">Not Going
			<input type="radio" id="notGoing" name="attendance" class="radioChoice" value="false" checked>
		</label>
	</div>

					<button class="editSubmitButton" type="submit" name="editSubmitButton">Submit</button>
					<button class="userDeleteButton" type="submit" name="userDeleteButton">delete</button>
	
	</fieldset>
	</form>


							`;
	return editForm;
};
/*************^*ACCOUNT*^*****************************************************************************************^*ACCOUNT*^************** */


/*************V*EVENT*V*****************************************************************************************V*EVENT*V*****************/
/*************^*EVENT*^*****************************************************************************************^*EVENT*^************** */





/*************V*POST*V*****************************************************************************************V*POST*V************** */

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

											<button class="postFormSubmit" type="submit">Post</button>
	
	</div>
	
	</fieldset>
	</form>

								`;
	return newPostForm;
};

/*template for event topic posts */

function eventPost(post, count) {
	let { title, author, body, comments, id, createdAt } = post;
	let date = new Date(createdAt).toDateString();
	let eventPost =
		`
	<li class="eventPost">

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



/*template for single-topic posts */

function buildPost(post) {
	let { title, author, body, comments, id, createdAt } = post;
	console.log('commies');
	let remarks = generateRemarks(comments);
	let date = new Date(createdAt).toDateString();

	let user = JSON.parse(localStorage.getItem('user'))

	let deleteButton =
	`
	<button class="postDeleteButton" data="${id}">Remove Post</button>
	`

	let buttons = 
	`
	<button class="addComment">Comment</button>
	
	`
if(user.role < 3) {
	buttons = buttons + deleteButton 
}

	let eventPost =


		`
<li class="eventPost">

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
			${buttons}
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
/*************^*POST*^*****************************************************************************************^*POST*^************** */

/*************V*COMMENTS*V*****************************************************************************************V*COMMENTS*V************** */


/* compile comment Data into DOM content*/

function buildComment(comment) {
	let { listing, text, id, createdAt } = comment;

	let date = new Date(createdAt).toDateString()

	let user = JSON.parse(localStorage.getItem('user'))
	console.log('lsiting id', comment)

	let deleteButton =

		`
<button class="removeComment">remove</button>
`


	let content =
		`
								<p>posted: ${date}</p>
									<h3>${listing}</h3>
									<p>${text}</p>
								`

	if (user.id === comment.userId.id || user.role < 3) {
		content = content + deleteButton
	}

	let remark =
		`
	<li class="commentListing" id="${id}" data="${comment.userId.id}">

									${content}
								</li>
								`;
	return remark;
}

function generateRemarks(comments) {

	if (comments.length === 0) {
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


function commentPalette() {

	let palette =
		`
	<li class="palette">

									<form class="commentForm">

										<div class="form-inputs">

											<label for="content-input">
												<textarea class="commentContentInput" cols="60" rows="8" type="text" name="content-input" placeholder="Enter your comment here"></textarea>
											</label>

											<button class="commentFormSubmit" type="submit">Post</button>

										</div>


									</form>

								</li>


								`;
	return palette;
};

/*************^*COMMENTS*^*****************************************************************************************^*COMMENTS*^************** */







(route, method, body)