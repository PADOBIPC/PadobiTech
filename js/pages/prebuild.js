export default function create_prebuild(){
    const prebuild = document.createElement('div');
    

    prebuild.innerHTML = `
<main>
    <div class="wrap">
      <div class="top-row">
        <div>
          <h1 id="pageTitle">Готовые сборки</h1>
          <div class="lead" id="pageLead">Подберите сборку по бюджету и задачам — всё протестировано и готово к использованию.</div>
        </div>

        <div class="controls">
          <div class="select">
            <select id="filterCategory" aria-label="Фильтр по категории">
              <option value="all">Все</option>
              <option value="office">Офис</option>
              <option value="gaming">Игровые</option>
              <option value="creator">Рабочие</option>
            </select>
          </div>

          <div class="select">
            <select id="sortBy" aria-label="Сортировка">
              <option value="recommended">Рекомендуемые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
            </select>
          </div>

          <div class="input">
            <input id="searchInput" placeholder="Поиск по названию..." aria-label="Поиск"/>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
        <section>
          <div class="grid" id="buildsGrid" aria-live="polite"></div>
        </section>

        <aside class="sidebar">
          <div class="panel" style="display:flex;align-items:center;justify-content:center;padding:18px;border-radius:12px">
            <button class="btn" onclick="location.href='configurator.html'">Открыть конфигуратор</button>
          </div>

          <div class="panel support">
            <h3>Поддержка</h3>
            <div class="muted">Нужна консультация по сборке? Поможем выбрать модель под задачу.</div>
            <div style="margin-top:8px;font-weight:900;color:var(--brand)">+38 (068) 000‑00‑00</div>
            <a href="mailto:info@padobipc.com" style="color:var(--brand);font-weight:700">info@padobipc.com</a>
          </div>

          <div class="panel">
            <h3>Избранное</h3>
            <div id="favoritesList" style="min-height:60px;color:var(--muted)">Пока пусто</div>
          </div>
        </aside>
      </div>
    </div>
  </main>
    `;

    return prebuild;
};