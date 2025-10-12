// маїн файл тут буде просто відправка на хтмл увесь запит хтмл із беку
export default function create_main_page(){
   const main = document.createElement('div');
   main.className = ("main_page");

   main.innerHTML = (`
    <!-- Promotion -->
    <section class="section container hero" aria-labelledby="heroTitle">
      <div class="inner">
        <h1 id="heroTitle" data-i18n="hero.title">Сервис будущего в Киеве</h1>
        <p class="sub lead" data-i18n="hero.tag">Твой ПК в надёжных руках — курьер, мастер на дом, гейм-зона и фирменный стиль.</p>
      </div>
    </section>

    <!-- Options -->
    <section class="section container">
      <div class="grid">
        <div class="card neon-hover" style="background-image:url('../../assets/images/pc1.png')">
          <h3 data-i18n="cards.configurator" >Конфигуратор</h3>
          <button class="btn"  data-button='/configurator'>Собрать</button>
        </div>
        <div class="card neon-hover" style="background-image:url('../../assets/images/pc2.png')">
          <h3 data-i18n="cards.ready">Готовые сборки</h3>
          <button class="btn" data-i18n="cta.view" data-button="/prebuild">Смотреть</button>
        </div>
        <div class="card neon-hover" style="background-image:url('../../assets/images/pc3.png')">
          <h3 data-i18n="cards.upgrade">Апгрейд</h3>
          <button class="btn" data-i18n="cta.start" data-button='/upgrade'>Начать</button>
        </div>
      </div>
    </section>

    <!-- Why us (restored original) -->
    <section class="section features container" aria-labelledby="whyTitle">
      <div class="inner">
        <h2 id="whyTitle" data-i18n="why.title">Почему выбирают нас</h2>
        <p class="lead" data-i18n="why.lead">Бесплатный курьер по Киеву, мастер на дом и гейм‑зона для клиентов. Минимализм, честность и киберпанк‑атмосфера.</p>

        <div class="features-grid" style="margin-top:24px">
          <div class="feature">
            <h3 data-i18n="why.courier.title">Бесплатный курьер</h3>
            <p data-i18n="why.courier.text">Заберём ваш ПК, привезём обратно. Удобно и безопасно.</p>
          </div>
          <div class="feature">
            <h3 data-i18n="why.game.title">Гейм‑зона</h3>
            <p data-i18n="why.game.text">Пока идёт ремонт — сыграйте на консолях и топовых ПК.</p>
          </div>
          <div class="feature">
            <h3 data-i18n="why.honest.title">Честный сервис</h3>
            <p data-i18n="why.honest.text">Прозрачные цены, диагностика и гарантия на все работы 6 месяцев.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services (restored original) -->
    <section class="section container services" aria-labelledby="servicesTitle">
      <h2 id="servicesTitle" data-i18n="services.title">Наши услуги</h2>
      <div class="services-grid" aria-label="Список услуг" style="margin-top:18px">
        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18"/><path d="M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><path d="M10 11h4"/></svg>
          <div>
            <div data-i18n="srv.clean">Чистка</div>
            <small class="muted" data-i18n="srv.clean.desc">Пыль, профилактика, акустика</small>
          </div>
          <div class="price">500 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M5 7h14"/><path d="M5 17h14"/></svg>
          <div>
            <div data-i18n="srv.paste">Замена термопасты</div>
            <small class="muted" data-i18n="srv.paste.desc">CPU / GPU, правильная посадка</small>
          </div>
          <div class="price">от 200 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v7H6z"/><path d="M6 14h12v7H6z"/></svg>
          <div>
            <div data-i18n="srv.parts">Замена железа</div>
            <small class="muted" data-i18n="srv.parts.desc">RAM / SSD / GPU / PSU</small>
          </div>
          <div class="price">от 500 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
          <div>
            <div data-i18n="srv.diag">Диагностика</div>
            <small class="muted" data-i18n="srv.diag.desc">Тесты, отчёт, рекомендации</small>
          </div>
          <div class="price">от 200 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7l-4 4 4 4"/><path d="M15 7l4 4-4 4"/></svg>
          <div>
            <div data-i18n="srv.bios">Прошивка BIOS</div>
            <small class="muted" data-i18n="srv.bios.desc">Обновление, восстановление</small>
          </div>
          <div class="price">от 400 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
          <div>
            <div data-i18n="srv.winpack">Windows + драйвера + софт</div>
            <small class="muted" data-i18n="srv.winpack.desc">Оптимизация, готов к работе</small>
          </div>
          <div class="price">500 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10"/></svg>
          <div>
            <div data-i18n="srv.win">Windows</div>
            <small class="muted" data-i18n="srv.win.desc">Установка и настройка</small>
          </div>
          <div class="price">500 ₴</div>
        </div>

        <div class="service">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v4"/><path d="M12 19v4"/><path d="M4.22 4.22l2.83 2.83"/><path d="M16.95 16.95l2.83 2.83"/><path d="M1 12h4"/><path d="M19 12h4"/><path d="M4.22 19.78l2.83-2.83"/><path d="M16.95 7.05l2.83-2.83"/></svg>
          <div>
            <div data-i18n="srv.virus">Чистка вирусов</div>
            <small class="muted" data-i18n="srv.virus.desc">Удаление, защита, контроль</small>
          </div>
          <div class="price">от 200 ₴</div>
        </div>
      </div>

      <div class="services-note" data-i18n="services.note"> 
        Цены указаны за работу. Запчасти по согласованию.
      </div>
    </section>

    <!-- About -->
    <section class="section container about" aria-labelledby="aboutTitle">
      <div class="inner">
        <h2 id="aboutTitle" data-i18n="about.title">О нас</h2>
        <p class="lead" data-i18n="about.text">PADOBI PC — сервисный центр с характером: уважение к времени клиента. Мы собираем ПК под задачи, апгрейдим по Trade‑In, настраиваем софт и берём ответственность за результат.</p>
      </div>
    </section>

    <!-- Reviews -->
    <section class="section container" aria-labelledby="reviewsTitle">
      <div class="inner">
        <h2 data-i18n="reviews.title">Отзывы клиентов</h2>
        <div class="reviews-grid" style="margin-top:18px">
          <div class="review"><div class="stars">★★★★★</div><p data-i18n="reviews.r1">«Забрали ПК курьером, через день вернули тихим и быстрым. В гейм‑зоне время пролетело незаметно.»</p></div>
          <div class="review"><div class="stars">★★★★★</div><p data-i18n="reviews.r2">«Прозрачные цены и нормальный диалог. Апгрейд и винда — без воды и лишних наворотов.»</p></div>
          <div class="review"><div class="stars">★★★★★</div><p data-i18n="reviews.r3">«Сервис как в будущем: стиль, порядок и уважение к клиенту. Рекомендую.»</p></div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section container" aria-labelledby="faqTitle">
      <div class="inner">
        <h2 data-i18n="faq.title">FAQ</h2>
        <div class="faq-grid" style="margin-top:18px">
          <details class="faq-item"><summary data-i18n="faq.q1">Сколько занимает ремонт?</summary><p data-i18n="faq.a1">В среднем 1–2 дня. Точные сроки зависят от задачи и наличия деталей.</p></details>
          <details class="faq-item"><summary data-i18n="faq.q2">Есть ли гарантия?</summary><p data-i18n="faq.a2">Да. На все работы — 6 месяцев. Условия фиксируем в заказ‑наряде.</p></details>
          <details class="faq-item"><summary data-i18n="faq.q3">Можно ли вызвать мастера домой?</summary><p data-i18n="faq.a3">Да. Приедет мастер или курьер — как удобнее. По Киеву — бесплатно.</p></details>
        </div>
      </div>
    </section>



  
    `);
    return main;
};
