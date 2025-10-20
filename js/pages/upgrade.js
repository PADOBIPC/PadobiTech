export default function create_upgarade(){
    const upgrade = document.createElement('div');

    upgrade.innerHTML = `
  <div class="wrap">
    <div class="page-top">
      <div>
        <h1 data-i18n="tradein.title">Апгрейд и Trade‑in</h1>
        <div class="lead" data-i18n="tradein.lead">Сдавайте свои старые комплектующие — получите зачёт при покупке нового. Предварительная оценка доступна онлайн; окончательная — в мастерской после тестирования.</div>
      </div>
    </div>

    <div class="layout">
      <section class="panel">
        <div class="steps" aria-hidden="false">
          <div class="step-pill active" data-i18n="tradein.step1">1. Что вы сдаёте</div>
          <div class="step-pill" data-i18n="tradein.step2">2. Что хотите взять</div>
          <div class="step-pill" data-i18n="tradein.step3">3. Оформление</div>
        </div>

        <form id="tradeForm" class="trade-form" autocomplete="off" novalidate>
          <div class="group">
            <label for="customerName" data-i18n="tradein.label_name">ФИО / Название</label>
            <input id="customerName" type="text" placeholder="Иван Иванов" />
          </div>

          <div class="group">
            <label for="phone" data-i18n="tradein.label_phone">Телефон</label>
            <input id="phone" type="tel" placeholder="+38 (0__) ___-__-__" />
          </div>

          <div class="group">
            <label data-i18n="tradein.label_parts">Список комплектующих (сдаёте)</label>
            <div class="parts-list" id="partsList" aria-live="polite"></div>

            <div class="add-part">
              <select id="newPartType" aria-label="Тип компонента" data-i18n="tradein.new_part_type">
                <option value="cpu">CPU</option>
                <option value="gpu">GPU</option>
                <option value="ram">RAM</option>
                <option value="storage">SSD/HDD</option>
                <option value="psu">PSU</option>
                <option value="mb">Motherboard</option>
                <option value="case">Корпус</option>
              </select>
              <button type="button" id="addPartBtn" class="btn" data-i18n="tradein.add_part">Добавить</button>
              <div class="small" data-i18n="tradein.add_part_hint">Укажите модель и состояние — мы оценим.</div>
            </div>
          </div>

          <div class="group">
            <label data-i18n="tradein.label_photos">Фото компонентов (опционально)</label>
          </div>

          <div class="group">
            <label data-i18n="tradein.label_target">Целевой апгрейд</label>
          </div>

          <div class="group">
            <label for="note" data-i18n="tradein.label_note">Доп. заметки</label>
            <textarea id="note" placeholder="Особенности, серийники, почему продаёте..."></textarea>
          </div>

          <div class="group">
            <label data-i18n="tradein.label_agree">Условия и подтверждение</label>
            <div style="display:flex;gap:12px;align-items:center">
              <input id="agree" type="checkbox" />
              <label for="agree" class="small" data-i18n="tradein.label_agree_text">Я ознакомился с условиями trade‑in и согласен на оценку состояния</label>
            </div>
          </div>

          <div style="display:flex;gap:12px;align-items:center;margin-top:6px">
            <button type="button" id="estimateBtn" class="btn" data-i18n="tradein.estimate">Оценить сейчас</button>
            <button type="button" id="saveQuote" class="btn ghost" data-i18n="tradein.save_quote">Сохранить запрос</button>
          </div>
        </form>
      </section>

      <aside>
        <div class="summary panel" aria-live="polite">
          <div class="title" data-i18n="tradein.summary_title">Сводка оценки</div>
        </div>
      </aside>
    </div>
  </div>
    `;
    return upgrade;
};