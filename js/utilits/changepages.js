import {navigateTo, renderPage} from '../route/routers.js';

export default function change_pages(){
            document.addEventListener("click", (e) => {
            
            
            let target = e.target.closest('[data-button]')
            if (target == null)return;

            e.preventDefault();

            let url = target.getAttribute('data-button');
            if(url) navigateTo(e.target.getAttribute('data-button'));  
        });
        renderPage();

};
