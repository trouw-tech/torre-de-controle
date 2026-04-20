# Reconciliação de Tokens — DS Trouw v17

**Escopo:** unificar dois sistemas divergentes em uma fonte única.
**Fontes:** DS v16 (derivado de `torre-operacional-v2_85.html`) + `torre-cadastro-cliente-v7.html`.

---

## 1 · Filosofia da v17

**Princípio:** nomes do cadastro-v7 + valores + granularidade do DS v16.

Por quê: a nomenclatura do cadastro-v7 (`--bg-surface`, `--text-default`, `--border-focus`) é **DTCG W3C-compliant** e alinhada com o ecossistema moderno (shadcn, Radix, Material 3). Os valores + escala de densidade do DS v16 vêm da Torre em produção — são defensáveis.

**Dois contextos reconhecidos** — não é um DS, são dois modos do mesmo DS:
- **Mode "ops"** (Torre Operacional): densidade alta, fontes pequenas (9–12px), spacing apertado. Default quando usuário é monitor/operador.
- **Mode "form"** (Admin/Cadastro/Setup): densidade padrão, fontes 12–15px, spacing generoso. Default quando usuário preenche dados.

Implementação: tokens semânticos (`--text-default`) resolvem diferente via `[data-density="ops"]` vs `[data-density="form"]` (default). Sem duplicar CSS.

---

## 2 · Primitivos — Cores

### Neutrais

| v16 | v7 | **v17** | Valor v17 | Decisão |
|---|---|---|---|---|
| `--neutral-0` | `--gray-0` | **`--gray-0`** | `#FFFFFF` | Adota `gray-*` (Tailwind-aligned, mais reconhecível). `--neutral-*` vira alias deprecated. |
| `--neutral-50` | `--gray-50` | **`--gray-50`** | `#FAFBFC` | Valor v7 mais branco-quente — melhor p/ surfaces elevadas. |
| — | `--gray-150` | **`--gray-150`** | `#ECEEF1` | **Novo** (v7 trouxe). Gap útil entre 100 e 200 pra hover state. |
| `--neutral-100` | `--gray-100` | **`--gray-100`** | `#F4F5F7` | Valor v7. |
| `--neutral-200` | `--gray-200` | **`--gray-200`** | `#E2E5EA` | Valor v7. |
| `--neutral-300` | `--gray-300` | **`--gray-300`** | `#CBD0D9` | Valor v7. |
| `--neutral-400` | `--gray-400` | **`--gray-400`** | `#9AA2AE` | Valor v7. Proposta anterior de v15 (ver `DS-Trouw-v15-Proposta-Contraste.md`) já apontava pra cinza mais escuro por contraste. |
| `--neutral-500` | `--gray-500` | **`--gray-500`** | `#6C7480` | Valor v7. |
| `--neutral-600` | `--gray-600` | **`--gray-600`** | `#4A5160` | Valor v7. |
| `--neutral-700` | `--gray-700` | **`--gray-700`** | `#333A47` | Valor v7. |
| `--neutral-800` | `--gray-800` | **`--gray-800`** | `#1F242E` | Valor v7. |
| `--neutral-900` | `--gray-900` | **`--gray-900`** | `#10131A` | Valor v7 (mais escuro que v16 `#222a38` — melhora contraste AA). |
| `--neutral-950` | — | **`--gray-950`** | `#0B0E14` | Mantém v16 p/ dark mode deepest (v7 não tem, mas é útil). |

**Impacto:** nomes dos v16 (`--neutral-*`) viram aliases que apontam pros novos `--gray-*`. Código legado continua funcionando, sinalizado como deprecated. Em v18 remove os aliases.

### Marca (Primary)

