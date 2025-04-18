var _content = document.querySelector('.content') // content in index.html

const showLoginPanel = () => {
    _content.innerHTML = `
    <!-- From Uiverse.io by bociKond --> 
            <form class="form user-login-panel">
                <span class="input-span">
                    <label for="email" class="label">Email</label>
                    <input type="email" name="email" id="email"
                </span>
                <span class="input-span">
                    <label for="password" class="label">Password</label>
                    <input type="password" name="password" id="password"
                </span>
                
                 <select name="role" id="role" class="select-input">
                    <option value="Admin">Admin</option>
                    <option value="Salesperson">Salesperson</option>
                </select>
                <input class="submit" onclick="login()" type="submit" value="Log in" />
            </form>
    `
}

{/* <span class="span"><a href="#">Forgot password?</a></span>
<span class="span">Don't have an account? <a href="#">Sign up</a></span> */}

var login = () =>{
    var username = document.querySelector('#email').value.trim()
    var password = document.querySelector('#password').value.trim()
    var role = document.querySelector('#role').value.trim()
    console.log(username)
    var baseRole = (role == "Admin" ? 1 : role == "Salesperson" ? 2 : 3)
    const userInput = {
        Username: username,
        Password: password,
        Role: baseRole
    }
    VerifyAccount(userInput); //sends user input to verify account (.js)
}
