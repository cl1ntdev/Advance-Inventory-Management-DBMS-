
// Add, View, Update, Delete

const fillPaneUser = async() =>{

    try{
        var currentSuppliers = await getSuppliers(); 
        _global_current_suppliers = currentSuppliers
        console.log(currentSuppliers)
        console.log(currentCrud)
        console.log(currentSideBar)
        
        if(currentCrud == "Add" && currentSideBar == "Users"){
            role_base_cont.innerHTML = `
            <h1>Add User</h1>
                    <div class="user-add-details-suppliers">
                        <h3>Suppliers</h3>
                         <div class="user-show-pane">
                           <label for="user">Enter Username</label>
                           <input type="text" id="username">
                           <label for="user">Enter Password</label>
                           <input type="password" id="password-get-user">
                           <label for="user">Confirm Password</label>
                           <input type="password" id="confirm-password">
                           <select name="" id="user-role-input">
                                <option value="Admin">Admin</option>
                                <option value="Salesperson">Salesperson</option>
                                <option value="Inventory Clerk">Inventory Clerk</option>
                           </select>
                         </div>
                       <button onclick="addUserToDb()">Add</button>

                    </div>`
                
        }else if( currentCrud == "View" && currentSideBar == "Users"){
            var users = await getUsers();
            role_base_cont.innerHTML = `
                <table class="user-show-table">
                        <th>
                            <tr>
                                <td>User ID</td>
                                <td>Username</td>
                                <td>Role ID</td>
                            </tr>
                        </th>
                        <tbody class="user-table-body">
                           
                        </tbody>
                    </table>
            `
            var tableBody = document.querySelector('.user-table-body')
            users.forEach(user=>{
                var content = `
                            <tr>
                                <td>${user.UserID}</td>
                                <td>${user.Username}</td>
                                <td>${user.RoleID}</td>
                            </tr>
                `
                tableBody.insertAdjacentHTML('beforeend',content)
            })
        }else if (currentCrud == "Update" && currentSideBar == "Users"){
            var users = await getUsers();
            var roles = await getRoles();
            console.log(roles)
            role_base_cont.innerHTML = `
                <h3>Update Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Role ID</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${users.map(user => (
                                `  <tr>
                                <td>${user.UserID}</td>
                                <td>${user.Username}</td>
                                <td>${user.RoleID}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="update-inputs">
                    <label for="prodname">Enter User ID</label>
                    <input type="text" name="prodname" class="user-id-update" required>
                    <label for="prodname">Edit Username</label>
                    <input type="text" name="prodname" class="user-name-update" required>
                    <select class="user-role-update">
                      ${roles.map(role=>(
                        `<option value="${role.RoleName}">${role.RoleName}</option>`
                      )).join('')}
                    </select>
                    
                    
                    <button onclick="updateUser()">Update</button>
                </div>
            `;

        }else if (currentCrud == "Delete" && currentSideBar == "Users"){
            var users = await getUsers();
            role_base_cont.innerHTML = `
                <h3>Delete Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Role ID</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${users.map(user => (
                                `  <tr>
                                <td>${user.UserID}</td>
                                <td>${user.Username}</td>
                                <td>${user.RoleID}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="update-inputs">
                     <div class="update-inputs">
                    <label for="prodname">Enter User ID</label>
                    <input type="text" name="prodname" class="user-id-delete" required>
                    <button onclick="deleteUser()">Delete</button>
                </div>
                </div>
            `;
    }
    }catch(e){
        console.log(e)
    }
    
}