| v16 | v7 | **v17** | Valor v17 | Decisão |
|---|---|---|---|---|
| `--info-500:#2563eb` | `--trouw-500:#2E5BFF` | **`--trouw-500`** | `#2E5BFF` | Adota **trouw-***. O `info-500` do v16 é genérico; o `trouw-500` do v7 é brand-specific e mais vibrante. Usa o `trouw` pra ação primária, mantém `info-500` separado pra feedback informativo. |
| — | `--trouw-50` | **`--trouw-50`** | `#F0F4FF` | **Novo** — soft background primário. |
| — | `--trouw-100` | **`--trouw-100`** | `#E6ECFF` | **Novo** — soft 2º nível. |
| — | `--trouw-400` | **`--trouw-400`** | `#5A7DFF` | **Novo** — primary hover em dark. |
| `--info-700` | `--trouw-600` | **`--trouw-600`** | `#1E45D9` | Valor v7. |

### Status (feedback)

| v16 | v7 | **v17** | Valor v17 | Decisão |
|---|---|---|---|---|
| `--success-500:#16a34a` | `--ok-500:#1F9E5C` | **`--ok-500`** | `#1F9E5C` | Adota `ok-*`. Nome mais curto e alinha com `feedback-ok`. Valor v7 é mais neutro (menos azul-esverdeado). |
| `--success-50` + `--success-200` | `--ok-100` | **`--ok-100`** | `#DEF3E7` | Só 1 soft na v17 — 50+200 da v16 vira granularidade desnecessária. |
| `--warning-500:#d97706` | `--warn-500:#E89A1A` | **`--warn-500`** | `#E89A1A` | Valor v7 é mais amarelo (warning "amigável"), v16 era âmbar escuro. V17 fica no v7 (melhor p/ chip). Re-auditar contraste em textos. |
| `--warning-700` | — | **`--warn-700`** | `#92400e` | Mantém v16 (usado em text quando soft é bg). |
| `--warning-50`+`200` | `--warn-100` | **`--warn-100`** | `#FCF1DD` | Valor v7. |
| `--danger-500:#dc2626` | `--danger-500:#D9342B` | **`--danger-500`** | `#D9342B` | Praticamente iguais (diferença <2%). Fica v7 por consistência. |
| `--danger-50`+`200` | `--danger-100` | **`--danger-100`** | `#FCE7E5` | Valor v7. |
| — | `--danger-600` | **`--danger-600`** | `#B82820` | **Novo** — usado em hover de destructive. |
| `--info-500` | `--info-500:#2E7DC1` | **`--info-500`** | `#2E7DC1` | Adota v7 (agora separado de `trouw-*`). Info é feedback neutro, não brand. |
| — | `--info-100` | **`--info-100`** | `#DEEBF6` | **Novo**. |

### Severidade (nova escala v7 — adotar)

v16 tinha status binário (ok/warn/danger). V7 trouxe **5 níveis de severidade** que a Torre precisa (eventos, alertas, prioridade de SM).

| v7 | **v17** | Valor | Uso |
|---|---|---|---|
| `--sev-info` | `--sev-info` | `#6C7480` | Eventos informativos (ex: "Entregou coleta"). |
| `--sev-low` | `--sev-low` | `#2E7DC1` | Atraso <30min, desvio rota <2km. |
| `--sev-med` | `--sev-med` | `#E89A1A` | Atraso 30min–1h, bateria <30%. |
| `--sev-high` | `--sev-high` | `#E85D1A` | Atraso 1h–2h, fora da rota. |
| `--sev-crit` | `--sev-crit` | `#D9342B` | Atraso >2h, emergência, parado. |

Cada um tem variante `-soft` (bg de 10–18% alpha).

**Migração:** `risk-low/medium/high/critical` do SM Card passa a usar `--sev-low/med/high/crit`. Renomear classes no CSS do SM Card.

### Cores de cliente/operação (v7 novo)

| v7 | **v17** | Uso |
|---|---|---|
| `--c-kellux:#7C3AED` | **`--c-kellux`** | Identificação visual de operação Kellux. |
| `--c-bombril:#0891B2` | **`--c-bombril`** | Bombril. |
| `--c-fenza:#65A30D` | **`--c-fenza`** | Fenza. |

