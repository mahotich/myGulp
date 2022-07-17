const burger =document.querySelector('.burger')
const menuMobile=document.querySelector('.menu-mobile__block')
const bodyMenu=document.body;


burger.addEventListener('click', function(){
   burger.classList.toggle('burger-active')
   menuMobile.classList.toggle('menu-mobile__block__active')
   bodyMenu.classList.toggle('body-menu__active')
})


const catalogMenu = document.querySelector('.catalog__menu')
const catalogMenuCLick = document.querySelectorAll('.catalog__menu_click')

if (catalogMenu) {
   catalogMenu.addEventListener('click', change)

   function change(event) {
      if (event.target.classList.contains('catalog__menu_click')) {
         catalogMenuCLick.forEach((but) => but.classList.remove('active'))
         event.target.classList.add('active')
      }
   };

}