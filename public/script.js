


/*introView */

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
		console.log('watchintro')
	$('body').on('click', '.introPageFieldset', function(e) {
		e.preventDefault();
		// console.log('triggered', event.target.name)
		if(event.target.name !== 'getLogIn') {
			renderSignUp()}
		else {renderSignIn()}
	})
};


function promptAuth(route) {
	console.log(route, 222)
		$('body').on('submit', '.authForm', function(e) {
			e.preventDefault();
			const fullname = document.getElementsByClassName('fullNameInput')[0];
			const id = document.getElementsByClassName('userNameInput')[0];
			const pwd = document.getElementsByClassName('userPassInput')[0];
			const logIn = {
					fullname: fullname.value,
					username: id.value,
					password: pwd.value
				};
				console.log(fullname, 'preauth send')
			fetch(route, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(logIn)
			})
			.then(res => console.log(res.status))
			.catch(err => console.log(err))
		})
};


$(document).ready(function() {
	console.log('hittingJQscript!')
	watchIntro()

		
})