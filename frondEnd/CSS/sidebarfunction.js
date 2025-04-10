
const addDesignFuncSidebar = () => {
    var add = document.querySelector('.add-crud')
    var view = document.querySelector('.view-crud')
    var update = document.querySelector('.update-crud')
    var del = document.querySelector('.delete-crud')

    var sidebarsconts = document.querySelectorAll('.sidebar-cont')
    console.log(sidebarsconts)
    
    sidebarsconts.forEach(sidebar => {
      sidebar.addEventListener('click', () => {

    document.querySelectorAll('.crud-value').forEach(crud => {
            document.querySelectorAll('.crud-value').forEach(s => s.classList.remove('active'));
    });


        console.log('side')
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
}

const addAnimationCrud = () =>{
    document.querySelectorAll('.crud-value').forEach(crud => {
        crud.addEventListener('click', () => {
            document.querySelectorAll('.crud-value').forEach(s => s.classList.remove('active'));
            
            crud.classList.add('active');
            
            console.log('Active sidebar clicked');
        });
    });
}