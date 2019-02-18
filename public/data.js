let author; 
let body; 
let comments; 
let title;
let date;



/*popup with details on returned fail */
 var failedLogin =
	`<section class="failedResponse" >
    <h1>Woops!</h1>
    <h3>Looks like something went wrong!</h3>
		<p>Log in failed! Check your username and password and try again! </p>
		<button class="failedResponseButton" name="failedResponse">Retry</button>
 </section>`;




/*Main app home page- left-side nav bar */
let homePage =
	`
	<section class="homePageView">

	<nav class="siteNav">
		<a class="eventDetailsLink">Event Details</a>
		<a class="usersListLink">Event Users</a>
		<a class="eventNewsfeedLink">Event News Feed</a>
		<a class="accountLink">Account</a>
	</nav>

	<section class="eventFeed">
		<span>viewing some of all topic posts</span>
		<ul class="updatePosts">

		</ul>
		<span>viewing some of all topic posts</span>
	</section>

</section>

`;

function tester(title) {

let test =
`
<li>${title}</li>
`
return test;
}

/*template for event topic posts */

function eventPost(post) {
	let { title, author, body, comments } = post
	let eventPost =
`
<li>
	<h1 class="postTitle">${title}</h1>
	<h3>${author}</h3>
	<h3>${date}</h3>
	<p>${body}</p>
	<p>${comments}</p>
</li>

`
return eventPost
}


/*List of users in DB with role="atendee" */
usersList = 
`

`;


