var sideBar = document.querySelector('.sidebar')


const Initialize = (user) =>{
    const userRole = user.RoleID;
    userRolePanel.style.display = 'flex'
    
    switch(userRole){
        case 1:
            sideBar.innerHTML = `
               <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Product</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Product Supplier</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Supplier</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Users</span>
                    </div>

                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Report</span>
                    </div>

                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="" alt="icon">
                        <span class="sidebar-purpose">Normalized</span>
                    </div>
            `
            break;
        case 2:
            break;
        case 3:
            break;
    }
}