const routers = {
    '/': () => import('../pages/main_page.js'),
    '/configurator': () => import('../pages/configurator.js'),
    '/upgrade': () => import('../pages/upgrade.js'),
    '/prebuild': () => import('../pages/prebuild.js'),


};

export  async function navigateTo(url){
    const currentPath = location.origin;
        console.log(url)
    history.pushState(null, null, currentPath + url);
    await renderPage(url);
};

export  async function renderPage(url) {
    console.log(location);

    
    const path = location.pathname;
    const route = routers[path] || routers['/'];
    const module = await route();
    const page = module.default();
    
    document.querySelector('.main_page').innerHTML = '';
    document.querySelector('.main_page').appendChild(page);

};

window.addEventListener('popstate', renderPage);
