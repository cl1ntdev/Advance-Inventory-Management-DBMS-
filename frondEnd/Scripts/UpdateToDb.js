
const updateProduct = async() =>{
    var prodID = parseInt(document.querySelector('.product-id-update').value)
    var prodName = document.querySelector('.product-name-update').value
    var prodCat = document.querySelector('.product-category-update').value
    var prodPrice = document.querySelector('.product-price-update').value
    console.log(prodID,prodName,prodCat,prodPrice)
    const updateDb = await fetch('http://127.0.0.1:8080/update-product',{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({prodID,prodName,prodCat,prodPrice})
    })
}


const updateSupplier = async() =>{
    var supplierID = parseInt(document.querySelector('.supplier-id-update').value)
    var supplierName = document.querySelector('.supplier-name-update').value
    var supplierContact = document.querySelector('.supplier-contact-update').value
    const updateDb = await fetch('http://127.0.0.1:8080/update-supplier',{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({supplierID,supplierName,supplierContact})
    })
}

