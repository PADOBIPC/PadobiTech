//header_of_page

export default function create_header(){
    const header = document.createElement("header");

    header.innerHTML = (`
    <div class="container nav" role="banner">
      <a class="brand" href="index.html" aria-label="PADOBI PC home">
        <span class="brand__logo" data-button="/"><img src="../../assets/images/logo.png" alt="Padobi Logo"></span>
        <span class="brand__text" data-i18n="site.brand">Padobi Tech</span>
      </a>

      <div class="actions" role="navigation" aria-label="Header actions">
        <div class="lang" aria-label="Language">
          <button type="button" data-lang="ru" class="neon-hover" aria-pressed="true">RU</button>
          <button type="button" data-lang="ua" class="neon-hover" aria-pressed="false">UA</button>
          <button type="button" data-lang="en" class="neon-hover" aria-pressed="false">EN</button>
        </div>

        <button id="headerProfileBtn" class="profile-btn" title="Профиль" aria-label="Профиль">
          <img id="smallAvatar" src="" alt="avatar" style="display:none" />
          <svg id="profileIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="7" r="4"/><path d="M6 21a6 6 0 0 1 12 0"/></svg>
        </button>

        <button class="icon-btn neon-hover" title="Корзина" onclick="window.location.href='cart.html'" aria-label="Корзина">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6l-2-3"/><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/></svg>
          <span class="badge" id="cartCount">0</span>
        </button>

        <div class="dropdown" id="menuDropdown">
          <button class="icon-btn neon-hover" id="menuBtn" aria-expanded="false" aria-controls="menu" title="Меню">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <div class="dropdown-menu" id="menu" role="menu" aria-hidden="true">
            <a href="profile.html" data-i18n="menu.profile">Профиль</a>
            <a href="cart.html" data-i18n="menu.cart">Корзина</a>
            <a href="#" data-i18n="menu.settings">Настройки</a>
            <a href="status.html" data-i18n="menu.status">Статус заказа</a>
          </div>
        </div>
      </div>
    </div>
        `);

        return header;
}