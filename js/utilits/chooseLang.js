// choose and change language
import setLangOfPage from './returnPageLang.js'


//right words by lang for all objects

//help func


function setText(el,text){
    if(!el)return;
    el.textContent = text;
};


//main func


export default function setLang(langCode){
    const translations = setLangOfPage();


    const available = Object.keys(translations);

//set lang by previous choose or default lang in browse
    let currentLang = localStorage.getItem("current_lang_padobi") || (available.includes((navigator.language || '').slice(0,2)) ? (navigator.language || '').slice(0,2) : "ua");


    if(!available.includes(langCode)) langCode = "ua";
    currentLang = langCode;
    localStorage.setItem("current_lang_padobi", langCode);
    


    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute("data-i18n");
        const content = translations[currentLang][key];
        if(key && content != undefined) setText(el,content);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const content = translations[currentLang][key];
        if(key && content != undefined) el.setAttribute("placeholder",content);
    });

    if(translations[langCode]['site.title']) document.title =translations[langCode]['site.title'];

    document.documentElement.setAttribute('language', langCode);
    document.querySelectorAll('.lang button').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        const active = lang == langCode;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const bot = document.querySelector('.chat-messages .msg.bot');
    if(bot) setText(bot, translations[langCode]['chat.greet']);
};
