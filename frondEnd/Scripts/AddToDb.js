//todo 
// navbar for crud product
// content function


const addProduct = async () => {
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
            suppliers
        })
    });

    const result = await response.json();
    console.log(result);
    
};


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

