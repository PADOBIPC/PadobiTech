export default function create_configurator(){
    const configurator = document.createElement('div');

    configurator.innerHTML = `

  <div class="wrap">
    <div class="top-row">
      <div>
        <h1 id="pageTitle" data-i18n="page.title">Конфигуратор ПК</h1>
        <div class="lead" id="pageLead" data-i18n="page.lead">Собирайте сборку, проверяйте совместимость и добавляйте в корзину.</div>
      </div>
      <div style="text-align:right">
        <small id="hintShort" class="lead" style="color:var(--muted)" data-i18n="page.hint_short">Начните с CPU или GPU</small>
      </div>
    </div>

    <div class="layout">
      <!-- LEFT: configurator -->
      <section class="panel" aria-label="Конфигуратор" data-i18n="section.configurator">
        <div class="parts" id="partsRoot">

          <!-- CPU -->
          <div class="part" data-part="cpu" aria-labelledby="cpuTitle">
            <div class="media"><img src="imgs/cpu_default.jpg" alt="CPU image" onerror="this.style.display='none'"></div>
            <div class="meta">
              <div class="title" id="cpuTitle" data-i18n="cpu.title">Процессор (CPU)</div>
              <div class="desc" id="cpuDesc" data-i18n="cpu.desc">Выберите процессор — сокет и TDP указаны в опциях.</div>

              <div class="options" id="opt-cpu" role="list">
                <button class="option" data-name="Intel Core i5-14600" data-price="8500" data-socket="LGA1700" data-tdp="65" data-i18n="opt.cpu.intel_i5_14600">Intel i5-14600 — 8 500 ₴ — LGA1700 — 65W</button>
                <button class="option" data-name="Intel Core i7-14700" data-price="14500" data-socket="LGA1700" data-tdp="125" data-i18n="opt.cpu.intel_i7_14700">Intel i7-14700 — 14 500 ₴ — LGA1700 — 125W</button>
                <button class="option" data-name="AMD Ryzen 7 7800X" data-price="11000" data-socket="AM5" data-tdp="105" data-i18n="opt.cpu.ryzen_7_7800x">Ryzen 7 7800X — 11 000 ₴ — AM5 — 105W</button>
              </div>
            </div>
          </div>

          <!-- Motherboard -->
          <div class="part" data-part="mb">
            <div class="media"><img src="imgs/mb_default.jpg" alt="MB image" onerror="this.style.display='none'"></div>
            <div class="meta">
              <div class="title" data-i18n="mb.title">Материнская плата (MB)</div>
              <div class="desc" data-i18n="mb.desc">Выбирайте плату с совместимым сокетом и нужным форм-фактором.</div>

              <div class="options" id="opt-mb">
                <button class="option" data-name="ASUS TUF LGA1700" data-price="5600" data-socket="LGA1700" data-form="ATX" data-maxGpu="360" data-i18n="opt.mb.asus_tuf">ASUS TUF (LGA1700, ATX) — 5 600 ₴</button>
                <button class="option" data-name="MSI MAG AM5" data-price="6200" data-socket="AM5" data-form="ATX" data-maxGpu="340" data-i18n="opt.mb.msi_mag">MSI MAG (AM5, ATX) — 6 200 ₴</button>
                <button class="option" data-name="Gigabyte B660M" data-price="4200" data-socket="LGA1700" data-form="mATX" data-maxGpu="300" data-i18n="opt.mb.gigabyte_b660m">Gigabyte B660M (mATX) — 4 200 ₴</button>
              </div>
            </div>
          </div>

          <!-- GPU -->
          <div class="part" data-part="gpu">
            <div class="media"><img src="imgs/gpu_default.jpg" alt="GPU image" onerror="this.style.display='none'"></div>
            <div class="meta">
              <div class="title" data-i18n="gpu.title">Видеокарта (GPU)</div>
              <div class="desc" data-i18n="gpu.desc">Укажите длину в мм и TDP (нужно для проверки корпуса и питания).</div>

              <div class="options" id="opt-gpu">
                <button class="option" data-name="RTX 4070 Ti" data-price="25000" data-tdp="285" data-length="285" data-i18n="opt.gpu.rtx_4070_ti">RTX 4070 Ti — 25 000 ₴ — 285mm — 285W</button>
                <button class="option" data-name="RTX 4090" data-price="42000" data-tdp="450" data-length="336" data-i18n="opt.gpu.rtx_4090">RTX 4090 — 42 000 ₴ — 336mm — 450W</button>
                <button class="option" data-name="RX 7800 XT" data-price="16000" data-tdp="300" data-length="300" data-i18n="opt.gpu.rx_7800_xt">RX 7800 XT — 16 000 ₴ — 300mm — 300W</button>
              </div>
            </div>
          </div>

          <!-- Cooler -->
          <div class="part" data-part="cooler">
            <div class="media"><img src="imgs/cooler_default.jpg" alt="Cooler" onerror="this.style.display='none'"></div>
            <div class="meta">
              <div class="title" data-i18n="cooler.title">Кулер (CPU Cooler)</div>
              <div class="desc" data-i18n="cooler.desc">Высота кулера важна для совместимости с корпусом.</div>

              <div class="options" id="opt-cooler">
                <button class="option" data-name="Air Cooler 160mm" data-price="1400" data-height="160" data-i18n="opt.cooler.air_160">Air Cooler — 1 400 ₴ — 160mm</button>
                <button class="option" data-name="AIO 240" data-price="3600" data-height="55" data-i18n="opt.cooler.aio_240">AIO 240mm — 3 600 ₴ — low-profile</button>
                <button class="option" data-name="Air Cooler 180mm" data-price="2200" data-height="180" data-i18n="opt.cooler.air_180">Air Cooler — 2 200 ₴ — 180mm</button>
              </div>
            </div>
          </div>

          <!-- RAM -->
          <div class="part" data-part="ram">
            <div class="media"><svg width="120" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="6" width="20" height="12" rx="2"/></svg></div>
            <div class="meta">
              <div class="title" data-i18n="ram.title">Оперативная память (RAM)</div>
              <div class="desc" data-i18n="ram.desc">DDR5 рекомендуем для современных систем.</div>

              <div class="options" id="opt-ram">
                <button class="option" data-name="16GB DDR5" data-price="2200" data-i18n="opt.ram.16gb">16 GB DDR5 — 2 200 ₴</button>
                <button class="option" data-name="32GB DDR5" data-price="4200" data-i18n="opt.ram.32gb">32 GB DDR5 — 4 200 ₴</button>
                <button class="option" data-name="64GB DDR5" data-price="8200" data-i18n="opt.ram.64gb">64 GB DDR5 — 8 200 ₴</button>
              </div>
            </div>
          </div>

          <!-- Storage -->
          <div class="part" data-part="storage">
            <div class="media"><svg width="120" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/></svg></div>
            <div class="meta">
              <div class="title" data-i18n="storage.title">Накопитель (SSD)</div>
              <div class="desc" data-i18n="storage.desc">NVMe для системы — увеличит скорость загрузки.</div>

              <div class="options" id="opt-storage">
                <button class="option" data-name="500GB NVMe" data-price="2400" data-i18n="opt.storage.500gb">500 GB NVMe — 2 400 ₴</button>
                <button class="option" data-name="1TB NVMe" data-price="4200" data-i18n="opt.storage.1tb">1 TB NVMe — 4 200 ₴</button>
                <button class="option" data-name="2TB NVMe" data-price="7600" data-i18n="opt.storage.2tb">2 TB NVMe — 7 600 ₴</button>
              </div>
            </div>
          </div>

          <!-- PSU -->
          <div class="part" data-part="psu">
            <div class="media"><svg width="120" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/></svg></div>
            <div class="meta">
              <div class="title" data-i18n="psu.title">Блок питания (PSU)</div>
              <div class="desc" data-i18n="psu.desc">Выберите с запасом мощности — мы считаем необходимые Вт по компонентам.</div>

              <div class="options" id="opt-psu">
                <button class="option" data-name="650W Gold" data-price="2600" data-watt="650" data-i18n="opt.psu.650w">650 W Gold — 2 600 ₴</button>
                <button class="option" data-name="850W Gold" data-price="3600" data-watt="850" data-i18n="opt.psu.850w">850 W Gold — 3 600 ₴</button>
                <button class="option" data-name="1200W Platinum" data-price="5200" data-watt="1200" data-i18n="opt.psu.1200w">1200 W Platinum — 5 200 ₴</button>
              </div>
            </div>
          </div>

          <!-- Case -->
          <div class="part" data-part="case">
            <div class="media"><img src="imgs/case_default.jpg" alt="Case image" onerror="this.style.display='none'"></div>
            <div class="meta">
              <div class="title" data-i18n="case.title">Корпус</div>
              <div class="desc" data-i18n="case.desc">Проверьте поддерживаемую длину видеокарты и высоту кулера.</div>

              <div class="options" id="opt-case">
                <button class="option" data-name="Mid Tower ARGB" data-price="3200" data-maxGpu="350" data-maxCooler="170" data-i18n="opt.case.mid_tower">Mid Tower ARGB — 3 200 ₴ — max GPU 350mm</button>
                <button class="option" data-name="Compact ATX" data-price="2400" data-maxGpu="300" data-maxCooler="160" data-i18n="opt.case.compact">Compact ATX — 2 400 ₴ — max GPU 300mm</button>
                <button class="option" data-name="Full Tower" data-price="4800" data-maxGpu="400" data-maxCooler="200" data-i18n="opt.case.full_tower">Full Tower — 4 800 ₴ — max GPU 400mm</button>
              </div>
            </div>
          </div>

        </div>

        <div id="compatHint" class="hint" data-i18n="compat.hint">Советы по совместимости и мощности появятся здесь.</div>
      </section>

      <!-- RIGHT: summary / actions -->
      <aside>
        <div class="panel summary" aria-label="Сводка сборки">
          <div class="title" id="summaryTitle" data-i18n="summary.title">Сборка — краткая сводка</div>

          <div class="s-row"><div class="label">CPU</div><div class="value" id="sum-cpu">—</div></div>
          <div class="s-row"><div class="label">MB</div><div class="value" id="sum-mb">—</div></div>
          <div class="s-row"><div class="label">GPU</div><div class="value" id="sum-gpu">—</div></div>
          <div class="s-row"><div class="label">RAM</div><div class="value" id="sum-ram">—</div></div>
          <div class="s-row"><div class="label">SSD</div><div class="value" id="sum-storage">—</div></div>
          <div class="s-row"><div class="label">Cooler</div><div class="value" id="sum-cooler">—</div></div>
          <div class="s-row"><div class="label">PSU</div><div class="value" id="sum-psu">—</div></div>
          <div class="s-row"><div class="label">Case</div><div class="value" id="sum-case">—</div></div>

          <div class="total"><div id="totalLabel" data-i18n="summary.total_label">К оплате</div><div id="grandTotal">0 ₴</div></div>

          <div id="compatMessages" style="margin-top:10px;color:var(--muted);font-size:13px" data-i18n="compat.messages">Здесь будут сообщения о совместимости</div>

          <div class="actions-col">
            <button id="saveBuild" class="btn" data-i18n="buttons.save">Сохранить сборку</button>
            <button id="addToCart" class="btn" data-i18n="buttons.add_cart">Добавить в корзину</button>
            <button id="resetBtn" class="btn ghost" data-i18n="buttons.reset">Сбросить</button>
          </div>

          <div style="margin-top:14px">
            <div class="title" style="font-size:14px" id="presetsTitle" data-i18n="presets.title">Предустановки</div>
            <div class="presets" id="presets">
              <div class="preset" data-preset="starter"><div>Старт — офис</div><div style="color:var(--muted)">~ 20 000 ₴</div></div>
              <div class="preset" data-preset="gamer"><div>Игровая — сбаланс.</div><div style="color:var(--muted)">~ 55 000 ₴</div></div>
              <div class="preset" data-preset="pro"><div>Про-рабочая</div><div style="color:var(--muted)">~ 90 000 ₴</div></div>
            </div>
          </div>

          <div style="margin-top:12px">
            <div class="title" style="font-size:14px" id="savedTitle" data-i18n="saved.title">Сохранённые сборки</div>
            <div class="saved" id="savedBuilds"></div>
          </div>
        </div>
      </aside>
    </div>
  </div>



    `;

    return configurator;
};