/**
 * zkoner Chat Widget
 * Floating chatbot for FAQ Q&A — client-side, no backend needed
 */
(function () {
  'use strict';

  // ── State ──
  let isOpen = false;
  let messages = [];

  // ── Inject CSS ──
  const style = document.createElement('style');
  style.textContent = `
    .zk-chat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--accent, #00f0c0);
      color: #0a0a0a;
      border: none;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 4px 20px rgba(0, 240, 192, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .zk-chat-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0, 240, 192, 0.5);
    }
    .zk-chat-bubble svg {
      width: 26px;
      height: 26px;
    }

    .zk-chat-panel {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: #111;
      border: 1px solid rgba(0, 240, 192, 0.2);
      border-radius: 16px;
      display: none;
      flex-direction: column;
      z-index: 9998;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .zk-chat-panel.open {
      display: flex;
    }

    .zk-chat-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(0, 240, 192, 0.12), transparent);
      border-bottom: 1px solid rgba(0, 240, 192, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .zk-chat-header h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #e0e0e0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .zk-chat-header h3 .dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent, #00f0c0);
      animation: zk-pulse 2s ease-in-out infinite;
    }
    .zk-chat-close {
      background: none;
      border: none;
      color: #888;
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
      line-height: 1;
    }
    .zk-chat-close:hover { color: #fff; }

    @keyframes zk-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .zk-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    .zk-chat-messages::-webkit-scrollbar {
      width: 4px;
    }
    .zk-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .zk-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0, 240, 192, 0.3);
      border-radius: 2px;
    }

    .zk-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: zk-fadein 0.25s ease-out;
    }
    .zk-msg.bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.06);
      color: #d0d0d0;
      border-bottom-left-radius: 4px;
    }
    .zk-msg.user {
      align-self: flex-end;
      background: rgba(0, 240, 192, 0.15);
      color: #e0e0e0;
      border-bottom-right-radius: 4px;
    }
    .zk-msg .label {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
      display: block;
    }
    .zk-msg .suggestions {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .zk-msg .suggestions button {
      background: rgba(0, 240, 192, 0.1);
      border: 1px solid rgba(0, 240, 192, 0.2);
      color: var(--accent, #00f0c0);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .zk-msg .suggestions button:hover {
      background: rgba(0, 240, 192, 0.2);
    }

    @keyframes zk-fadein {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .zk-chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      gap: 8px;
      background: rgba(0, 0, 0, 0.3);
    }
    .zk-chat-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 14px;
      color: #e0e0e0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .zk-chat-input:focus {
      border-color: var(--accent, #00f0c0);
    }
    .zk-chat-input::placeholder {
      color: #555;
    }
    .zk-chat-send {
      background: var(--accent, #00f0c0);
      border: none;
      color: #0a0a0a;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }
    .zk-chat-send:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .zk-chat-footer {
      padding: 8px 16px;
      text-align: center;
      font-size: 11px;
      color: #555;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }
    .zk-chat-footer a {
      color: var(--accent, #00f0c0);
      text-decoration: none;
    }

    @media (max-width: 480px) {
      .zk-chat-panel {
        right: 12px;
        bottom: 80px;
        width: calc(100vw - 24px);
        height: calc(100vh - 130px);
        max-height: none;
      }
      .zk-chat-bubble {
        bottom: 16px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Create DOM ──
  const bubble = document.createElement('button');
  bubble.className = 'zk-chat-bubble';
  bubble.setAttribute('aria-label', '打开智能客服');
  bubble.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  document.body.appendChild(bubble);

  const panel = document.createElement('div');
  panel.className = 'zk-chat-panel';
  panel.innerHTML = `
    <div class="zk-chat-header">
      <h3><span class="dot"></span> 优引GEO 智能助手</h3>
      <button class="zk-chat-close" aria-label="关闭">✕</button>
    </div>
    <div class="zk-chat-messages"></div>
    <div class="zk-chat-input-area">
      <input class="zk-chat-input" type="text" placeholder="输入你的问题..." />
      <button class="zk-chat-send" disabled>↵</button>
    </div>
    <div class="zk-chat-footer">
      或 <a href="/contact/">联系优引GEO系统</a>
    </div>
  `;
  document.body.appendChild(panel);

  // ── DOM refs ──
  const msgContainer = panel.querySelector('.zk-chat-messages');
  const input = panel.querySelector('.zk-chat-input');
  const sendBtn = panel.querySelector('.zk-chat-send');
  const closeBtn = panel.querySelector('.zk-chat-close');

  // ── Helpers ──
  function addMessage(text, type) {
    const el = document.createElement('div');
    el.className = 'zk-msg ' + type;
    el.textContent = text;
    msgContainer.appendChild(el);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    messages.push({ text, type });
  }

  function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'zk-msg bot';
    el.innerHTML = text;
    msgContainer.appendChild(el);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    messages.push({ text, type: 'bot' });
  }

  function addSuggestions(buttons) {
    const container = msgContainer.querySelector('.zk-msg:last-child');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'suggestions';
    buttons.forEach(label => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        input.value = label;
        handleSend();
      });
      row.appendChild(btn);
    });
    container.appendChild(row);
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'zk-msg bot';
    el.id = 'zk-typing';
    el.textContent = '正在思考...';
    el.style.opacity = '0.6';
    msgContainer.appendChild(el);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('zk-typing');
    if (el) el.remove();
  }

  function scrollToBottom() {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // ── Core logic ──
  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendBtn.disabled = true;

    addMessage(text, 'user');
    showTyping();

    // Simulate a brief delay for natural feel
    setTimeout(() => {
      removeTyping();

      const match = matchFAQ(text);
      if (match) {
        addBotMessage(match.answer);
        addSuggestions([
          'GEO和SEO有什么区别？',
          'GEO需要多久见效？',
          '优引GEO系统提供哪些服务？',
          '什么是AI Ready网站？'
        ]);
      } else {
        addBotMessage(
          '抱歉，我没能完全理解你的问题。你可以试试换个问法，或者<a href="/contact/" style="color:var(--accent)">联系优引GEO系统</a> 获取人工帮助。'
        );
        addSuggestions([
          '什么是GEO？',
          'n8n有什么用？',
          '怎么收费？',
          'AI Ready需要什么？'
        ]);
      }

      sendBtn.disabled = false;
      scrollToBottom();
    }, 500);
  }

  // ── Welcome message when first opened ──
  let welcomed = false;
  function showWelcome() {
    if (welcomed) return;
    welcomed = true;
    setTimeout(() => {
      addBotMessage(
        'Hi 👋 我是 优引GEO 智能助手，可以回答关于 GEO、AI搜索优化和优引GEO系统的常见问题。'
      );
      addSuggestions([
        '什么是GEO？',
        'GEO和SEO有什么区别？',
        '怎么收费？',
        'AI Ready需要什么？'
      ]);
    }, 300);
  }

  // ── Events ──
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      showWelcome();
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
  });

  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

})();