**Decisão:** manter essa categoria mas renomear pra `--op-kellux`, `--op-bombril`, `--op-fenza` no v17 — "operação" é mais correto que "cliente" (cliente é quem recebe; operação é o contrato).

---

## 3 · Spacing

| v16 | v7 | **v17** | Valor | Uso |
|---|---|---|---|---|
| — | `--s-1:2px` | **`--s-1`** | `2px` | Gap entre ícones que quase tocam, tweaks finos. |
| `--space-1:4px` | — | **`--s-2h`** (meio) | `4px` | Base 4pt. v17 mantém mas renomeia pra `s-2h` (half). Alias: `--s-2h` = 4px. |
| — | `--s-2:6px` | **`--s-2`** | `6px` | Gap compacto entre elementos. |
| `--space-2:8px` | `--s-3:8px` | **`--s-3`** | `8px` | Padding interno pequeno. |
| `--space-3:12px` | `--s-4:12px` | **`--s-4`** | `12px` | Padding médio. |
| `--space-4:16px` | `--s-5:16px` | **`--s-5`** | `16px` | Padding cards, gap entre seções. |
| `--space-5:20px` | `--s-6:20px` | **`--s-6`** | `20px` | Padding containers, wizard. |
| `--space-6:24px` | `--s-8:24px` | **`--s-8`** | `24px` | Padding generoso, gap entre grupos. |
| `--space-7:28px` | — | **`--s-9`** | `28px` | Pouco usado — mantém pra SM Card detailed. |
| `--space-8:32px` | `--s-10:32px` | **`--s-10`** | `32px` | Padding página, gap entre seções grandes. |
| — | — | **`--s-12`** | `48px` | **Novo** — ainda não usado mas cobre spacing de landing/onboarding. |

**Nomenclatura v17:** `--s-N` (v7 style). Fracionários (`--s-2h` = 4px, `--s-3h` = 10px — só se necessário).

**Migração v16:** `--space-1` → `--s-2h`, `--space-2` → `--s-3`, etc. Script de search/replace resolve.

---

## 4 · Tipografia

### Escalas — os dois modos

Default da v17 é **`form`** (escala v7). Telas densas (Torre) adicionam `data-density="ops"` no `<body>` ou container.

| Nome v17 | Mode form (default) | Mode ops | v16 equivalente | v7 equivalente |
|---|---|---|---|---|
| `--fs-3xs` | — | `8px` | `--text-2xs` | — |
| `--fs-2xs` | — | `9px` | `--text-xs` | — |
| `--fs-xs` | `11px` | `10px` | `--text-sm` | `--fs-xs` |
| `--fs-sm` | `12px` | `11px` | `--text-base` | `--fs-sm` |
| `--fs-base` | `13px` | `12px` | `--text-md` | `--fs-base` |
| `--fs-md` | `14px` | `13px` | — | `--fs-md` |
| `--fs-lg` | `15px` | `14px` | `--text-lg` | `--fs-lg` |
| `--fs-xl` | `17px` | `16px` | `--text-xl` | `--fs-xl` |
| `--fs-2xl` | `20px` | `18px` | `--text-2xl` | `--fs-2xl` |
| `--fs-3xl` | `24px` | `21px` | `--text-3xl` | `--fs-3xl` |

**Implementação:**
```css
:root{ /* mode form (default) */
  --fs-xs:11px; --fs-sm:12px; --fs-base:13px; --fs-md:14px; --fs-lg:15px; --fs-xl:17px; --fs-2xl:20px; --fs-3xl:24px;
}
[data-density="ops"]{
  --fs-3xs:8px; --fs-2xs:9px; --fs-xs:10px; --fs-sm:11px; --fs-base:12px; --fs-md:13px; --fs-lg:14px; --fs-xl:16px; --fs-2xl:18px; --fs-3xl:21px;
}
```

**Migração v16:** o showcase atual tem `--text-*` tokens. Eles viram aliases em v17:
```css
:root{ --text-xs:var(--fs-2xs); --text-sm:var(--fs-xs); ... } /* deprecated, remover v18 */
```

