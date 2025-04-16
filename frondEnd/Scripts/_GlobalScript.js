
const getSuppliers = async() =>{
    var result = await fetch('http://127.0.0.1:8080/suppliers')
    var suppliers = await result.json();
    return suppliers
}

const getProducts = async() =>{
    var result = await fetch('http://127.0.0.1:8080/products')
    var products = await result.json();
    return products
}

const getExistingUser = async(Username) =>{
    var result = await fetch('http://127.0.0.1:8080/existing-user',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({Username})
    })
    var existinguser = await result.json();
    return existinguser
}


const getUsers = async() =>{
    var result = await fetch('http://127.0.0.1:8080/users')
    var products = await result.json();
    return products
}


const getRoles = async() =>{
    var result = await fetch('http://127.0.0.1:8080/roles')
    var products = await result.json();
    return products
}

//modified
const getSupplierProducts = async() =>{
    var result = await fetch('http://127.0.0.1:8080/supplier-product')
    var products = await result.json();
    return products
}

const getAllSupplierProducts = async() =>{
    var result = await fetch('http://127.0.0.1:8080/all-supplierproducts')
    var products = await result.json();
    return products
}

const getSalesReport = async() =>{
    var result = await fetch('http://127.0.0.1:8080/sales')
    var products = await result.json();
    return products
}
const getSales = async() =>{
    var result = await fetch('http://127.0.0.1:8080/all-sales')
    var products = await result.json();
    return products
}

const getStocks = async() =>{
    var result = await fetch('http://127.0.0.1:8080/all-stocks')
    var products = await result.json();
    return products
}

const getRawData = async() =>{
    var result = await fetch('http://127.0.0.1:8080/rawdata')
    var products = await result.json();
    return products
}

const productInfoToSell = async(prodID) =>{
    console.log(prodID)
    var productInfo = await fetch('http://127.0.0.1:8080/product-info-to-sell',{
     method: "POST",
     headers:{
       "Content-Type":"application/json",
     },
     body: JSON.stringify({prodID})
    })
    var productInfoReturn = await productInfo.json()
    return productInfoReturn
 }

 
var role_base_cont = document.querySelector('.role-base-content')
var _global_current_suppliers;
const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];



//  SCIRTPS

const logoutAccount = () =>{
    console.log('logout')
    // loginContainer.style.display = 'block';
    // userRolePanel.style.display = 'none'
    window.location.reload()
}

const removeElement = (element) => {
    element.parentElement.remove();
}

const removeElementForProdInp = (element) => {
    element.parentElement.parentElement.remove();
}



