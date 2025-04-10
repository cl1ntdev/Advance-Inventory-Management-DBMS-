var add = document.querySelector('.add-crud')
var view = document.querySelector('.view-crud')
var update = document.querySelector('.update-crud')
var del = document.querySelector('.delete-crud')
document.querySelectorAll('.sidebar-cont').forEach(sidebar => {
    
    sidebar.addEventListener('click', () => {
        add.style.display = 'block';
        update.style.display = 'block';
        del.style.display = 'block';
        view.style.display = 'block'

        document.querySelectorAll('.sidebar-cont').forEach(s => s.classList.remove('active'));
        sidebar.classList.add('active');
        
        var purp = sidebar.querySelector('.sidebar-purpose').innerText.trim();
        switch(purp){
            case "Product Supplier":
                add.style.display = 'none';
                update.style.display = 'none';
                del.style.display = 'none';
                break;
            case "Normalized":
                add.style.display = 'none';
                update.style.display = 'none';
                del.style.display = 'none';
                break;
            case "Report":
                add.style.display = 'none';
                update.style.display = 'none';
                del.style.display = 'none';
                break;
            case "Normalize Process":
                add.style.display = 'none';
                update.style.display = 'none';
                del.style.display = 'none';
                break;
        }    });
});


document.querySelectorAll('.crud-value').forEach(crud => {
    crud.addEventListener('click', () => {
        document.querySelectorAll('.crud-value').forEach(s => s.classList.remove('active'));
        
        crud.classList.add('active');
        
        console.log('Active sidebar clicked');
    });
});