### Famílias

| v16 | v7 | **v17** | Valor |
|---|---|---|---|
| `--font-sans` | `--font` | **`--font-sans`** | `'Plus Jakarta Sans', system-ui, sans-serif` |
| `--f-d/--f-u/--f-m` (alias) | — | **`--font-sans`** (único) | — |
| — | `--font-mono` | **`--font-mono`** | `'JetBrains Mono', ui-monospace, monospace` |

**Decisão:** v17 tem **duas famílias reais**: `--font-sans` (Plus Jakarta Sans) e `--font-mono` (JetBrains Mono) — mas **só Plus Jakarta Sans com `tabular-nums`** é usada em números na Torre (conforme memória do projeto). `--font-mono` fica disponível pra `<code>`/`<pre>` em docs, APIs, logs.

Aliases `--f-d/--f-u/--f-m` removidos na v17 (estavam todos apontando pra Plus Jakarta — eram redundantes).

---

## 5 · Border Radius

| v16 | v7 | **v17** | Valor |
|---|---|---|---|
| `--radius-sm:4px` | `--r-sm:4px` | **`--r-sm`** | `4px` |
| `--radius-md:6px` | `--r-md:6px` | **`--r-md`** | `6px` |
| `--radius-base:8px` | `--r-lg:8px` | **`--r-md+`** (ou `--r-base`) | `8px` — v17 renomeia para **`--r-base`** (default de cards). |
| `--radius-lg:10px` | — | **`--r-lg`** | `10px` — mantém, usado em surfaces importantes. |
| `--radius-xl:14px` | — | **`--r-xl`** | `14px` — modais, cards destacados. |
| `--radius-2xl:20px` | — | **`--r-2xl`** | `20px` — raro, promocional. |
| `--radius-full:9999px` | `--r-pill:999px` | **`--r-pill`** | `999px` (nome v7 mais claro). |

**Migração:** `--radius-*` → `--r-*`. Search/replace.

---

## 6 · Elevation / Shadows

| v16 | v7 | **v17** | Valor |
|---|---|---|---|
| `--elev-1` | `--sh-1` | **`--sh-1`** | `0 1px 2px rgba(15,20,30,.04), 0 1px 1px rgba(15,20,30,.03)` (v7 — mais sutil) |
| `--elev-2` | `--sh-2` | **`--sh-2`** | `0 4px 12px rgba(15,20,30,.06), 0 2px 4px rgba(15,20,30,.04)` (v7) |
| `--elev-3` | `--sh-3` | **`--sh-3`** | `0 12px 32px rgba(15,20,30,.10), 0 4px 8px rgba(15,20,30,.05)` (v7 — modal/drawer) |

**Nomenclatura v17:** `--sh-N` (shorter than `--elev-N`). Valores v7 são mais macios — melhor em light mode branco puro.

---

## 7 · Semânticos — os aliases que o produto consome

Essa é **a interface do DS**. Devs só usam esses.

### Backgrounds

| v16 | v7 | **v17** | Resolve para |
|---|---|---|---|
| `--bg` | `--bg-app` | **`--bg-app`** | `--gray-100` (canvas geral da app) |
| `--s1` | `--bg-surface` | **`--bg-surface`** | `--gray-0` (card, sidebar, modal body) |
| `--s2` | `--bg-subtle` | **`--bg-subtle`** | `--gray-50` (container de itens, hover) |
| `--s3` | `--bg-sunken` | **`--bg-sunken`** | `--gray-100` (recessed, input bg em alguns casos) |
| `--sidebar-bg` | — | **`--bg-surface`** (mesmo) | sidebar não precisa token próprio |
| `--canvas` | — | **`--bg-app`** (mesmo) | — |
| `--s4` | — | **`--bg-emphasis`** | `--gray-150` — novo estado intermediário |
| — | `--bg-hover` | **`--bg-hover`** | `--gray-100` |
| — | `--bg-active` | **`--bg-active`** | `--gray-150` |

