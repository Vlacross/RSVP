


/*introView */

function renderSignIn() {
	console.log('Signing Up!')
	$('.introView').addClass('hidden')

	$('.accessView').removeClass('hidden')
};


function renderSignup() {
	console.log('Signing In!')
	$('.introView').addClass('hidden')
	$('.accessView').removeClass('hidden')
	$('.fullNameInput').removeClass('hidden').attr('required', true)
};

function watchIntro() {
		console.log('watchintro')
	$('body').on('click', '.introPageFieldset', function(e) {
		e.preventDefault();
		// console.log('triggered', event.target.name)
		if(event.target.name !== 'getLogIn') {
			renderSignup()}
		else {renderSignIn()}
	})
};






function promptAuth() {
		$('body').on('submit', '.othForm', function(e) {
			e.preventDefault();
			const id = document.getElementsByClassName('userNameInput')[0];
			const pwd = document.getElementsByClassName('userPassInput')[0];
			const logIn = {
					username: id.value,
					password: pwd.value
				};
				
			fetch('login', {
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
		promptAuth()
		
})