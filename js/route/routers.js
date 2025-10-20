import getCurrentPageName from '../utilits/getCurrentPageName.js'

const def_route = '/index/public';
const routers = {
    [`${def_route}/`]: () => import('../pages/main_page.js'),
    [`${def_route}/configurator`]: () => import('../pages/configurator.js'),
    [`${def_route}/upgrade`]: () => import('../pages/upgrade.js'),
    [`${def_route}/prebuild`]: () => import('../pages/prebuild.js'),


};
const styles = {
    '/':'../../assets/styles/index.css"',
    'configuration':'assets/styles/configuration.css"',
    'upgrade':'assets/styles/upgrade.css"',
    'prebuild':'assets/styles/prebuild.css"',
};

function returnStylesOfPage(){
    const pageIndex = getCurrentPageName();
    if(styles[pageIndex] == undefined)return styles["/"];
    return styles[pageIndex];
}

export  async function navigateTo(url){
    const currentPath = location.origin;
        console.log(currentPath)
    history.pushState(null, null, currentPath + def_route + url);
    await renderPage(url);
};

export  async function renderPage(url) {
    const path = location.pathname;
    const route = routers[path] || routers[def_route];
    console.log(history);
    const module = await route();
    const page = module.default();
    const styles = getCurrentPageName()
    document.querySelector('.main_page').innerHTML = '';
    document.querySelector('.main_page').appendChild(page);
   // document.querySelector('.styles').href = returnStylesOfPage();

};

window.addEventListener('popstate', renderPage);
