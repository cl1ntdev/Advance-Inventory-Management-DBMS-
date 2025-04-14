var userContext; 
var loginContainer = document.querySelector('.login-container')
var userRolePanel = document.querySelector('.user-role-panel')
// loginContainer.style.display = 'none'
userRolePanel.style.display = 'none'
window.onload = ()=>{
    showLoginPanel();
}



// FUNCTIONS WHAT USER CLICKS
var currentCrud = "Add"
var currentSideBar = "Product"

const devModeOn = () =>{
    loginContainer.style.display = 'none'
    userRolePanel.style.display = 'flex'

}

// devModeOn()