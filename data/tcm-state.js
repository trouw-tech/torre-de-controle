/**
 * TCM — Torre de Controle · Estado Compartilhado
 * Persiste o estado de tratativas no localStorage para que todos os
 * módulos (Operacional, Modo Tratativa, Config) enxerguem o mesmo contexto.
 *
 * Carregue APÓS tcm-data.js:
 *   <script src="../data/tcm-state.js"></script>
 *
 * Expõe: window.TCM.state, window.TCM.saveState(), window.TCM.resetState()
 *
 * Estado:
 *   TCM.state.tratativas = {
 *     'SM-9500': { status: 'resolved'|'holding'|'pending', updatedAt: timestamp, holdReason: '' }
 *   }
 */
(function () {
  'use strict';

  const KEY = 'tcm_state_v1';

  function defaultState () {
    return { tratativas: {}, session: Date.now() };
  }

  function loadState () {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return defaultState();
  }

  function saveState () {
    try {
      localStorage.setItem(KEY, JSON.stringify(window.TCM.state));
    } catch (e) { /* ignore */ }
  }

  function resetState () {
    window.TCM.state = defaultState();
    saveState();
  }

  // ── Helpers de escrita ───────────────────────────────────────────────────
  function setTratativa (smId, status, extra) {
    window.TCM.state.tratativas[smId] = Object.assign(
      { status, updatedAt: Date.now() },
      extra || {}
    );
    saveState();
  }

  function getTratativa (smId) {
    return window.TCM.state.tratativas[smId] || { status: 'pending' };
  }

  // ── Contadores derivados ─────────────────────────────────────────────────
  function counts () {
    const all = window.TCM.state.tratativas;
    let resolved = 0, holding = 0, pending = 0;
    Object.values(all).forEach(t => {
      if (t.status === 'resolved') resolved++;
      else if (t.status === 'holding') holding++;
      else pending++;
    });
    const total = (window.TCM.queue || []).length;
    return { resolved, holding, pending: total - resolved - holding, total };
  }

  // ── Inicialização ────────────────────────────────────────────────────────
  window.TCM = window.TCM || {};
  window.TCM.state      = loadState();
  window.TCM.saveState  = saveState;
  window.TCM.resetState = resetState;
  window.TCM.setTratativa  = setTratativa;
  window.TCM.getTratativa  = getTratativa;
  window.TCM.counts        = counts;

})();
