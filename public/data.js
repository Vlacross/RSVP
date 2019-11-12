let author;
let body;
let comments;
let title;
let date;
let checkInt;

let fullname;
let username;
let password;

let today = () => {
	let date = new Date()
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	let today = `${y}-${m}-${d}`

	return today;
}


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

const appInfo = 
`

<div class="appInfo">

<h2>welcome to RSVP,</h2><p> a simple online app for coordinating events!
Simply sign Up to start an event thread, set up an account 
to manage updates and content, then invite people to join 
under your unique event name so they can stay up-to-date 
on any last-second changes or notifications! This light-weight
 app has a simple platform that helps orchestrate many events 
 with many users, but is much smaller than main stream social 
 media apps! Click back to get started, or if you're already a 
 user, login!</p>

 <button class="toggleInfo back" type="submit" name="toggleInfo">Back</button>
</div>
`;




/**************PROMPTS*******************************************************************************************PROMPTS*************** */
/*Let user know delete success */
const deleteSuccessPrompt =
	`
<section class="deleteResponse prompt" >
	<h1>Success!</h1>
	<h3>details successfully deleted!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
</section>
`;


/*Let user know update success */
const updateSuccessPrompt =
	`
<section class="successResponse prompt" >
	<h1>Success!</h1>
	<h3>details successfully updated!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
</section>
`;

/*Let user know on post success */
const postSuccessPrompt =
	`
<section class="successResponse prompt" >
	<h1>Success!</h1>
	<h3>Content Posted!</h3>
	<p>Click home to go back to main post feed! </p>
	<button class="successResponseButton" name="successResponse">Home</button>
	<button class="successResponseReturnButton" name="successResponseReturn">Back</button>
</section>
`;


/*popup with details on returned fail */
var failedLogin =
	`<section class="failedResponse prompt" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Log in failed! Check your username and password and try again! </p>
		<button class="failedResponseButton" name="failedResponse">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
var failedUpdate =
	`<section class="failedUpdate prompt" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
var failedPost =
	`<section class="failedUpdate prompt" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
var failedDelete =
	`<section class="failedUpdate prompt" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Update failed! Check your username and password and try again! </p>
		<button class="failedUpdateButton" name="failedUpdate">Retry</button>
 </section>
 `;

/*popup with details on returned fail */
var eventNotFound =
	`<section class="noEvent prompt" >
	<h1>Woops!</h1>
	<h3>Couldn't find an event with that name!</h3>
	<p>Check your spelling and try again! </p>
	<button class="failedIntroButton" name="failedIntroButton">Retry</button>
</section>
`;

/*popup with details on returned fail */
var duplicateName =
	`<section class="nameTaken prompt" >
	<h1>Woops!</h1>
	<h3>Looks like that name is already being used!</h3>
	<p>Choose a different name and try again!</p>
	<button class="failedIntroButton" name="failedIntroButton">Retry</button>
</section>
`;

/*popup with details on returned fail */
var unauthorizedAccess =
	`<section class="unauthorized prompt" >
	<h1>Woops!</h1>
	<h3>looks like you entered incorrect credentials!</h3>
	<p>Check your spelling and try again! </p>
	<button class="failedUpdateButton" name="unauthorizedButton">Retry</button>
</section>
`;

/*popup with details on returned fail */
var protectedAccount =
	`<section class="failedUpdate prompt" >
	<h1>Woops!</h1>
	<h3>This account is protected!</h3>
	<p>You can not alter this account!</p>
	<button class="failedUpdateButton" name="failedUpdate">Retry</button>
</section>
`;


/**************PROMPTS*******************************************************************************************PROMPTS*************** */

function displayReject(resj, area) {

	let msg = resj.message
	let button;
	button = 'failedRejectButton';
if(!area) {
 button = 'failedIntroButton'
};

	var rejectResponse =
	`<section class="unauthorized prompt" >
		<h1>Woops!</h1>
		<h3>Something went wrong!</h3>
		<p>${msg} </p>
		<button class="${button}" name="failedIntroButton">Retry</button>
	</section>
`;

	return rejectResponse;



}



/**************PROMPTS*******************************************************************************************PROMPTS*************** */

/*************V*LOGIN*REGISTER*V*****************************************************************************************V*LOGIN*REGISTER*V************** */

/*for existing users to log in */
const loginForm =
	`

