'use strict';

/**
 * Browser demo of the Jot crew — one chat, three brothers behind it.
 * No network, no API keys.
 */
(function initCrewDemo() {
  const panel = document.getElementById('agent-panel');
  if (!panel) return;

  const chatEl = document.getElementById('agent-chat');
  const formEl = document.getElementById('agent-form');
  const inputEl = document.getElementById('agent-input');
  const nameEl = document.getElementById('active-name');

  function routePersona(message) {
    const m = String(message || '').trim().toLowerCase();
    if (!m) return { personaId: 'octavius', reason: 'default', auto: true };

    const taquavion =
      /\b(snooze|dismiss|never\s+(?:show|resurface)|standing rule)\b/i.test(m) ||
      /\b(too (?:much|aggressive|often)|less aggressive|surface less|surface more|wrong (?:time|moment|note))\b/i.test(m) ||
      /\b(policy|why (?:did|do) you (?:show|surface)|timing)\b/i.test(m) ||
      /\b(stop resurfacing|reset (?:your )?policy)\b/i.test(m);

    const jacquavius =
      /\b(remind|trigger|resurfac\w*|when i open|when i'm|when i am|when on|tomorrow at|in \d+ (min|minute|hour))\b/i.test(m) ||
      /\b(reorganize|organize|file|folder|merge|move|rename|clean up|library)\b/i.test(m) ||
      /\b(set_?resurface|organize_hint)\b/i.test(m);

    const octavius =
      /\b(explain|teach|walk me through|help me understand|what does|what did|summarize|summary|break down|clarify|meaning of|why does)\b/i.test(m) ||
      /\b(read this|read my|tell me about|how do i|what('s| is) mode)\b/i.test(m) ||
      /\b(do it|handle it|run it|make it happen|execute)\b/i.test(m);

    if (taquavion) return { personaId: 'taquavion', reason: 'resurface_intent', auto: true };
    if (jacquavius) return { personaId: 'jacquavius', reason: 'organize_intent', auto: true };
    if (octavius) return { personaId: 'octavius', reason: 'interact_intent', auto: true };
    return { personaId: 'octavius', reason: 'default', auto: true };
  }

  function demoReply(personaId, message) {
    const text = String(message || '').trim();

    if (personaId === 'jacquavius') {
      return (
        `Got it — we’d file this as a reminder prompt:\n\n“${text}”\n\n` +
        `In the Mac app the crew sets the trigger (time / app / screen context) and keeps the note tidy. ` +
        `The local policy decides when it comes back. This browser demo doesn’t save on your Mac — ` +
        `download J.O.T. Reminders (free) or Workspace ($20/mo) to make it real.`
      );
    }
    if (personaId === 'taquavion') {
      return (
        `We’d tune timing against what you said. In the app the local policy decides when a card appears — ` +
        `not an LLM on every app switch.\n\n` +
        `Your note: “${text}”\n\n` +
        `Snooze, surface less, standing rules — that’s still the Jot crew. ` +
        `Try Workspace for the full loop, or Reminders if you only need calm nudges.`
      );
    }
    return (
      `We’d walk through this with you.\n\n` +
      `You said: “${text}”\n\n` +
      `Jacquavius, Octavius, and Taquavion work as one crew: file it, explain it, ` +
      `and bring it back when the moment matches. Try a reminder, an explain, or a policy example.`
    );
  }

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `msg msg-${role}`;
    div.dataset.persona = 'crew';

    if (role === 'assistant') {
      const badge = document.createElement('div');
      badge.className = 'msg-badge';
      badge.textContent = 'Jot crew';
      div.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'msg-body';
    body.textContent = text;
    div.appendChild(body);
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function pinIntro() {
    chatEl.innerHTML = '';
    if (nameEl) nameEl.textContent = 'Jot crew';
    appendMsg(
      'assistant',
      'We’re the Jot crew — Jacquavius, Octavius, and Taquavion. Talk to us as one. Send a reminder, a question, or a timing note.'
    );
  }

  panel.querySelectorAll('.example').forEach((btn) => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.getAttribute('data-example') || '';
      inputEl.focus();
    });
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    const routed = routePersona(text);
    appendMsg('user', text);
    inputEl.value = '';
    window.setTimeout(() => {
      appendMsg('assistant', demoReply(routed.personaId, text));
    }, 280);
  });

  pinIntro();
})();
