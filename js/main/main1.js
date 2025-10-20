import create_footer from '../pages/footer.js'
import create_header from '../pages/header.js'
import create_main from '../pages/main_page.js'
import create_configurator  from '../pages/configurator.js'
import create_upgrade  from '../pages/upgrade.js'
import create_prebuild  from '../pages/prebuild.js'
import change_pages from '../utilits/changepages.js'
import setLang from '../utilits/chooseLang.js'

document.querySelector("body").appendChild(create_header());
document.querySelector("body").appendChild(create_footer());


document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelector("header").after(create_main());
    
    
    change_pages(e);

    document.querySelectorAll('.lang button').forEach(btn =>{ 
        if(!btn.hasAttribute('data-lang')) btn.setAttribute("data-lang");
            btn.style.pointerEvents ="auto";
            btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
    setLang();
});