### Texto

| v16 | v7 | **v17** | Resolve para |
|---|---|---|---|
| `--t1` | `--text-default` | **`--text-default`** | `--gray-900` |
| `--t2` | `--text-muted` | **`--text-muted`** | `--gray-500` (v16 usava `neutral-700 = #4d5666`; v7 usa `gray-500 = #6C7480` — v7 vence no contraste AA em todos backgrounds) |
| `--t3` | `--text-subtle` | **`--text-subtle`** | `--gray-400` |
| `--t4` (falhava AA, ver spec) | — | **REMOVIDO** | Ninguém precisa de cinza tão claro. Se alguém quer placeholder, usa `--text-subtle` com opacity. |
| — | `--text-inverse` | **`--text-inverse`** | `--gray-0` |
| — | `--text-brand` | **`--text-brand`** | `--trouw-600` |

**Nota crítica:** no DS v16 o `--t4` tinha contraste 1.67:1 sobre `--s1` (falha WCAG AA). A v17 resolve isso **removendo o token**. A memória `feedback_bg_hierarchy.md` e `project_v14_bruto_decisao.md` já apontavam essa dívida.

### Borders

| v16 | v7 | **v17** | Resolve para |
|---|---|---|---|
| `--border` | `--border-default` | **`--border-default`** | `--gray-200` |
| `--b2` | `--border-strong` | **`--border-strong`** | `--gray-300` |
| `--b3` | — | **`--border-strong`** (mesmo) | `--b3` era raramente usado, mergear com strong. |
| — | `--border-subtle` | **`--border-subtle`** | `--gray-150` (novo — útil em divisores internos, ex: linha de eventos do SM Card Detailed) |
| — | `--border-focus` | **`--border-focus`** | `--trouw-500` |

### Accent / Primary

| v16 | v7 | **v17** | Resolve para |
|---|---|---|---|
| `--blue` | `--primary` | **`--primary`** | `--trouw-500` |
| `--blue-s` (10%) | `--primary-soft` | **`--primary-soft`** | `--trouw-100` |
| `--blue-m` (20%) | — | **`--primary-soft-strong`** | rgba(46,91,255,.20) |
| — | `--primary-hover` | **`--primary-hover`** | `--trouw-600` |

**Outros accents (red/amber/green/cyan/purple/orange)** — v16 tinha como aliases diretos. V17 consolida em `--feedback-*`:

| v16 | **v17** | Resolve para |
|---|---|---|
| `--red` / `--red-s` | `--feedback-danger` / `--feedback-danger-soft` | `--danger-500` / `--danger-100` |
| `--amber` / `--amber-s` | `--feedback-warn` / `--feedback-warn-soft` | `--warn-500` / `--warn-100` |
| `--green` / `--green-s` | `--feedback-ok` / `--feedback-ok-soft` | `--ok-500` / `--ok-100` |
| `--cyan` | `--feedback-info` | `--info-500` |
| `--purple` | **removido** | era usado só em `ai-600`; usar `--ai-600` direto ou criar `--accent-ai` |
| `--orange` | **`--sev-high`** | orange não existia como feedback, era severidade |

---

## 8 · Tokens **novos** na v17 (não estavam em nenhum dos dois)

| Token | Valor | Uso |
|---|---|---|
| `--s-2h` | `4px` | spacing half (entre s-1 e s-2) |
| `--s-12` | `48px` | spacing largo (landing, wizard final) |
| `--gray-950` | `#0B0E14` | neutral mais escuro (dark mode deep) |
| `--bg-emphasis` | `--gray-150` | hover state intermediário |
| `--border-subtle` | `--gray-150` | divisor interno sutil (ex: sm-events divider) |
| `--primary-soft-strong` | rgba 20% primary | estados selected ativos |
| `--text-inverse` | `--gray-0` | texto sobre primary bg |

---

## 9 · Plano de execução

Ordem correta pra não quebrar o que existe:

