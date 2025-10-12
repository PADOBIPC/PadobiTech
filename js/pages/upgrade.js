export default function create_upgarade(){
    const upgrade = document.createElement('div');

    upgrade.innerHTML = `
    <main>
    <div class="wrap">
      <div class="page-top">
        <div>
          <h1>Апгрейд и Trade‑in</h1>
          <div class="lead">Сдавайте свои старые комплектующие — получите зачёт при покупке нового. Предварительная оценка доступна онлайн; окончательная — в мастерской после тестирования.</div>
        </div>
      </div>

      <div class="layout">
        <!-- LEFT -->
        <section class="panel">
          <div class="steps" aria-hidden="false">
            <div class="step-pill active">1. Что вы сдаёте</div>
            <div class="step-pill">2. Что хотите взять</div>
            <div class="step-pill">3. Оформление</div>
          </div>

          <form id="tradeForm" class="trade-form" autocomplete="off" novalidate>
            <div class="group">
              <label for="customerName">ФИО / Название</label>
              <input id="customerName" type="text" placeholder="Иван Иванов" />
            </div>

            <div class="group">
              <label for="phone">Телефон</label>
              <input id="phone" type="tel" placeholder="+38 (0__) ___-__-__" />
            </div>

            <div class="group">
              <label>Список комплектующих (сдаёте)</label>
              <div class="parts-list" id="partsList" aria-live="polite"></div>

              <div class="add-part">
                <select id="newPartType" aria-label="Тип компонента">
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                  <option value="ram">RAM</option>
                  <option value="storage">SSD/HDD</option>
                  <option value="psu">PSU</option>
                  <option value="mb">Motherboard</option>
                  <option value="case">Корпус</option>
                </select>
                <button type="button" id="addPartBtn" class="btn">Добавить</button>
                <div class="small">Укажите модель и состояние — мы оценим.</div>
              </div>
            </div>

            <div class="group">
              <label>Фото компонентов (опционально)</label>
              <div class="uploader" id="uploader">
                <label class="file-slot"><input type="file" accept="image/*" style="display:none" class="file-input" /><div class="muted">Загрузить фото</div></label>
                <label class="file-slot"><input type="file" accept="image/*" style="display:none" class="file-input" /><div class="muted">Загрузить фото</div></label>
                <label class="file-slot"><input type="file" accept="image/*" style="display:none" class="file-input" /><div class="muted">Загрузить фото</div></label>
              </div>
            </div>

            <div class="group">
              <label>Целевой апгрейд</label>
              <select id="targetChoice">
                <option value="store">Я хочу скидку на покупку</option>
                <option value="cash">Я хочу деньги за комплектующие</option>
                <option value="swap">Обменять на другой компонент</option>
              </select>
              <input id="targetDetails" type="text" placeholder="Например: RTX 4070 или 'снижение цены на сборку'" />
            </div>

            <div class="group">
              <label for="note">Доп. заметки</label>
              <textarea id="note" placeholder="Особенности, серийники, почему продаёте..."></textarea>
            </div>

            <div class="group">
              <label>Условия и подтверждение</label>
              <div style="display:flex;gap:12px;align-items:center">
                <input id="agree" type="checkbox" />
                <label for="agree" class="small">Я ознакомился с условиями trade‑in и согласен на оценку состояния</label>
              </div>
            </div>

            <div style="display:flex;gap:12px;align-items:center;margin-top:6px">
              <button type="button" id="estimateBtn" class="btn">Оценить сейчас</button>
              <button type="button" id="saveQuote" class="btn ghost">Сохранить запрос</button>
            </div>
          </form>
        </section>

        <!-- RIGHT -->
        <aside>
          <div class="summary panel" aria-live="polite">
            <div class="title">Сводка оценки</div>

            <div class="estimate" style="margin-top:8px">
              <div class="row"><div class="label">Оценка компонентов</div><div class="value" id="estTotal">— ₴</div></div>
              <div class="row"><div class="label">Применимый кредит (Trade‑in)</div><div class="value credit" id="tradeCredit">— ₴</div></div>
              <div class="row"><div class="label">Цена желаемого компонента</div><div class="value" id="targetPrice">— ₴</div></div>
              <div class="row"><div class="label">К доплате / к возврату</div><div class="value" id="diff">— ₴</div></div>
            </div>

            <div style="margin-top:12px">
              <label class="small">Как используется кредит</label>
              <!-- prettier interactive cards instead of bullets -->
              <div class="credit-usage" id="creditUsage">
                <div class="credit-card" data-use="discount"><h4>Скидка сейчас</h4><p>Моментальная скидка при покупке</p></div>
                <div class="credit-card" data-use="deposit"><h4>На счёт</h4><p>Зачисление на ваш счёт для будущих покупок</p></div>
                <div class="credit-card" data-use="cash"><h4>Наличными</h4><p>Выдача наличных в мастерской</p></div>
              </div>
            </div>

            <div style="margin-top:12px">
              <label class="small">Записаться для сдачи</label>
              <input id="visitDate" type="date" />
              <input id="visitTime" type="time" />
            </div>

            <div class="cta">
              <button id="proceedBtn" class="btn">Продолжить оформление</button>
              <button id="printQuote" class="btn ghost">Печать</button>
            </div>

            <div style="margin-top:12px;color:var(--muted);font-size:13px">
              Сервис trade‑in даёт предварительную оценку. Окончательная сумма зависит от физического состояния и результатов теста в мастерской.
            </div>
          </div>

          <div class="panel" style="margin-top:12px">
            <div class="title">Полезно</div>
            <ul style="margin-top:8px;color:var(--muted);padding-left:18px">
              <li>Мы тестируем компоненты и даём отчёт о состоянии.</li>
              <li>Кредит действует 90 дней.</li>
              <li>Вы можете забрать деньги или использовать их как скидку.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </main>
    `;
    return upgrade;
};