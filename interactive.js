(() => {
  const currentScript = document.currentScript
  const rootUrl = currentScript
    ? new URL('.', currentScript.src)
    : new URL('./', window.location.href)
  const qrUrl = new URL('customer-service-qr.jpg', rootUrl).href

  const faqAnswers = {
    '如何订阅？': '选择想要的服务，扫码添加客服咨询下单。',
    '为什么有额外费用？':
      '服务价格包含订阅采购、支付通道、人工处理与售后支持等成本，页面展示价格即为当前套餐参考价格。',
    '退款和售后保障':
      '如果未成功订阅，我们会全额退回您支付的费用。成功订阅后如发生订阅失效，我们会优先协助修复；无法修复时，将按照剩余有效期处理退款。',
  }

  function ensureModal() {
    let overlay = document.querySelector('[data-customer-service-modal]')
    if (overlay) return overlay

    overlay = document.createElement('div')
    overlay.dataset.customerServiceModal = 'true'
    overlay.hidden = true
    overlay.innerHTML = `
      <div class="aipay-modal-backdrop" data-close-modal></div>
      <section class="aipay-modal-card" role="dialog" aria-modal="true" aria-labelledby="aipay-modal-title">
        <button class="aipay-modal-close" type="button" aria-label="关闭" data-close-modal>×</button>
        <div class="aipay-modal-icon" aria-hidden="true">⌁</div>
        <h2 id="aipay-modal-title">扫码联系客服</h2>
        <p class="aipay-modal-description">请使用微信扫描二维码添加客服，并备注需要订阅的套餐名称。</p>
        <div class="aipay-qr-frame"><img src="${qrUrl}" alt="客服微信二维码"></div>
        <div class="aipay-plan-row"><span>当前套餐</span><strong data-plan-name>扫码添加客服</strong></div>
      </section>`
    document.body.appendChild(overlay)

    const style = document.createElement('style')
    style.textContent = `
      [data-customer-service-modal]{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:18px}
      [data-customer-service-modal][hidden]{display:none}
      .aipay-modal-backdrop{position:absolute;inset:0;background:rgba(15,15,15,.48);backdrop-filter:blur(5px)}
      .aipay-modal-card{position:relative;width:min(420px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid #e2e2df;border-radius:24px;background:#fff;padding:28px;color:#151515;box-shadow:0 24px 70px rgba(0,0,0,.22);text-align:center}
      .aipay-modal-close{position:absolute;right:18px;top:16px;width:38px;height:38px;border:1px solid #dededb;border-radius:50%;background:#fff;color:#111;font-size:28px;line-height:32px;cursor:pointer}
      .aipay-modal-icon{display:grid;place-items:center;width:44px;height:44px;margin:0 auto 12px;border-radius:14px;background:#f2f2ef;font-size:24px}
      .aipay-modal-card h2{margin:0;font-size:24px;font-weight:650;letter-spacing:-.02em}
      .aipay-modal-description{margin:10px auto 18px;color:#6d6d69;font-size:14px;line-height:1.65}
      .aipay-qr-frame{margin:auto;width:min(280px,100%);padding:12px;border:1px solid #e4e4e1;border-radius:18px;background:#f7f7f5}
      .aipay-qr-frame img{display:block;width:100%;aspect-ratio:1;object-fit:contain;border-radius:12px;background:#fff}
      .aipay-plan-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:16px;padding:13px 15px;border:1px solid #e4e4e1;border-radius:14px;font-size:14px;text-align:left}
      .aipay-plan-row span{color:#74746f}.aipay-plan-row strong{text-align:right}
      .aipay-faq-answer{padding:0 0 24px;color:#73736e;font-size:14px;line-height:1.75}
      .aipay-faq-answer[hidden]{display:none}
      @media(max-width:520px){.aipay-modal-card{padding:24px 18px 20px;border-radius:20px}.aipay-qr-frame{width:min(250px,100%)}}
    `
    document.head.appendChild(style)

    overlay.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-modal]')) closeModal()
    })
    return overlay
  }

  function openModal(planName) {
    const overlay = ensureModal()
    overlay.querySelector('[data-plan-name]').textContent = planName || '扫码添加客服'
    overlay.hidden = false
    document.body.style.overflow = 'hidden'
    overlay.querySelector('.aipay-modal-close').focus()
  }

  function closeModal() {
    const overlay = document.querySelector('[data-customer-service-modal]')
    if (!overlay) return
    overlay.hidden = true
    document.body.style.overflow = ''
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal()
  })

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button')
    if (!button) return
    const label = button.textContent.replace(/\s+/g, ' ').trim()

    if (Object.prototype.hasOwnProperty.call(faqAnswers, label)) {
      event.preventDefault()
      const row = button.parentElement
      let answer = row.querySelector('.aipay-faq-answer')
      if (!answer) {
        answer = document.createElement('div')
        answer.className = 'aipay-faq-answer'
        answer.textContent = faqAnswers[label]
        row.appendChild(answer)
      } else {
        answer.hidden = !answer.hidden
      }
      const expanded = !answer.hidden
      button.setAttribute('aria-expanded', String(expanded))
      const chevron = button.querySelector('svg')
      if (chevron) chevron.style.transform = expanded ? 'rotate(180deg)' : ''
      return
    }

    if (/客服|确认方案并继续|联系订阅|扫码/.test(label)) {
      event.preventDefault()
      const planName = button.closest('article')?.querySelector('h2')?.textContent?.trim()
      openModal(planName)
    }
  })
})()
