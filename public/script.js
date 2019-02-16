















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
		promptAuth()
		
})