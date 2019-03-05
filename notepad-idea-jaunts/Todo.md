-Build Tests!!
    -should have been done since the project started to practice integration testing
        -Test each routes folder
        
- ** - Finish deletes
        -allow user to delete self with roles in place(maybe without moving route to unprtoected endpoint?)
        -eventually find more elequant way to populate/depopulate comment Ids into post data without double fetching

-Maybe regroup listeners?


-Build delete "double-check"
        -prompts "are you sure" on delete
***************
USERS
***************
-Add validation for making sure username is unique
        (and just regular validation as well)
        -create min-max length
        -refuse whitespace

-Show joinDate and attending status on full user list



***************
POSTS
***************
-debug pre-remove comment delete. Working fine as a double db call, but would be nice to use pre-hooks  - /*https://github.com/Automattic/mongoose/issues/3054 */

-Either remove or configure back button on create(need to assign res.postId to a nother function to GET post)

***************
Comments
***************


***************
EVENTS LAYER
***************

*-Build Event Details data and render sheet with link on nav tab

-Seperate checkWare file into two files: role-authentication and credentials validation

-add roles

-make dashboard for master admin to change roels of other users

***************
BUGS AND BREAKS
***************
-make a new template for Post create success and tie the back button to getPost with new post id(currently sharing with )

-currently reFiring pre-save User id push to event when user updates