### Passo 1 — Criar `tokens-v17.json` (DTCG)
Novo arquivo, não substitui `tokens.json` da v16. Vive paralelo.

### Passo 2 — CSS de compat em `ds-v17-primitives.css`
Adiciona todos os tokens `--gray-*`, `--trouw-*`, `--s-*`, `--fs-*`, `--r-*`, `--sh-*`, `--sev-*`, `--feedback-*`, `--bg-*`, `--text-*`, `--border-*`, `--primary*`, `--ai-600`, `--op-*`.

### Passo 3 — Aliases de retrocompatibilidade em `ds-v17-legacy-aliases.css`
```css
/* Aliases v16 → v17. Remover na v18. */
:root{
  --neutral-0:var(--gray-0); --neutral-50:var(--gray-50); /* ... */
  --s1:var(--bg-surface); --s2:var(--bg-subtle); /* ... */
  --t1:var(--text-default); --t2:var(--text-muted); --t3:var(--text-subtle);
  /* --t4 removido — sem alias */
  --space-1:4px; /* agora s-2h */
  --text-md:var(--fs-sm); /* ... */
  --radius-sm:var(--r-sm); --radius-base:var(--r-base);
  --blue:var(--primary); --red:var(--feedback-danger);
  /* ... etc */
}
```

### Passo 4 — Migrar cadastro-v7 primeiro (menor, usa todos os tokens novos)
1. Remove bloco `:root` local do cadastro-v7
2. Importa `ds-v17-primitives.css`
3. Substitui nomes divergentes (se houver)

### Passo 5 — Migrar showcase v16 em lote
Search/replace de nomes via script:
- `--neutral-` → `--gray-`
- `--space-` → `--s-`
- `--text-xs` → `--fs-2xs`, etc.
- `--radius-` → `--r-`
- `--elev-` → `--sh-`
- `--s1/s2/s3` → `--bg-surface/subtle/sunken`
- `--t1/t2/t3` → `--text-default/muted/subtle`
- `--blue/red/amber/green` → `--primary/feedback-danger/warn/ok`

### Passo 6 — Promover componentes novos do cadastro-v7
Na ordem do gap-audit da conversa anterior:
1. Form Field + Form Grid
2. Stepper
3. Accordion
4. Radio Card
5. Users Table + Role Badge
6. Perm Matrix
7. Op Card, Client Pill, Unit Input, Filial List (caso a caso)

---

## 10 · Impactos e riscos

| Risco | Mitigação |
|---|---|
| Quebrar o showcase v16 | Aliases de retrocompatibilidade (passo 3). |
| Quebrar a Torre em produção (v2_85) | v2_85 **não usa** ds-v17 ainda. Só migra quando decidirmos re-deploy da Torre. |
| Dev confuso com 2 nomenclaturas simultâneas | Deprecation warnings no CSS via comentários. Docs em spec.md. |
| `--t4` removido vai quebrar algo? | Grep no v2_85 e showcase: se aparecer, substituir por `--text-subtle` com opacity:.7 antes de deployar. |
| Mode `ops` vs `form` vai confundir? | Default é `form`. Ops só liga via `data-density="ops"` no body da Torre. Docs no showcase. |

---

## 11 · Resumo executivo (TL;DR)

1. **Nomenclatura v7 vence** — mais moderna, DTCG-compliant, alinhada com Tailwind/shadcn.
2. **Valores mistos** — v7 tem valores melhores em neutral/status, v16 tem granularidade maior em radius/spacing.
3. **Dois modos de densidade** — `form` (default, v7) e `ops` (Torre). Resolve via `data-density="ops"`.
4. **Severidade sobe ao DS** — `--sev-low/med/high/crit` vira oficial (v7 trouxe, v17 adota).
5. **`--t4` morre** — falhava AA, nunca mais.
6. **Aliases temporários** — v16 continua funcionando até v18.
7. **Ordem: reconciliar → cadastro primeiro → showcase → promover componentes novos.**
