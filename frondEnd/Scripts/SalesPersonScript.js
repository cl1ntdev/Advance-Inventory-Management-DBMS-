//role_base_cont
// maniputale sales and stock


const showSales = async() =>{
    
    console.log('workign')
    const sales = await getSales();
    console.log(sales)
    role_base_cont.innerHTML = `
      <div class="table-array-cont">
        <h3>Sales</h3>
        <table>
          <thead>
            <tr><th>SaleID</th><th>ProductID</th><th>QuantitySold</th><th>SaleDate</th><th>TotalAmount</th></tr>
          </thead>
          <tbody>
            ${sales.map(s => `
              <tr>
                <td>${s.SaleID}</td>
                <td>${s.ProductID}</td>
                <td>${s.QuantitySold}</td>
                <td>${formatDate(s.SaleDate)}</td>
                <td>${s.TotalAmount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
} 

const showsSellPane = () => {
  role_base_cont.innerHTML = `
              <div class="item-form-to-sell">
                     
                      <div class="prod-show-inp">
                        <table>
                          <thead>
                            <tr>
                              <td>Name</td>
                              <td>Price</td>
                              <td>Amount</td>
                              <td>Total</td>
                              <td>Action</td>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- Data rows will be added here -->
                          </tbody>
                        </table>
                         <div class="over-all-total">
                            <h2 class="all-total-product-added-show">Total: </h2>
                          </div>
                      </div>

                        
                        <div class="product-preview">
                                <h7>Product Preview</h7>
                                <label for="prod-name-show">Product Name</label>
                                <p class="prod-name-show" name="prod-name-show">__</p>
                                <label for="prod-price-show">Price</label>
                                <p class="prod-price-show" name="prod-price-show">__</p>
                                <label for="prod-quantity-left-show">Quantity Left</label>
                                <p class="prod-quantity-left-show" name="prod-quantity-left-show">__</p>
                                <div class="total-show">
                                    <p>Total is:</p>
                                    <p class="total-value-single-prod">11</p>
                                </div>
                        </div>


                        <div class="more-options-salesperson">
                            <div class="add-products-pane">
                                <label for="prod-id-inp">Input Product ID</label>
                                <input type="text" name="product-id" class="product-id" oninput="previewProd(this)">
                                <label for="prod-amount">Enter Amount</label>
                                <input type="text" oninput="autoTotal(this)" name="product-amount" class="product-amount">
                            </div>
                            <p onclick="addPreview()">Add Preview</p>
                            <p onclick="sellItem()">Submit</p>
                        </div>
              </div>
  `
}


const addPreview = () => {
  const prodName = document.querySelector('.prod-name-show').innerText;
  const total = document.querySelector('.total-value-single-prod').innerText;
  const price = document.querySelector('.prod-price-show').innerText;
  const amount = document.querySelector('.product-amount').value; 

  if(prodName.length<=0 || total.length<=0
    || price.length<=0 || amount.length<=0
  ){
    return
  }

  const tbody = document.querySelector('.prod-show-inp table tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td class="recorded-prod-name">${prodName}</td>
    <td class="recorded-price">${price}</td>
    <td class="recorded-amount">${amount}</td>
    <td class="recorded-total">${total}</td>
    <td><button onclick="removeRow(this)">Remove</button></td>
  `;

  tbody.appendChild(row);
  solveOverAllTotal()

};

const removeRow = (btn) => {
  btn.closest('tr').remove();
  solveOverAllTotal()

};


const previewProd = async() =>{
  var prodPreviewPane = document.querySelector('.product-preview')
  var prodID = parseInt(document.querySelector('.product-id').value)
  var product = await productInfoToSell(prodID)
    console.log(product)
  prodPreviewPane.innerHTML = `
    <label for="prod-name-show">Product Name</label>
    <p class="prod-name-show" name="prod-name-show">${product.Name}</p>
    <label for="prod-price-show">Price</label>
    <p class="prod-price-show" name="prod-price-show">${product.Price}</p>
    <label for="prod-quantity-left-show">Quantity Left</label>
    <p class="prod-quantity-left-show" name="prod-quantity-left-show">${product.CurrentStock}</p>                            
    <div class="total-show">
                                    <p>Total is:</p>
                                    <p class="total-value-single-prod">0</p>
                                </div>
`
}

const autoTotal = () => {
  var priceText = document.querySelector('.prod-price-show').innerText;
  var price = parseFloat(priceText.replace(/[^\d.]/g, ''));
  var amount = parseInt(document.querySelector('.product-amount').value)
  var total = price * amount
  document.querySelector('.total-value-single-prod').innerHTML = total


  // solve for overall total
}

const solveOverAllTotal = () =>{
  var allTot = document.querySelectorAll('.recorded-total')
  console.log(allTot)
  var total = 0;
  for(var i = 0;i<allTot.length;i++){
    total+=parseInt(allTot[i].innerText)
  }
  var allTotalPane = document.querySelector('.all-total-product-added-show')
  allTotalPane.innerHTML = `Total: ${total}`
}


const addLabelToProd = async(obj) => {
  var prodID = parseInt(obj.parentElement.querySelector('.product-id').value)
  var product = await productInfoToSell(prodID)
 
  obj.parentElement.querySelector('.prod-name-show').innerText = product[0].Name
  obj.parentElement.querySelector('.prod-price-show').innerText = product[0].Price
}

const sellItem = async() => {
 var allProdName = document.querySelectorAll('.recorded-prod-name')
 var allPrice = document.querySelectorAll('.recorded-price')
 var allRecAmount = document.querySelectorAll('.recorded-amount')
 var allTotal = document.querySelectorAll('.recorded-total')
 const today = new Date();
 const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
 console.log(formattedDate); // e.g., "2025-04-01"
 
 var allProdSaleInfo = [];
 for(var i = 0;i<allProdName.length;i++){
  const sale = new SaleInfo(
    allProdName[i].innerText,
    parseInt(allPrice[i].innerText),
    parseInt(allRecAmount[i].innerText),
    parseInt(allTotal[i].innerText),
    formattedDate,
  )

  allProdSaleInfo.push(sale)
 }
 console.log(allProdSaleInfo)

const ress =  await fetch('http://127.0.0.1:8080/sell-product',{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
  },
  body: JSON.stringify({allProdSaleInfo})
 })

 const s = ress.json()
 console.log(s)
 




}