<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset">
	<div class="accessFieldsetDiv">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">


				<label for="userNameInput">Username</label>
					<input id="userNameInput" name="userNameInput" class="userNameInput loginput" type="text" required>
				

				<label for="userPassInput">PassWord</label>
					<input id="userPassInput" name="userPassInput" class="userPassInput loginput" type="password" required> 
					<button id="pw-show" class="pw-show">Show</button>
					
					<div class="demo-login-legend">
						<div class="login-legend-auto">
							<input class="autofill basic" type="button" value="autofill">
							<input class="autofill admin" type="button" value="autofill">
						</div>

						<div class="demo-login-legend-text" >
							<span class="demoSpanTop">DemoUser: <span class="demoNames">basicUser</span></span> 
							<span class="demoSpanTop">DemoPassword: <span class="demoNames">basicPass</span></span>
							
							<span class="demoSpanBottom">DemoAdmin: <span class="demoNames">big</span></span>
							<span class="demoSpanBottom">DemoAdminPass: <span class="demoNames">ben</span></span>
						</div>
					</div>

				<button class="loginputsubmit login-button" type="submit" name="submitButton">Submit</button>
					
	</fieldset>
		<div class="loginBackButton">
					<button class="toggleIntro login-button" type="submit" name="toggleIntro">Back</button>
		</div>		
	</div>
</form>

`;

/*checks if given event exists */
const eventCheck =
	`
<form class="eventCheck">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">

	<label for="eventNameCheck" class="eventNameCheckLabel " >Search for an event to sign up for</label>
		<input id="eventNameInput" name="eventNameInput" class="eventNameInput" type="text" required>
		<span>DemoEvent: <span class="demoNames">demoEvent</span></span>
	
	<div class="eventCheckButtons">
		<button class="eventNameButton">Find</button>

		<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>
	</div>
</form>
`

/*same as 'eventCheck', but different label and handled differently on output side */
const newEventCheck =
	`
<form class="eventCheck">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">

	<label for="eventNameInput" class="eventNameCheckLabel " >Pick a name for your event and check for availablility!	</label>
		<input id="eventNameInput" name="eventNameInput" class="eventNameInput" type="text" required>


	<div class="eventCheckButtons">
		<button class="newEventNameInput">Find</button>
		<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>
	</div>

</form>
`



/*form for new user */
const signupForm =

	`
<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset event">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">

			<label for="fullNameInput" class="fullNameLabel event" >FullName</label>
				<input id="fullNameInput" name="fullNameInput" class="fullNameInput event" type="text" required>
			

				<label for="userNameInput" class="userNameInputLabel event">UserName</label>
					<input id="userNameInput" name="userNameInput" class="userNameInput event" type="text" required>
				

				<label for="userPassInput" class="userPassInputLabel event">PassWord </label>
					<input id="userPassInput" name="userPassInput" class="userPassInput event" type="text" required>
				

				<div class="attending">
					<label for"going" class="goingLabel event">Going</label>
						<input type="radio" id="going" name="attendance" class="radioChoice" value="true" checked>
					
					<label for"notGoing" class="newGoingLabel event">Not Going</label>
						<input type="radio" id="notGoing" name="attendance" class="radioChoice" value="false" checked>
					
				</div>

						<button class="signUpSubmit event" type="submit" name="signUpSubmit">Submit</button>
	</fieldset>
			<div class="loginBackButton">
				<button class="toggleIntro" type="submit" name="toggleIntro">Back</button>
			</div>	
