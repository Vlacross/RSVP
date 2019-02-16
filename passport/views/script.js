


var authToken;












function promptAuth() {
	const loginForm = `
    <form action="./loggin" class="othForm">
			<label for="userNameInput">UserId
				<input id="userNameInput" name="userNameInput" class="userNameInput" type="text">
			</label>
			<label for="userPassInput">PassWord
				<input id="userPassInput" class="userPassInput" type="text">
			</label>
		</form>
		<input class="submit" type="submit" val="submit">
		
		<input class="resubmit" type="submit" val="resubmit">`

	$('.loadLogin').append(loginForm)


	$('body').on('click', '.submit', function (e) {
		e.preventDefault();
		const id = document.getElementsByClassName('userNameInput')[0];
		const pwd = document.getElementsByClassName('userPassInput')[0];
		const logIn = {
			username: id.value,
			password: pwd.value
		};
		fetch('../login/', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(logIn)
		})
			.then(res => res.json())
			.then(resj => fetch('./check', {
				method: 'get',
				headers: {
					'Authorization': `Bearer ${resj.token}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}))
			.catch(err => console.log(err))

	})

	$('body').on('click', '.resubmit', function (e) {
		console.log('resubbin mittens')
	})

};


$(document).ready(function () {
	console.log('hittingJQscript!')
	promptAuth()

})






// fetch('./check', {
// 	method: 'get',
// 	headers: {
// 		'Authorization': `Bearer ${resj}`,
// 		'Accept': 'application/json',
// 		'Content-Type': 'application/json'
// 	}
// })
