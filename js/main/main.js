document.getElementById('year').textContent = new Date().getFullYear();

    // Full translations (kept same as earlier)
    const translations = {
      ru: {
        'site.title':'PADOBI PC — сервис будущего','site.brand':'PADOBI PC','site.tag':'сервис будущего',
        'menu.profile':'Профиль','menu.cart':'Корзина','menu.settings':'Настройки','menu.status':'Статус заказа',
        'hero.title':'Сервис будущего в Киеве','hero.tag':'Твой ПК в надёжных руках — курьер, мастер на дом, гейм-зона и фирменный стиль.',
        'cards.configurator':'Конфигуратор','cards.ready':'Готовые сборки','cards.upgrade':'Апгрейд','cta.build':'Собрать','cta.view':'Смотреть','cta.start':'Начать',
        'why.title':'Почему выбирают нас','why.lead':'Бесплатный курьер по Киеву, мастер на дом и гейм‑зона для клиентов. Минимализм, честность и киберпанк‑атмосфера.',
        'why.courier.title':'Бесплатный курьер','why.courier.text':'Заберём ваш ПК, привезём обратно. Удобно и безопасно.',
        'why.game.title':'Гейм‑зона','why.game.text':'Пока идёт ремонт — сыграйте на консолях и топовых ПК.',
        'why.honest.title':'Честный сервис','why.honest.text':'Прозрачные цены, диагностика и гарантия на все работы 6 месяцев.',
        'services.title':'Наши услуги','services.note':'Цены указаны за работу. Запчасти по согласованию.',
        'srv.clean':'Чистка','srv.clean.desc':'Пыль, профилактика, акустика','srv.paste':'Замена термопасты','srv.paste.desc':'CPU / GPU, правильная посадка',
        'srv.parts':'Замена железа','srv.parts.desc':'RAM / SSD / GPU / PSU','srv.diag':'Диагностика','srv.diag.desc':'Тесты, отчёт, рекомендации','srv.bios':'Прошивка BIOS','srv.bios.desc':'Обновление, восстановление',
        'srv.winpack':'Windows + драйвера + софт','srv.winpack.desc':'Оптимизация, готов к работе','srv.win':'Windows','srv.win.desc':'Установка и настройка','srv.virus':'Чистка вирусов','srv.virus.desc':'Удаление, защита, контроль',
        'about.title':'О нас','about.text':'PADOBI PC — сервисный центр с характером: Мы собираем ПК под задачи, апгрейдим по Trade‑In, настраиваем софт и берём ответственность за результат.',
        'reviews.title':'Отзывы клиентов','reviews.r1':'«Забрали ПК курьером, через день вернули тихим и быстрым. В гейм‑зоне время пролетело незаметно.»','reviews.r2':'«Прозрачные цены и нормальный диалог. Апгрейд и винда — без воды и лишних наворотов.»','reviews.r3':'«Сервис как в будущем: стиль, порядок и уважение к клиенту. Рекомендую.»',
        'faq.title':'FAQ','faq.q1':'Сколько занимает ремонт?','faq.a1':'В среднем 1–2 дня. Точные сроки зависят от задачи и наличия деталей.','faq.q2':'Есть ли гарантия?','faq.a2':'Да. На все работы — 6 месяцев. Условия фиксируем в заказ‑наряде.','faq.q3':'Можно ли вызвать мастера домой?','faq.a3':'Да. Приедет мастер или курьер — как удобнее. По Киеву — бесплатно.',
        'chat.support':'Поддержка','chat.greet':'Здравствуйте! Чем можем помочь?','chat.input':'Введите сообщение...','chat.thanks':'Спасибо за сообщение! Мы скоро ответим.',
        'auth.fill_all':'Заполните все поля','auth.email_invalid':'Введите корректный email','auth.phone_invalid':'Некорректный телефон','auth.pass_short':'Минимум 6 символов','auth.reg_ok':'Регистрация успешна! Подтвердите email.','auth.reg_error':'Ошибка регистрации','auth.login_error':'Ошибка входа'
      },
      ua: {
        'site.title':'PADOBI PC — сервіс майбутнього','site.brand':'PADOBI PC','site.tag':'сервіс майбутнього',
        'menu.profile':'Профіль','menu.cart':'Кошик','menu.settings':'Налаштування','menu.status':'Статус замовлення',
        'hero.title':'Сервіс майбутнього в Києві','hero.tag':'Твій ПК у надійних руках — кур’єр, майстер додому, гейм-зона та фірмовий стиль.',
        'cards.configurator':'Конфігуратор','cards.ready':'Готові збірки','cards.upgrade':'Апгрейд','cta.build':'Зібрати','cta.view':'Дивитись','cta.start':'Почати',
        'why.title':'Чому обирають нас','why.lead':'Безкоштовний кур’єр по Києву, майстер додому та гейм-зона для клієнтів. Мінімалізм, чесність і кіберпанк-атмосфера.',
        'why.courier.title':'Безкоштовний кур’єр','why.courier.text':'Заберемо ваш ПК і повернемо назад. Зручно та безпечно.',
        'why.game.title':'Гейм-зона','why.game.text':'Поки триває ремонт — зіграйте на консолях і топових ПК.',
        'why.honest.title':'Чесний сервіс','why.honest.text':'Прозорі ціни, діагностика і гарантія 6 місяців.',
        'services.title':'Наші послуги','services.note':'Ціни вказані за роботу. Запчастини за погодженням.',
        'srv.clean':'Чистка','srv.clean.desc':'Пил, профілактика, акустика','srv.paste':'Заміна термопасти','srv.paste.desc':'CPU / GPU, правильна посадка',
        'srv.parts':'Заміна заліза','srv.parts.desc':'RAM / SSD / GPU / PSU','srv.diag':'Діагностика','srv.diag.desc':'Тести, звіт, рекомендації','srv.bios':'Прошивка BIOS','srv.bios.desc':'Оновлення, відновлення',
        'srv.winpack':'Windows + драйвери + софт','srv.winpack.desc':'Оптимізація, готовий до роботи','srv.win':'Windows','srv.win.desc':'Встановлення і налаштування','srv.virus':'Чистка вірусів','srv.virus.desc':'Видалення, захист, контроль',
        'about.title':'Про нас','about.text':'PADOBI PC — сервісний центр з характером: Збираємо ПК під задачі, апгрейд по Trade-In, налаштовуємо софт і відповідаємо за результат.',
        'reviews.title':'Відгуки клієнтів','reviews.r1':'«Забрали ПК кур’єром, за день повернули тихим і швидким. У гейм-зоні час пролетів непомітно.»','reviews.r2':'«Прозорі ціни і нормальний діалог. Апгрейд і вінда — без води.»','reviews.r3':'«Сервіс як у майбутньому: стиль і повага до клієнта. Рекомендую.»',
        'faq.title':'FAQ','faq.q1':'Скільки триває ремонт?','faq.a1':'В середньому 1–2 дні. Залежить від задачі та наявності деталей.','faq.q2':'Чи є гарантія?','faq.a2':'Так. На всі роботи — 6 місяців. Умови фіксуємо в замовленні.','faq.q3':'Чи можна викликати майстра додому?','faq.a3':'Так. Приїде майстер або кур’єр — як зручніше. По Києву — безкоштовно.',
        'chat.support':'Підтримка','chat.greet':'Вітаємо! Як можемо допомогти?','chat.input':'Введіть повідомлення...','chat.thanks':'Дякуємо за повідомлення! Ми скоро відповімо.',
        'auth.login':'Вхід','auth.register':'Реєстрація','auth.email':'Email','auth.password':'Пароль','auth.username':'Ім’я користувача','auth.phone':'Номер телефону',
        'auth.fill_all':'Заповніть всі поля','auth.email_invalid':'Введіть коректний email','auth.phone_invalid':'Некоректний телефон','auth.pass_short':'Мінімум 6 символів у паролі','auth.reg_ok':'Реєстрація успішна! Підтвердьте email.','auth.reg_error':'Помилка реєстрації','auth.login_error':'Помилка входу'
      },
      en: {
        'site.title':'PADOBI PC — Future Service','site.brand':'PADOBI PC','site.tag':'future service',
        'menu.profile':'Profile','menu.cart':'Cart','menu.settings':'Settings','menu.status':'Order Status',
        'hero.title':'Future‑proof PC Service in Kyiv','hero.tag':'Your PC in safe hands — courier, home service, game zone and signature style.',
        'cards.configurator':'Configurator','cards.ready':'Prebuilt PCs','cards.upgrade':'Upgrade','cta.build':'Build','cta.view':'Browse','cta.start':'Start',
        'why.title':'Why choose us','why.lead':'Free courier in Kyiv, on‑site technician and a client‑only game zone. Minimalism, honesty and cyberpunk vibes.',
        'why.courier.title':'Free courier','why.courier.text':'We pick up and return your PC. Convenient and safe.',
        'why.game.title':'Game zone','why.game.text':'While we do quick fixes — enjoy consoles or high‑end PCs.',
        'why.honest.title':'Honest service','why.honest.text':'Transparent pricing, diagnostics and up 6 warranty.',
        'services.title':'Our services','services.note':'Labour only. Parts by agreement.',
        'srv.clean':'Cleaning','srv.clean.desc':'Dust, prevention, acoustics','srv.paste':'Thermal paste','srv.paste.desc':'CPU / GPU, proper mount',
        'srv.parts':'Hardware replacement','srv.parts.desc':'RAM / SSD / GPU / PSU','srv.diag':'Diagnostics','srv.diag.desc':'Stress tests, report, advice','srv.bios':'BIOS flashing','srv.bios.desc':'Update, recovery',
        'srv.winpack':'Windows + drivers + apps','srv.winpack.desc':'Optimized, ready to work','srv.win':'Windows','srv.win.desc':'Install & setup','srv.virus':'Virus cleanup','srv.virus.desc':'Removal, protection, control',
        'about.title':'About us','about.text':'PADOBI PC — a service center with attitude: respect for client time. We build PCs for tasks, upgrade via Trade‑In, configure software and own the result.',
        'reviews.title':'Reviews','reviews.r1':'“Courier pickup, next‑day return — quiet and fast. Game zone made the wait fly.”','reviews.r2':'“Transparent pricing and straight talk. Upgrade + Windows done right.”','reviews.r3':'“Feels like the future: style, order and respect. Recommend.”',
        'faq.title':'FAQ','faq.q1':'How long does repair take?','faq.a1':'Usually 1–2 days depending on task and parts availability.','faq.q2':'Is there a warranty?','faq.a2':'Yes, up 6 on labour. Details in the work order.','faq.q3':'Can a tech come to my place?','faq.a3':'Yes. Technician or courier — your choice. Free in Kyiv.',
        'chat.support':'Support','chat.greet':'Hello! How can we help you?','chat.input':'Type a message...','chat.thanks':'Thank you! We will reply soon.',
        'auth.login':'Login','auth.register':'Register','auth.email':'Email','auth.password':'Password','auth.username':'Username','auth.phone':'Phone',
        'auth.fill_all':'Fill all fields','auth.email_invalid':'Enter valid email','auth.phone_invalid':'Invalid phone','auth.pass_short':'Minimum 6 characters','auth.reg_ok':'Registration success! Confirm your email.','auth.reg_error':'Registration error','auth.login_error':'Login error'
      }
    };

    // i18n runtime
    const available = Object.keys(translations);
  
    // Supabase client not need

    const supabaseUrl = "https://rjqeqffegmejiyakhxza.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcWVxZmZlZ21laml5YWtoeHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTA2MzcsImV4cCI6MjA3MjM4NjYzN30.KuXUp9tCXmnlCMv3go89E8O_oHOvurErUkcst8UUEGc";
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    let currentLang = localStorage.getItem('padobi_lang') || (available.includes((navigator.language||'').slice(0,2)) ? (navigator.language||'').slice(0,2) : 'ru');
  
    if(!available.includes(currentLang)) currentLang = 'ru';

    function setText(el, txt){ 
      if(!el) return;
      el.textContent = txt;
    }

    //util
    function setLang(code){

      // is the lang
      if(!translations[code]) return;
      currentLang = code;
      localStorage.setItem('padobi_lang', code);

      // set lang to all data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        if(key && translations[code][key] !== undefined) setText(el, translations[code][key]);
      });
      
      //set lan to all i18n obj with place for text
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const key = el.getAttribute('data-i18n-placeholder');
        if(key && translations[code][key] !== undefined) el.setAttribute('placeholder', translations[code][key]);
      });

      //set title of page
      if(translations[code]['site.title']) document.title = translations[code]['site.title'];

      //set lang on buttons and set the previous state of the buttons
      document.documentElement.setAttribute('lang', code);
      document.querySelectorAll('.lang button').forEach(btn=>{
        const b = btn.getAttribute('data-lang');
        const active = b === code;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      // set lang to bot
      const firstBot = document.querySelector('.chat-messages .msg.bot');
      if(firstBot) firstBot.textContent = translations[code]['chat.greet'] || firstBot.textContent;
    }



  //return the translated mean of a part the text
    function i18n(key){ 
      return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
    }


    

    // helper: toast
    function showToast(text, ms = 1800){
      const t = document.getElementById('toast');
      t.textContent = text;
      t.style.display = 'block';
      clearTimeout(t._hide);
      t._hide = setTimeout(()=> t.style.display = 'none', ms);
    }

    // header avatar update
    //set photo of avatar
    async function updateHeaderAvatarFromUser(user){
      const img = document.getElementById('smallAvatar');
      const icon = document.getElementById('profileIcon');
      
      if(!user){
        img.style.display='none';
        icon.style.display='block';
        return; 
      }
      
      const avatarUrl = user.user_metadata?.avatar_url;
      
      if(avatarUrl){
        img.src = avatarUrl;
        img.style.display = 'block';
        icon.style.display = 'none';
      } else {
        img.style.display='none'; 
        icon.style.display='block';
      }
    }

    async function initHeaderAvatar(){
      if(!supabase) return;
      try{
        const { data: { user } } = await supabase.auth.getUser();
        await updateHeaderAvatarFromUser(user);
        if(supabase.auth.onAuthStateChange){
          supabase.auth.onAuthStateChange(async (event, session) => {
            const u = session?.user || null;
            await updateHeaderAvatarFromUser(u);
          });
        }
      }catch(e){ console.warn('initHeaderAvatar', e); }
    }

    // DOM ready wiring
    window.addEventListener('DOMContentLoaded', ()=> {
      // bind lang buttons
      document.querySelectorAll('.lang button').forEach(btn=>{
        if(!btn.hasAttribute('data-lang')) btn.setAttribute('data-lang', btn.textContent.toLowerCase());
        btn.style.pointerEvents = 'auto';
        btn.addEventListener('click', ()=> setLang(btn.getAttribute('data-lang')));
      });
      setLang(currentLang);

      // init header avatar
      initHeaderAvatar().catch(console.error);

      // profile button logic
      document.getElementById('headerProfileBtn').addEventListener('click', async ()=>{
        if(!supabase){ openAuthModal('login'); return; }
        try{
          const { data: { session } } = await supabase.auth.getSession();
          if(session && session.user) window.location.href = 'profile.html';
          else openAuthModal('login');
        }catch(e){ console.warn(e); openAuthModal('login'); }
      });

      // menu toggle & outside click
      (function(){
        const menuBtn = document.getElementById('menuBtn');
        const menuDropdown = document.getElementById('menuDropdown');
        const menu = document.getElementById('menu');
        if(menuBtn){
          menuBtn.addEventListener('click', ()=>{
            const open = menuDropdown.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
            if(menu) menu.setAttribute('aria-hidden', String(!open));
          });
          document.addEventListener('click', (e)=>{
            if(!menuDropdown.contains(e.target) && menuDropdown.classList.contains('open')){
              menuDropdown.classList.remove('open');
              menuBtn.setAttribute('aria-expanded','false');
              if(menu) menu.setAttribute('aria-hidden','true');
            }
          });
        }
      })();

      // auth modal wiring
      document.getElementById('authClose').addEventListener('click', closeAuthModal);
      document.getElementById('tabLogin').addEventListener('click', ()=> switchAuthTab('login'));
      document.getElementById('tabRegister').addEventListener('click', ()=> switchAuthTab('register'));
      document.getElementById('toRegisterFromLogin').addEventListener('click', ()=> switchAuthTab('register'));
      document.getElementById('toLoginFromRegister').addEventListener('click', ()=> switchAuthTab('login'));
      document.getElementById('quickProfileBtn').addEventListener('click', async ()=>{
        if(!supabase){ openAuthModal('login'); return; }
        const { data: { session } } = await supabase.auth.getSession();
        if(session && session.user) window.location.href = 'profile.html';
        else openAuthModal('login');
      });
      document.getElementById('modalLoginBtn').addEventListener('click', modalLogin);
      document.getElementById('modalGoogleBtn').addEventListener('click', ()=> loginWithOAuth('google'));
      document.getElementById('modalRegisterBtn').addEventListener('click', modalRegister);
      document.getElementById('authModal').addEventListener('click', (e)=> { if(e.target === document.getElementById('authModal')) closeAuthModal(); });
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeAuthModal(); });

      // chat wiring
      const chatToggle = document.getElementById('chatToggle');
      const chatWindow = document.getElementById('chatWindow');
      const chatClose = document.getElementById('chatClose');
      const chatSend = document.getElementById('chatSend');
      const chatInput = document.getElementById('chatInput');
      const chatMessages = document.getElementById('chatMessages');

      function appendUserMessage(text){
        const userMsg = document.createElement('div');
        userMsg.className = 'msg user';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      function appendBotMessage(text){
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot';
        botMsg.textContent = text;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      chatToggle && chatToggle.addEventListener('click', ()=>{
        const isOpen = chatWindow.style.display === 'flex';
        if(isOpen){ chatWindow.style.display = 'none'; chatWindow.setAttribute('aria-hidden','true'); }
        else { chatWindow.style.display = 'flex'; chatWindow.setAttribute('aria-hidden','false'); chatInput && chatInput.focus(); }
      });
      chatClose && chatClose.addEventListener('click', ()=> { chatWindow.style.display = 'none'; chatWindow.setAttribute('aria-hidden','true'); });
      if(chatSend){
        chatSend.addEventListener('click', ()=>{
          const text = (chatInput.value || '').trim();
          if(!text) return;
          appendUserMessage(text);
          chatInput.value = '';
          setTimeout(()=> appendBotMessage(i18n('chat.thanks')), 600);
        });
      }
      chatInput && chatInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); chatSend && chatSend.click(); } });

      // safeguard for card images
      document.querySelectorAll('.card').forEach(card=>{
        const bg = card.style.backgroundImage;
        if(!bg || bg === 'none') card.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
      });
    });

    // Auth modal helpers
    function openAuthModal(tab='login'){ const modal=document.getElementById('authModal'); modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); switchAuthTab(tab); }
    function closeAuthModal(){ const modal=document.getElementById('authModal'); modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); }
    function switchAuthTab(tab){
      const loginPane = document.getElementById('loginPane'), registerPane = document.getElementById('registerPane');
      const tabLogin = document.getElementById('tabLogin'), tabRegister = document.getElementById('tabRegister');
      if(tab==='register'){ loginPane.style.display='none'; registerPane.style.display='block'; tabLogin.classList.remove('active'); tabRegister.classList.add('active'); }
      else { loginPane.style.display='block'; registerPane.style.display='none'; tabLogin.classList.add('active'); tabRegister.classList.remove('active'); }
    }

    // Auth actions
    async function modalRegister(){
      const name = (document.getElementById('modalName').value||'').trim();
      const phone = (document.getElementById('modalPhone').value||'').trim();
      const email = (document.getElementById('modalEmail').value||'').trim();
      const password = (document.getElementById('modalPassword').value||'').trim();
      if(!name || !phone || !email || !password){ showToast(i18n('auth.fill_all')); return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showToast(i18n('auth.email_invalid')); return; }
      if(!/^\+?\d{10,15}$/.test(phone)){ showToast(i18n('auth.phone_invalid')); return; }
      if(password.length<6){ showToast(i18n('auth.pass_short')); return; }
      if(!supabase){ showToast('Сервис недоступен'); return; }
      try{
        const { data, error } = await supabase.auth.signUp({ email, password, options:{ data: { full_name: name, phone_number: phone } }});
        if(error) throw error;
        // attempt sign-in, but even if not possible (email confirm) we inform
        try{
          await supabase.auth.signInWithPassword({ email, password });
        }catch(e){}
        closeAuthModal();
        showToast(i18n('auth.reg_ok'));
        setTimeout(()=> window.location.href = 'profile.html', 700);
      }catch(err){
        console.error(err);
        showToast((i18n('auth.reg_error')||'Ошибка регистрации') + (err?.message?': '+err.message:''));
      }
    } 

    async function modalLogin(){
      const email = (document.getElementById('loginEmailModal').value||'').trim();
      const password = (document.getElementById('loginPasswordModal').value||'').trim();
      if(!email || !password){ showToast(i18n('auth.fill_all')); return; }
      if(!supabase){ showToast('Сервис недоступен'); return; }
      try{
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) throw error;
        closeAuthModal();
        // update header avatar and redirect to profile
        try{ const { data: { user } } = await supabase.auth.getUser(); if(user) updateHeaderAvatarFromUser(user); }catch(e){}
        window.location.href = 'profile.html';
      }catch(err){
        console.error(err);
        showToast((i18n('auth.login_error')||'Ошибка входа') + (err?.message?': '+err.message:''));
      }
    }

    async function loginWithOAuth(provider){
      if(!supabase){ showToast('Сервис недоступен'); return; }
      try{
        await supabase.auth.signInWithOAuth({ provider });
      }catch(err){ console.error(err); showToast((i18n('auth.login_error')||'Ошибка входа') + (err?.message?': '+err.message:'')); }
    }

    // expose loginWithOAuth for modal button
    function loginWithGoogle(){ return loginWithOAuth('google'); }

    // init header avatar on load
    initHeaderAvatar().catch(()=>{});