</form>
`;



/*form for creating a new event-- follows after creating host account / master admin */

function validateForm() {
	let form = $('.authform');
	let inputList = $('.authForm :input').serializeArray().splice(1);
	let submitButton = $('.newEventSubmit');

	let inputs = {
		eDate: () => ($('.dateOfEventInput')),
		eDesc: () => ($('.eventDescriptionInput')),
		eFull: () => ($('.fullNameInput')),
		eUser: () => ($('.userNameInput')),
		ePass: () => ($('.userPassInput')),
		eCont: () =>($('.userContactInfoInput'))
	}

	submitButton.attr('disabled', true);

	let dateCheck = (date) => (date >= today())
	let emailFormat = () => (/^[A-Za-z\d\.\-]+@+[A-Za-z\d\.\-]+(\.)+[A-Za-z\d\.\-]+$/g.test( inputs.eCont().val() ) ? true : false);
	let lengthCheck = (val, num) => (val.length >= num);

	let updateStatus = function() {

		let inputValidationStatus = {
			eDate: (dateCheck(inputs.eDate().val()) && inputs.eDate().removeClass('invalid')),
			eDesc: (lengthCheck(inputs.eDesc().val(), 4) && inputs.eDesc().removeClass('invalid')),
			eFull: (lengthCheck(inputs.eFull().val(), 4) && inputs.eFull().removeClass('invalid')),
			eUser: (lengthCheck(inputs.eUser().val(), 4) && inputs.eUser().removeClass('invalid')),
			ePass: (lengthCheck(inputs.ePass().val(), 4) && inputs.ePass().removeClass('invalid')),
			eCont: (emailFormat(inputs.eCont()) && lengthCheck(inputs.eCont().val(), 4) && inputs.eCont().removeClass('invalid'))
		}

		return inputValidationStatus;
	}

	function enableSubmit() {
		let stat = updateStatus();
		console.log(stat)
		let allInputs = Object.keys(stat).length;
		for (let k in stat) {
			if(!stat[k]) {
				submitButton.attr('disabled', true);
			}else {
				allInputs--
			}
			if(allInputs === 0) {
				submitButton.attr('disabled', false)
			}
		}
		return stat;
	}

	checkInt = window.setInterval(enableSubmit, 500)
	/*window.clearInterval(checkInt); */

	function errorMsg(input) {
		switch(input) {
			case 'eDate':
				return 'Invalid date!';
				break;
			case 'eDesc':
				return 'Description must contain at least 4 characters!';
				break;
			case 'eFull':
				return 'Fullname must contain at least 4 characters!';
				break;
			case 'eUser':
				return 'Username must contain at least 4 characters!';
				break;
			case 'ePass':
				return 'Password must contain at least 4 characters!';
				break;
			case 'eCont':
				return 'Invalid email format!';
				break;
		}
	}
	
	

	function invalidate(input, msg){
		console.log(msg)
		input.addClass('invalid')
		submitButton.attr('disabled', true)
		input.next().text(msg)
	}

	Object.keys(inputs).forEach(key => {
		inputs[key]()[0].onblur = function() {
			let status =  updateStatus()
			let msg = errorMsg(key)
			!status[key] && invalidate(inputs[key](), msg)
			
		}

		inputs[key]()[0].onfocus = function(e) {
			e.preventDefault();
			inputs[key]().next().empty()
		}

	})

};


function newEventForm(name) {

	let eventForm =

		`
<form class="authForm" autocomplete="off">
	<fieldset class="accessFieldset event">
		<input autocomplete="false" name="hidden" type="text" style="display:none;">

			<div class="eventInputGroup">
			<h2>Event Name: ${name}</h2>			
				<p>Enter Details for your new event!</p>
				<input class="eventName hidden" value="${name}">

				
				<label for="dateOfEventInput" class="dateOfEventLabel event">Choose a date for your event: </label>
					<input id="dateOfEventInput" name="dateOfEventInput" class="dateOfEventInput event" type="date" min="${today()}" required>
					<span id="eDate-error" class="input-error"></span>

				<label for="eventDescriptionInput" class="eventDescriptionLabel event">Add a quick description about your event: </label>
					<input id="eventDescriptionInput" name="eventDescriptionInput" class="eventDescriptionInput event" type="text" required>
					<span id="eDesc-error" class="input-error"></span>

			</div>

			<div class="adminInputGroups">

				<h2>Enter details for your new account!</h2>

				<label for="fullNameInput" class="fullNameLabel event" >FullName</label>
					<input id="fullNameInput" name="fullNameInput" class="fullNameInput event" type="text" autocomplete="nope">
					<span id="fName-error" class="input-error"></span>


				<label for="userNameInput" class="userNameLabel event">UserName</label>
					<input id="userNameInput" name="userNameInput" class="userNameInput event" type="text" autocomplete="nope" required>
					<span id="uName-error" class="input-error"></span>


				<label for="userPassInput" class="userPassLabel event">PassWord </label>
					<input id="userPassInput" name="userPassInput" class="userPassInput event" type="text" autocomplete="nope" required>
					<span id="uPass-error" class="input-error"></span>


				<label for="userContactInfoInput" class="userContactInfoLabel event">Enter an e-mail</label>
					<input id="userContactInfoInput" name="userContactInfoInput" class="userContactInfoInput event" type="email" autocomplete="nope" required>
					<span id="uCon-error" class="input-error"></span>

				</div>


						<button class="newEventSubmit event" type="submit" name="newEventSubmit">Submit</button>
	</fieldset>
				<div class="loginBackButton">
					<button class="toggleIntro new-event-back" type="submit" name="toggleIntro">Back</button>
				</div>
