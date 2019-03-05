<h1> <a href="https://rsvp-no-regrets.herokuapp.com">RSVP</a> </h1>

<a id="backToTop"></a>

<p>Applied Technologies: Javascript, JQuery, Express, Mongoose</p>

<p>Simple app to assist in event planning and coordinating.</p>
<ul>
<li><a href="#userRoles">User Roles</a></li>
<li><a href="#screenShots">ScreenShots</a></li>
<li><a href="#apiRoutes">API Docs</a></li>
</ul>
<section>
<a id="userRoles"><h2>User Roles</h2></a>



<p>MaterAdmin account role becomes so on creation of a new event. Has the ability to delete users, create and delete posts and comments.</p>
<p>EventLead account role is assigned by the MasterAdmin. Can create and delete new posts or comments. Does not have access to manage registered users.</p>
<p>BasicUser account is the default role for new accounts. Access to read event epdates and leave comments. Can delete it's owns comments or edit it's information when submitted with it's password</p>

</section>



<section id="screenShots">
<a href="#backToTop">Back to the Top</a>
  <h2>ScreenShots</h2>

<h3>App Info</h3>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appInfo.jpeg?raw=true" alt="short-app-explanation-screenshot">

<h3>Introduction Page</h3>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/landing.jpeg?raw=true" alt="introduction-landing-page-screenshot">

<h3>New Event</h3>
  <p>Choose a name</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/newEvent/newEvent.jpeg?raw=true" alt="new-event-name-input-screenshot">
  <p>Fill out event details</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/newEvent/newEventDetails.jpeg?raw=true" alt="form-for-new-event-screenshot">

<h3>New User Account</h3>
  <p>Search for an event by name</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/newUser/signUp.jpeg?raw=true" alt="search-for-event-name-screenshot">
  <p>Fill out account details</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/newUser/newUserForm.jpeg?raw=true" alt="newUser-signUp-form-screenshot">

<h3>App Usage</h3>
  <p>Homepage Event Updates</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appUse/HomepageFeed.jpeg?raw=true" alt="homePage-event-update-feed-screenshot">

  <p>User Accout Details</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appUse/accountDetails.jpeg?raw=true" alt="user-account-details-screenshot">

  <p>Account Details Edit</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appUse/accountEdit.jpeg?raw=true" alt="Account-edit-form-screenshot">

  <p>Event Details</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appUse/eventDetails.jpeg?raw=true" alt="event-details-screenshot">

  <p>Single Post View</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/appUse/singlePostWithComments.jpeg?raw=true" alt="single-post-view-with-comment-palette-screenshot">

<h3>Login Screen</h3>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/login/login.jpeg?raw=true" alt="login-screen-screenshot">

<h3>Admin Account</h3>
  <p>Admin Home View</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/AdminUse/AdminHome.jpeg?raw=true" alt="admin-event-feed-view-screenshot">

  <p>Event User List</p>
  <img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/AdminUse/AdminEventUserList.jpeg?raw=true" alt="admin-view-event-user-list-with-roles-screenshot">

<h3>Mobile Navbar</h3>

<p>Hidden Nav Tab</p>
<img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/mobileNav/hiddenNav.jpeg?raw=true" alt="hidden-nav-tab-screenshot">

<p>Exposed Nav Tab</p>
<img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/mobileNav/exposedNavTab.jpeg?raw=true" alt="exposed-nav-tab-screenshot">

<p>Mobile Nav Menu</p>
<img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/mobileNav/mobileNav.jpeg?raw=true" alt="mobile-nav-menu-screenshot">


</section>


<section class="apiRoutes">

<a id="apiRoutes"><h1>API Routes</h1></a>
<a href="#backToTop">Back to the Top</a>

<p>The api for the app has 5 main routes from the server root</p>
<h2>Root(/)</h2>

<h3>comments</h3>
  <p>/create(allows users to leave comments)</p>
  <p>/delete:id(allows users to remove comments)</p>

<h3>events</h3>
  <p>find:id(allows the app-client to search for existing events)</p>

<h3>login</h3>
  <p>create(allows users to create an account)</p>
  <p>eventCheck(allows the app-client to check the availability of a unique event name)</p>
  <p>newEvent(allows a user to create a new event)</p>

<h3>posts</h3>
  <p>create(allows authorized users to leave updates about event)</p>
  <p>delete:id(allows authorized users to remove updates)</p>
  <p>find:id(allows app-client to search for list of update posts related to current user's event)</p>
  <p>findPost:id(allows app-client to render more accurate data about specific update post)</p>

<h3>users</h3>
  <p>details(allows users to update details on their account)</p>
  <p>find:id(allows MasterAdmin to search a list ofevent users and their roles)</p>
  <p>findOne:id(allows users to obtain account data when they pass authorization)</p>
  <p>roles(allows MasterAdmin to change user roles)</p>



<h3>API Routes Tree</h3>

<img src="https://github.com/Vlacross/RSVP/blob/master/public/siteImages/apitTreeDoc.png?raw=true" alt="api-routes-in-terminal-tree-diagram">

<a href="#backToTop">Back to the Top</a>
</section>




















