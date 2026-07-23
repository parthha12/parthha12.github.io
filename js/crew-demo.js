'use strict';

/**
 * Browser demo of J·O·T crew routing + persona replies.
 * Ported lightly from jot-crew/routePersona.js — no network, no API keys.
 */
(function initCrewDemo() {
  const panel = document.getElementById('agent-panel');
  if (!panel) return;

  const chatEl = document.getElementById('agent-chat');
  const formEl = document.getElementById('agent-form');
  const inputEl = document.getElementById('agent-input');
  const hintEl = document.getElementById('route-hint');
  const faceEl = document.getElementById('active-face');
  const nameEl = document.getElementById('active-name');

  const PERSONAS = {
    jacquavius: {
      id: 'jacquavius',
      name: 'Jacquavius',
      letter: 'J',
      role: 'Organize',
      avatar: 'assets/jacquavius-avatar.png',
    },
    octavius: {
      id: 'octavius',
      name: 'Octavius',
      letter: 'O',
      role: 'Interact',
      avatar: 'assets/octavius-avatar.png',
    },
    taquavion: {
      id: 'taquavion',
      name: 'Taquavion',
      letter: 'T',
      role: 'Resurface',
      avatar: 'assets/taquavion-avatar.png',
    },
  };

  const CREW_FACE = {
    avatar: 'assets/jot-icon-512.png',
    name: 'J·O·T Crew',
  };

  let manualPick = 'auto';

  function routePersona(message) {
    if (manualPick !== 'auto') {
      return { personaId: manualPick, reason: 'manual', auto: false };
    }
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
    const p = PERSONAS[personaId] || PERSONAS.octavius;

    if (personaId === 'jacquavius') {
      return (
        `Got it — I’d file this as a reminder prompt:\n\n“${text}”\n\n` +
        `In the Mac app I’d set the trigger (time / app / screen context), keep the note tidy, ` +
        `then hand timing to Taquavion. This browser demo doesn’t save on your Mac — ` +
        `download J.O.T. Reminders (free) or Workspace ($20/mo) to make it real.`
      );
    }
    if (personaId === 'taquavion') {
      return (
        `I’m the resurface brother. In the app the local policy decides when a card appears — ` +
        `not an LLM on every app switch.\n\n` +
        `Your note: “${text}”\n\n` +
        `I’d tune timing (snooze, surface less, standing rules) against what you said. ` +
        `Try Workspace for the full crew loop, or Reminders if you only need calm nudges.`
      );
    }
    return (
      `Hey — I’m ${p.name}. I’d walk through this with you in the crew chat.\n\n` +
      `You said: “${text}”\n\n` +
      `Jacquavius files and sets triggers. I explain and help you use Jot day to day. ` +
      `Taquavion delivers when context matches. Pin a brother above, or leave Auto on and ` +
      `try a reminder / explain / policy example.`
    );
  }

  function showFace(personaId, { auto = true } = {}) {
    const p = personaId && PERSONAS[personaId] ? PERSONAS[personaId] : null;
    if (faceEl) {
      faceEl.src = p ? p.avatar : CREW_FACE.avatar;
      faceEl.alt = p ? p.name : CREW_FACE.name;
      faceEl.dataset.persona = p ? p.id : 'crew';
    }
    if (nameEl) {
      nameEl.textContent = p ? p.name : CREW_FACE.name;
      nameEl.dataset.persona = p ? p.id : 'crew';
    }
    if (!hintEl) return;
    if (!p) {
      hintEl.textContent = 'Auto — routes by what you type';
      return;
    }
    hintEl.textContent = auto ? `→ ${p.name} (${p.role})` : `Pinned: ${p.name}`;
  }

  function appendMsg(role, text, personaId) {
    const div = document.createElement('div');
    div.className = `msg msg-${role}`;
    if (personaId) div.dataset.persona = personaId;

    if (role === 'assistant' && personaId && PERSONAS[personaId]) {
      const p = PERSONAS[personaId];
      const badge = document.createElement('div');
      badge.className = 'msg-badge';
      const img = document.createElement('img');
      img.src = p.avatar;
      img.alt = '';
      img.width = 18;
      img.height = 18;
      badge.appendChild(img);
      badge.appendChild(document.createTextNode(` ${p.name}`));
      div.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'msg-body';
    body.textContent = text;
    div.appendChild(body);
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function pinIntro(personaId) {
    chatEl.innerHTML = '';
    if (!personaId || personaId === 'auto') {
      appendMsg(
        'assistant',
        'Auto routes by intent: reminders → Jacquavius, explain → Octavius, timing/policy → Taquavion. Send a message to try it.',
        'octavius'
      );
      return;
    }
    const p = PERSONAS[personaId];
    const lines = {
      jacquavius:
        'Pinned to Jacquavius — I’ll organize: capture prompts, set triggers, file notes. Try a reminder.',
      octavius:
        'Pinned to Octavius — I’ll interact: explain notes, walk through modes, help you use Jot. Ask anything.',
      taquavion:
        'Pinned to Taquavion — I’ll resurface: timing, snooze, policy, “surface less.” Tell me what felt wrong.',
    };
    appendMsg('assistant', lines[personaId] || `Pinned to ${p.name}.`, personaId);
  }

  panel.querySelectorAll('.pick').forEach((btn) => {
    btn.addEventListener('click', () => {
      manualPick = btn.getAttribute('data-pick') || 'auto';
      panel.querySelectorAll('.pick').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (manualPick === 'auto') {
        showFace(null);
        pinIntro('auto');
      } else {
        showFace(manualPick, { auto: false });
        pinIntro(manualPick);
      }
    });
  });

  panel.querySelectorAll('.example').forEach((btn) => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.getAttribute('data-example') || '';
      inputEl.focus();
      const routed = routePersona(inputEl.value);
      showFace(routed.personaId, { auto: routed.auto });
    });
  });

  inputEl.addEventListener('input', () => {
    if (manualPick !== 'auto') return;
    const t = inputEl.value.trim();
    if (!t) {
      showFace(null);
      return;
    }
    const routed = routePersona(t);
    showFace(routed.personaId, { auto: true });
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    const routed = routePersona(text);
    showFace(routed.personaId, { auto: routed.auto });
    appendMsg('user', text);
    inputEl.value = '';
    window.setTimeout(() => {
      appendMsg('assistant', demoReply(routed.personaId, text), routed.personaId);
    }, 280);
  });

  showFace(null);
  pinIntro('auto');
})();
