
const sideBarEvent = (element) =>{
    var Event = element.querySelector('.sidebar-purpose').innerHTML.trim();
    currentSideBar = Event;
    document.querySelector('.role-base-content').innerHTML = Event
    
}

