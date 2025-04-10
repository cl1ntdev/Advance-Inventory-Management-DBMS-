var sideBar = document.querySelector('.sidebar')
var crudOptionPane = document.querySelector('.crud-option')


const Initialize = (user) =>{
    const userRole = user.RoleID;
    userRolePanel.style.display = 'flex'
    console.log('user role',userRole)
    switch(userRole){
        case 1:
            sideBar.innerHTML = `
               <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/product.png" alt="icon">
                        <span class="sidebar-purpose">Product</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/productsupplier.png" alt="icon">
                        <span class="sidebar-purpose">Product Supplier</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/supplier.png" alt="icon">
                        <span class="sidebar-purpose">Supplier</span>
                    </div>
                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/users.png" alt="icon">
                        <span class="sidebar-purpose">Users</span>
                    </div>

                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/report.png" alt="icon">
                        <span class="sidebar-purpose">Report</span>
                    </div>

                    <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/n.png" alt="icon">
                        <span class="sidebar-purpose">Normalized</span>
                    </div>
                     <div class="sidebar-cont"  onclick="sideBarEvent(this)">
                        <img src="./Assets/SidebarIcons/normalized_process.png" alt="icon">
                        <span class="sidebar-purpose">Normalize Process</span>
                    </div>
            `
            crudOptionPane.innerHTML = `
                    <span class="crud-value add-crud" onclick="crud(this)">Add</span>
                    <span class="crud-value view-crud" onclick="crud(this)">View</span>
                    <span class="crud-value update-crud" onclick="crud(this)">Update</span>
                    <span class="crud-value delete-crud" onclick="crud(this)">Delete</span>
            `
            addDesignFuncSidebar() //desing css type shi
            addAnimationCrud()
            break;
        case 2:
            break;
        case 3:
            break;
    }
}