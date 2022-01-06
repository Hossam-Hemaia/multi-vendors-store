const DD_dashboard_btn = document.querySelector('.DD_toggle_menu');
const DD_sidebar_container = document.querySelector('.DD_options_container');

DD_dashboard_btn.addEventListener('click', ()=>{
    DD_sidebar_container.classList.toggle('DD_menu_active');
});