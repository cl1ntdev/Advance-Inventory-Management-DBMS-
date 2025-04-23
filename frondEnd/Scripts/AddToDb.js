//todo 
// navbar for crud product
// content function


const addProduct = async () => {
    var userLogin = userContext.Username
    console.log(userLogin)

    const pName = document.querySelector('#product-name').value.trim();
    const pCat = document.querySelector('#product-category').value.trim();
    const pPrice = parseFloat(document.querySelector('#product-price').value);
    
    const supplierBlocks = document.querySelectorAll('.supplier-show');
    const suppliers = [];

    supplierBlocks.forEach(block => {
        const selectElem = block.querySelector('.select-input-supplier');
        const customNameInput = block.querySelector('.custom-supplier-name');
        const customContactInput = block.querySelector('.custom-supplier-name-contact');
        const stockCountInput = block.querySelector('.stock-count');
        
        const stockValue = stockCountInput?.value?.trim();

        // console.log(selectElem, selectElem.value, stockValue)
        // console.log(customNameInput, customNameInput.value)
        let supplierObj = null;

        if (selectElem && selectElem.value && stockValue) {
            supplierObj = {
                name: selectElem.value,
                stock: parseInt(stockValue)
            };
        } else if (customNameInput && customNameInput.value && stockValue) {
            supplierObj = {
                name: customNameInput.value.trim(),
                contactInfo: customContactInput?.value?.trim() || '',
                stock: parseInt(stockValue)
            };
        }

        if (supplierObj) {
            suppliers.push(supplierObj);
        }
    });

    console.log({
        name: pName,
        category: pCat,
        price: pPrice,
        suppliers: suppliers
    });

    
    const response = await fetch('http://127.0.0.1:8080/insert-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pName,
            pCat,
            pPrice,
            suppliers,
            userLogin
        })
    });

    // const result = await response.json();
    addRawDataToDb(pName,pCat,pPrice,suppliers)

    // console.log(result);
    
};

const addRawDataToDb = async(productname,productcategory,productprice,suppliers) =>{
    console.log(productname,productcategory,productprice)
    console.log(suppliers)
    
    try{
        await fetch('http://127.0.0.1:8080/add-raw-data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productname,productcategory,productprice,suppliers})
        })
    }catch(e){
        console.log(e)
    }
}


const addSupplierDb = async() => {
    const supplierBlocks = document.querySelectorAll('.supplier-show');
    const suppliers = [];

    supplierBlocks.forEach(block => {
        const selectElem = block.querySelector('.select-input-supplier');
        const customNameInput = block.querySelector('.custom-supplier-name');
        const customContactInput = block.querySelector('.custom-supplier-name-contact');

        let supplierObj = null;

        if (selectElem && selectElem.value) {
            supplierObj = {
                name: selectElem.value.trim()
            };
        } else if (customNameInput && customNameInput.value) {
            supplierObj = {
                name: customNameInput.value.trim(),
                contactInfo: customContactInput?.value?.trim() || ''
            };
        }

        if (supplierObj) {
            suppliers.push(supplierObj);
        }
    });

    console.log(suppliers);

    await fetch('http://127.0.0.1:8080/insert-supplier',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(suppliers)
    })
}



const addUserToDb = async() => {
    var Username = document.querySelector('#username').value.trim()
    var Password = document.querySelector('#password-get-user').value.trim()
    var _ConfirmPass = document.querySelector('#confirm-password').value.trim()
    var Role = document.querySelector('#user-role-input').value.trim()
    console.log(Password,_ConfirmPass)
    const existingUser = await getExistingUser(Username)
    if(existingUser.length>0){
        alert('on addtodb, ther is existing user')
        return 
    }else if(Password != _ConfirmPass){
        alert('on addtodb, password dont match')
        return
    }

    await fetch('http://127.0.0.1:8080/add-user',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({Username,Password,Role})
    })
}
