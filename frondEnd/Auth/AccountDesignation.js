var loginContainer = document.querySelector('.login-container')
const AccountAssign = (account) => {
    console.log(account)
    const user = new User(account[0].Username,account[0].RoleID)
    user.status = "logined";
    userContext = user // set the current login user to check type shi
    loginContainer.style.display = 'none';

    Initialize(user);
}