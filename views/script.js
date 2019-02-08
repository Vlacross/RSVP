















function promptAuth() {
    const loginForm = `
    <form class="othForm">
			<label for="userNameInput">UserId
				<input id="userNameInput" name="userNameInput" class="userNameInput" type="text">
			</label>
			<label for="userPassInput">PassWord
				<input id="userPassInput" class="userPassInput" type="text">
			</label>
		</form>
		<input class="submit" type="submit" val="submit">`

		$('.loadLogin').append(loginForm)

	
		$('body').on('click', '.submit', function(e) {
			e.preventDefault();
			const id = document.getElementsByClassName('userNameInput')[0];
			const pwd = document.getElementsByClassName('userPassInput')[0];
			const logIn = {
					userName: id.value,
					passWord: pwd.value
				};
			
			fetch('../auth', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				user: JSON.stringify(logIn)
			})
			.then(res => console.log(res.status))
			.catch(err => console.log(err))
		})
};


$(document).ready(function() {
    console.log('hittingJQscript!')
		promptAuth()
		
})