</form>
`;


	return eventForm;
}


/*************^*LOGIN*REGISTER*^*****************************************************************************************^*LOGIN*REGISTER*^************** */

/*eventFeed */

const eventLeadButton = 
`
<button type="submit" class="addPost navButton" name="addPost">AddPost</button>
`;

const eventAdminButton = 
`
<button type="submit" class="usersListLink navButton" name="usersListLink">Event Users</button>
<button class="deleteEventButton navButton" type="submit" name="deleteEventButton">Delete Event</button>
`

/*Main app home page- left-side nav bar */
let homePage =
	`
	<section class="homePageView">

	<div class="menuTab">
    <input type="button" class="menuTab menuTab-button" style="border-radius: 50%; position: absolute; left: -5%; top: -6%; border: none; background: none; margin: 0px;">
    	<span class="tabText">MENU</span>
		</input>
	</div>

					<nav class="siteNav">

						<button type="submit" class="eventNewsfeedLink navButton" name="eventNewsfeedLink">Event News Feed</button>
						<button type="submit" class="eventDetailsLink navButton" name="eventDetailsLink">Event Details</button>
						<button type="submit" class="accountLink navButton" name="accountLink">Account</button>
						<button type="submit" class="logOut navButton" name="Logout">Logout</button>
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
	let { fullname, joinDate, attending, id } = usr;
	let date = new Date(joinDate).toDateString();
	let usersListing =

		`
				<li class="userListing">
					<div class="userListingDiv">
						<p>Name: ${fullname}</p>
						<p>Join Date: ${date}</p>
						<p>Attending: ${attending}</p>
					</div>
					<div class="userManageButton" data="${id}">
						<button type="submit" class="userAccountButton" name="userAccountButton">Edit User Role</button>
						<button type="submit" class="accountDeleteButton" name="accountDeleteButton">Delete User</button>
					</div>
				</li>
				`;
	return usersListing;
};


/*************V*ACCOUNT*V*****************************************************************************************V*ACCOUNT*V************** */

/*Simple user account info card for current user to update details */

function accountProfile() {
	let user = JSON.parse(localStorage.getItem('user'));
	let { fullname, username, attending, joinDate } = user;
	let since = new Date(joinDate).toDateString();
	
	let accountDetails =
		`
	<section class="accountProfile">
				<div class="accountSpans">
					<span class="fullnameSpan">Fullname: ${fullname}</span>
					<span class="usernameSpan">Username: ${username}</span>
					<span class="attending">Attending: ${attending}</span>
					<span class="joinDate">Member Since: ${since}</span>
				</div>

				<div class="accountButton">
					<button type="submit" class="profileEditButton" name="profileEditButton">Edit profile</button>
				</div>
					
				</section>
				`;
	return accountDetails;

};

/*Simple user account info card for current user to update details */

function manageAccountProfile(user) {
	let { fullname, username, id } = user;
	let accountDetails =
		`
	<section class="accountManage">
				<div class="accountSpans">
					<span class="fullnameSpan">Fullname: ${fullname}</span>
					<span class="usernameSpan">Username: ${username}</span>
				
				<div class="role">

					<label for"admin1Radio">MasterAdmin
						<input type="radio" id="masterAdmin" name="role" class="radioChoice" value="1">
					</label>
		
					<label for"admin2Radio">Event Lead
						<input type="radio" id="eventAdmin" name="role" class="radioChoice" value="2">
					</label>

					<label for"userRadio">Basic User
						<input type="radio" id="user" name="role" class="radioChoice" value="3">
					</label>

				</div>


			</div>

				<div class="accountButtonManage" data="${id}">
					<button type="submit" class="accountManageSubmit" name="accountManageSubmit">Edit Role</button>
					<button type="submit" class="accountDeleteButton" name="accountDeleteButton">Delete User</button>
					<button class="toggleUserList">Back</button>
				</div>

					
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

								<label for="userPassInput">Current PassWord
	<input id="userPassInput" name="userPassInput" class="userPassInput" type="text" placeholder="Enter current password here" required>
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

function buildEventDetails(event) {
let { contactInfo, createdAt, dateOfEvent, host, name, attendees, summary } = event;

let detailPage = 
`
<section class="detailPage">
	<h1 class="dpName">${name}</h1>
	<p class="dpDate">${dateOfEvent}</p>

	<div>
		<p>Host: ${host}</p>
		<p>Contact @ ${contactInfo}</p>
		<p>Description of event: ${summary}</p>
		<p>number of people going: ${attendees.length}</p>
	</div>

</section>
`
return detailPage;

};



/*************^*EVENT*^*****************************************************************************************^*EVENT*^************** */

/*************V*POST*V*****************************************************************************************V*POST*V************** */

function constructPost() {

	let columns = $(window).width() < 500 ? 30 : 40

	const newPostForm =
		`
	<form class="postForm">
								<fieldset class="eventPost">

									<div class="form-inputs">

										<label for="title-input">Title:
	<input id="title-input" class="eventPostTitleInput" name="title-input" type="text" required>
	</label>

											<label for="content-input">Content:
	<textarea class="eventPostContentInput" cols="${columns}" rows="10" type="text" name="content-input"></textarea>
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
										<h3 class="postAuthor">By: ${author}</h3>
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







