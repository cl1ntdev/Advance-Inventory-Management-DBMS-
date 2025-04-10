var loginContainer = document.querySelector('.login-container')
const AccountAssign = (account) => {
    console.log(account)
    const user = new User(account[0].Username,account[0].RoleID)
    var baseRole = (account[0].RoleID == 1 ? "Admin" : account[0].RoleID == 2 ? "Salesperson" : "Inventory Clerk")
    user.status = "logined";
    userContext = user // set the current login user to check type shi
    loginContainer.style.display = 'none';
    
    document.querySelector('.user-info').innerHTML = `
        <h5>Logged in as User:${user.Username}  Role: ${baseRole}</h5>
        <h5 class="logout" onclick="logoutAccount()">logout</h5>
    `
    Initialize(user);
}

