
const deleteProduct = async() =>{
    var id = document.querySelector('.product-id-delete').value
    const deleteProd = await fetch('http://127.0.0.1:8080/delete-product',{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({id:parseInt(id)})
    })
}

const deleteSupplier = async() =>{
    var id = document.querySelector('.supplier-id-delete').value
    const deleteProd = await fetch('http://127.0.0.1:8080/delete-supplier',{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({id:parseInt(id)})
    })
}


const deleteUser = async() =>{
    var id = document.querySelector('.user-id-delete').value
    const deleteProd = await fetch('http://127.0.0.1:8080/delete-user',{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({id:parseInt(id)})
    })
}