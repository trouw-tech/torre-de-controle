# Trouw Design System v16 — Especificação

**Derivado de:** `torre-operacional-v2_85.html`
**Versão:** 16.0.0 · **Data:** 2026-04-14
**Autor:** Renato Matos — Lead UX · **Stack-alvo:** HTML/CSS tokens, pipeline DTCG → Style Dictionary

---

## 1 · Filosofia

> Regras de ouro, herdadas do header do v2_85:

1. **Cores via token, nunca hex.** Use `var(--red)`, `var(--green)`, `var(--blue-s)`. Hardcode só é permitido em sombras especiais (glow, ring) com comentário.
2. **Hierarquia de background:** containers usam `--s2` (cinza), itens dentro usam `--s1` (branco). **Nunca cinza sobre cinza.**
3. **Hierarquia de texto:** `--t1` título → `--t2` corpo → `--t3` sutil → `--t4` disabled.
4. **Radius sempre via `--radius-*`.** Chips/badges: `sm` ou `md`; cards/dropdowns/modais: `base` ou `lg`; pills: `full`.
5. **Elevação em 3 níveis.** Cards `--elev-1`, dropdowns `--elev-2`, modais `--elev-3`.
6. **Status = 4 estados.** `ok` / `warn` / `danger` / `info`, aplicados via classe no filho. Bg = token `-s`; border = rgba .25; fg = cor full.
7. **Dark mode muda apenas semantic.** Primitivos neutral são reescritos; componentes usam `!important` para garantir cascata.
8. **Acessibilidade cobre paleta Wong via `html.cb-mode`.** Toda cor nova precisa ter um override equivalente.

---

## 2 · Foundations

### 2.1 Cores

#### Primitivos (single source of truth)

| Token | Valor | Uso |
|---|---|---|
| `--neutral-0` | `#ffffff` | S1 / texto inverso |
| `--neutral-50` | `#f8f9fb` | S2 / canvas |
| `--neutral-100` | `#f1f3f7` | S3 / hover |
| `--neutral-200` | `#e8ecf2` | Border default |
| `--neutral-300` | `#dde2ea` | Border strong |
| `--neutral-400` | `#c4ccd8` | Border stronger / T4 |
| `--neutral-500` | `#9aa3b0` | T3 |
| `--neutral-700` | `#4d5666` | T2 |
| `--neutral-900` | `#222a38` | T1 / Toast bg |
| `--neutral-950` | `#141924` | (reservado — dark canvas) |
| `--success-500` | `#16a34a` | Green / ok |
| `--warning-500` | `#d97706` | Amber / warn |
| `--danger-500` | `#dc2626` | Red / danger |
| `--info-500` | `#2563eb` | Blue / info / primary |
| `--ai-600` | `#7c3aed` | Purple / AI features |
| `--orange` | `#ff6b00` | Risco médio (entre amber e red) |
| `--cyan` | `#0284c7` | RE04 (logística) / dev chip |

#### Aliases semânticos (consumir em componentes)

**Surfaces**
- `--bg` `#EEF1F8` — body global
- `--canvas` = neutral-50 — áreas operacionais (topbar, detail panel)
- `--s1` = neutral-0 — cards, itens internos (nunca sobre s1 puro)
- `--s2` = neutral-50 — containers que agrupam s1
- `--s3` = neutral-100 — hover, nested
- `--s4` `#DDE2F0` — reservado para contraste mais alto
- `--sidebar-bg` `#EAECF0` — só sidebar

**Borders:** `--border` (default) · `--b2` (strong) · `--b3` (stronger, foco)

**Texto:** `--t1` (primary) · `--t2` (body) · `--t3` (muted) · `--t4` (disabled) · texto inverso usa `--neutral-0`

**Accent (com variantes tinted):**
- `--blue` + `--blue-s` (10% alpha) + `--blue-m` (20% alpha)
- `--red` + `--red-s`
- `--amber` + `--amber-s`
- `--green` + `--green-s`
- `--cyan` + `--cyan-s`
- `--purple` + `--purple-s`
- `--orange` + `--orange-s`

**Device strip (dessaturado):** `--ds-ok #6CA98A` · `--ds-warn #C9A36B` · `--ds-crit #C77B7B`
> Propósito: chips de diagnóstico em cards compactos não devem competir visualmente com KPIs ou status principais.

### 2.2 Tipografia

- **Família única:** `Plus Jakarta Sans` (pesos 300, 400, 500, 600, 700, 800)
- **Aliases:** `--f-d` (display), `--f-u` (UI), `--f-m` (mono-like) — **todos apontam para a mesma fonte**; `--f-m` ativa `tabular-nums` automaticamente via seletor global.
- **Escala:** 8 (2xs) · 9 (xs) · 10 (sm) · 11 (base) · 12 (md) · 14 (lg) · 16 (xl) · 18 (2xl) · 21 (3xl)

**Regra de densidade:** a base real da UI é 11–12px. Texto em 14–21px só em títulos de modal, `kpi-val`, `client-name` em cards detailed.

**Tabular nums:** obrigatório em ID de SM (`sm-id`), placa, scores, tempos, contadores, timestamps. Sem isso, números pulam na grade.

### 2.3 Spacing

Grid 4pt, consumir sempre via múltiplos inteiros de 4. No v85 os espaçamentos estão em px direto nos componentes (legado); para componentes **novos**, respeitar a escala:

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | 4px | Gap entre chips, divisores |
| `--space-2` | 8px | Padding interno de chip, gap de stack |
| `--space-3` | 12px | Padding de card compacto |
| `--space-4` | 16px | Padding de card padrão, gap de seção |
| `--space-5` | 20px | Padding de modal |
| `--space-6` | 24px | Padding top/bottom de modal |

### 2.4 Radius

| Token | Valor | Aplicação |
|---|---|---|
| `--radius-sm` | 4px | Chips pequenos, dots, status pills |
| `--radius-md` | 6px | Chips filter, botões, search |
| `--radius-base` | 8px | Cards, dropdowns, seções |
| `--radius-lg` | 10px | Toast, containers grandes, nav-item |
| `--radius-xl` | 14px | Modais |
| `--radius-2xl` | 20px | Cards hero (não usado ainda) |
| `--radius-full` | 9999px | Pills, avatares, dots |

### 2.5 Elevação

```css
--elev-1: 0 1px 2px rgba(20,25,36,.05);                                /* Cards */
--elev-2: 0 1px 3px rgba(20,25,36,.07), 0 2px 8px rgba(20,25,36,.05);  /* Dropdowns */
--elev-3: 0 4px 12px rgba(20,25,36,.10), 0 2px 4px rgba(20,25,36,.06); /* Modais */
```

Sombras especiais (glow de KPI ativo, ring de foco, shadow de marker selecionado) são hardcoded por decisão — cada uma com comentário explicando o motivo.

### 2.6 Layout

| Token | Valor |
|---|---|
| `--sidebar-w` | 56px (collapsed) → 200px (expanded) |
| `--panel-w` | 320px (SM panel, detail panel, chat panel) |
| Topbar height | 86px |
| Sticky footer | 36px |

Grid da `.main`: `columns: var(--panel-w) 1fr` · `rows: 86px 1fr`

---

## 3 · Temas

### 3.1 Light (default)

Tokens semânticos têm valores claros por default em `:root`.

### 3.2 Dark — `[data-theme="dark"]`

Redefine **todos** os aliases + primitivos neutral. Componentes usam `!important` na cascata dark. Bordas migram para `rgba(255,255,255,.07–.17)` em vez de cinzas sólidos.

**Paleta dark principal:**
- `bg: #060A12` · `s1: #0C1422` · `s2: #111A2E` · `s3: #182038` · `s4: #1E2A45`
- `t1: #E8EDF8` · `t2: #8A9ABE` · `t3: #4E5F88` · `t4: #2E3D60`
- `blue: #3D72FF` · `red: #FF2D55` · `amber: #FF9F0A` · `green: #30D158` · `purple: #BF5AF2` · `cyan: #00C7FF`

### 3.3 Colorblind — `html.cb-mode`

Paleta **Wong 2011** (deuteranopia/protanopia safe):

| Semântica | Valor |
|---|---|
| Danger (red → vermillion) | `#D55E00` |
| Warning (amber → orange) | `#E69F00` |
| Success (green → bluish-green) | `#009E73` |
| Info (blue) | `#0072B2` |
| AI (purple → reddish-purple) | `#CC79A7` |
| Cyan (sky blue) | `#56B4E9` |

Combinável com dark: `html.cb-mode[data-theme="dark"]` tem paleta específica (mais saturada para compensar).

**Regra de ouro:** toda cor nova que entrar no DS precisa ter override em `html.cb-mode`.

---

## 4 · Componentes

### 4.1 Sidebar & Navigation

**Propósito:** navegação principal, collapsible. Default 56px (só ícones), 200px quando `.expanded`.

**Anatomia:**
- `.sidebar-logo` — logo Trouw
- `.sidebar-toggle` — handle de expandir (só visível quando expanded)
- `.nav-section-label` — label uppercase entre grupos (só visível expanded)
- `.nav-group` / `.nav-group-header` — grupo colapsável de subitens
- `.nav-item` + `.nav-sub-item` — item de navegação
- `.nav-badge` — dot de notificação (7x7px, red)

**Estados:**
- `:hover` — bg `--s2`, color `--t2`
- `.active` — bg `--blue-s`, color `--blue`, barra lateral azul 2px à esquerda
- `.collapsed` (em nav-group) — chevron rotacionado -90°

**A11y:**
- Foco visível obrigatório (2px outline em `--blue`)
- Target 24×24 mínimo (atual: 38×38 — ok)
- `aria-expanded` em nav-group-header; `aria-current="page"` no item ativo
- Badge tem `aria-label` descritivo

### 4.2 Topbar + KPI Strip

**Propósito:** métricas-chave sempre visíveis no topo + ações globais.

**Anatomia:**
- `.ops-summary` — slot esquerdo (Saúde / Tratativas / Operadores), largura alinhada ao SM panel
- `.kpi-strips-wrap` — wrapper rolável horizontalmente
- `.kpi-strip` — linha de KPIs
- `.kpi-group` — grupo temático (Volume, Risco); com `.kpi-group-label` e `.kpi-group-divider`
- `.kpi` — card KPI individual (`.kpi-val`, `.kpi-lbl`, `.kpi-delta`)
- `.topbar-actions` — chips quadrados à direita (kpi-edit, theme-toggle, etc.)

**Variantes de KPI:** `.ok` · `.warn` · `.danger` · `.neutral`

**Visual rework (v85):**
- Cada KPI tem `linear-gradient` suave (branco → tint da variante)
- Barra de accent à esquerda (3px) em `currentColor` do tipo
- Hover: tint mais forte (translateY -1px no active)
- Active state (filtro ligado): `box-shadow: 0 0 0 2px var(--tipo), 0 4px 14px rgba(tipo,.25)`

**A11y:**
- Cada KPI é `<button>` com `aria-pressed` refletindo o estado active
- Foco visível (outline azul no `:focus-visible`)
- Delta com `<span aria-label="variação +2.5%">` acompanhando cor+ícone+texto

### 4.3 SM Panel (Side Panel) & Filtros

**Propósito:** lista de SMs (Solicitações de Movimentação) com filtros rápidos/avançados. 320px, 3D flippable entre face de lista e face de filtros.

**Anatomia:**
- `.panel-head` — título + controls (preset, saved views)
- `.search-row` / `.search-box` — search com ícone + clear
- `.active-filters` / `.af-chip` — chips removíveis dos filtros ativos
- `.filter-line` / `.filter-row` — linha de dimensional filters (triggers)
- `.pf-body` — back face: painel de filtros completo com `.pf-section`, `.pf-chips`, `.pf-input`
- `.pf-footer` / `.pf-cta` — botão primário com contador

**Estados de `.af-chip`:**
- Default: bg azul-s, border azul, fg azul
- `.af-chip-remove` com `:hover` background azul-m

**A11y:**
- `role="region"` + `aria-label="Filtros ativos"`
- Chip removível é `<button>` com `aria-label="Remover filtro {nome}"`
- Search input com `aria-label="Buscar SMs"` + `type="search"`
- Panel flip: gerir `aria-hidden` + `inert` nas faces ocultas

### 4.4 SM Card (componente central)

**Propósito:** representar uma Solicitação de Movimentação. **3 presets de densidade** trocáveis:

| Preset | Altura | Conteúdo |
|---|---|---|
| `preset-compact` | ~62px | r1 apenas (ID, OP, status text, device strip, risco) |
| `preset-standard` | ~92px | r1 + route-zone com progress |
| `preset-detailed` | ~128px | r1 + route-zone + r3 (driver, alerts, eta-anchor) |

**Anatomia:**
- `.card-upper` — header com `.card-h-row` (ID, OP, status, cliente, risk)
- `.route-zone` — linha de rota + progress bar (1px bottom)
- `.card-lower` — driver + alerts + ETA (só detailed)
- `.card-compact-foot` — foot simples (compact/detailed alternativo)
- `.device-strip` — 4 chips ok/warn/crit, paleta dessaturada

**Indicador de risco (barra lateral esquerda `::before`):**
- `.risk-critical` → 5px vermelho + glow 14px
- `.risk-high` → 4px amber + glow 8px
- `.risk-medium` → 3px orange
- `.risk-low` → 3px green, opacity .7

**Estados:**
- `:hover` — border `--b2`, bg `--s2`, `translateX(2px)`
- `.selected` — border azul, bg `--info-50`, box-shadow ring azul 2px

**A11y:**
- Card é `<article>` com `role="button"` e `tabindex="0"` (clicável para abrir drawer)
- `aria-selected="true"` quando `.selected`
- `aria-label` completo: "SM {id}, cliente {nome}, status {status}, risco {nível}"
- Device strip usa `<abbr title>` ou tooltip para expandir siglas

### 4.5 Chips

**Sistema único de chips — não criar novos.** Todos compartilham padrão: 22–24px altura, padding-x 8px, radius `full`, border 1px, font semibold 10px.

| Classe | Uso | Estado active |
|---|---|---|
| `.chip` | Genérico | bg blue-s, border+fg blue |
| `.pf-chip` | Filtro em pf-section (filter panel back face) | mesmo padrão |
| `.af-chip` | Filtro aplicado, removível | azul tinted + botão X |
| `.op-chip` | Operador (OP001, OP042) — font-family `--f-m` | — |
| `.cms-chip` | Chat mode strip | mesmo padrão |
| `.eta-q-chip` | Filtro rápido de ETA | `.active-atrasado` (red tint) / `.active-no_limite` (amber tint) |
| `.status-chip` | Status da viagem | s-em-rota (green), s-parado (red), s-aguardando (amber) |

**Status-chip — receita visual padrão:**
- `bg: var(--{color}-s)` (10% alpha)
- `border: 1px solid rgba({color-rgb}, 0.25)`
- `color: var(--{color})`
- Ícone opcional à esquerda, `sc-duration` em `--f-m` à direita

### 4.6 Badges & Numerais

- `.risk-num` — número de risco 17px bold, cor por variante (critical/high/medium/low)
- `.risk-inline` — versão inline com ícone + número, cor via `:has()`
- `.meta-lbl` — label uppercase 7px (label de meta-block)
- `.pod-nf-count` / `.afp-sm` / `.mab-alert-item .sm-ref` — badge pequeno com ID monospace

### 4.7 Botões

**Sistema de botões do v85 é fragmentado por contexto** (não há `.btn` genérico). Para novo componente, escolher o mais próximo:

| Classe | Variante | Altura | Aplicação |
|---|---|---|---|
| `.pf-cta` | Primary, contextual | 34px | CTA de panel de filtro ("Aplicar 12 filtros") |
| `.am-confirm` | Primary, modal | 36px | Confirmação em modais |
| `.am-confirm.danger` | Destructive | 36px | Ações destrutivas |
| `.am-cancel` | Secondary | 36px | Cancelar em modais |
| `.am-btn` | Base | 36px | Variantes sobre esta base |
| `.afp-act` | Ghost, small | 22px | Quick action em alerta |
| `.afp-act.primary` | Ghost tinted azul | 22px | Quick action primária |
| `.afp-act.success` | Ghost tinted green | 22px | Quick action confirmar |
| `.sp-btn` | Ghost, small | 24px | Ações em popup de stop |
| `.sp-btn.primary/warn/danger` | Ghost tinted | 24px | Variantes |
| `.kpi-edit-btn` | Icon, square | 34×34 | Chip de ação na topbar |
| `.preset-btn` | Toggle text+icon | 30px | Seletor de preset |
| `.tl-seg-btn` | Segmented tab | 22px | Segmented control |
| `.view-seg-btn` | Segmented icon | 24×26 | View toggle (compact/detailed/timeline) |

**Recomendação para próxima versão (v17):** consolidar em 4 variantes: `primary` · `secondary` · `ghost` · `destructive` com 3 tamanhos (sm/md/lg) — a proliferação atual é dívida.

**Estados universais:**
- `:hover` — bg mais forte da mesma família
- `:disabled` — bg `--s3`, fg `--t3`, opacity .7, `cursor:not-allowed`
- `:focus-visible` — outline 2px blue (implementar globalmente)

### 4.8 Modal (Action Modal)

**Propósito:** confirmação e ações destrutivas.

**Anatomia:**
- `.action-modal-overlay` — overlay com `rgba(6,10,18,.55)` + `backdrop-filter: blur(6px)`
- `.action-modal` — container centralizado, 380px max-width, radius `xl`, padding 24px
- `.am-icon` (32px emoji/icon) → `.am-title` (16px bold) → `.am-desc` (12px muted) → `.am-actions` (flex gap 8px)

**Variante `.danger`:** border muda para red com alpha .4

**A11y:**
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apontando para `.am-title` + `aria-describedby` para `.am-desc`
- Foco inicial em `.am-cancel` (o não-destrutivo)
- Fechar com Esc; click fora da action-modal = cancel
- Trap de foco dentro do modal

### 4.9 Toast

**Propósito:** feedback efêmero de ação.

**Anatomia:** pílula fixa bottom center, bg `--t1` (neutral-900), fg inverse, radius `lg`, padding 12×20, sombra alta.

**Estados:** entrada `translateY(20px) + opacity:0` → `.visible` anima para center.

**A11y:**
- `role="status"` + `aria-live="polite"` para mensagens confirmatórias
- `role="alert"` + `aria-live="assertive"` apenas para erros
- Duração mínima 5s (6–8s recomendado); mais em textos longos (WCAG 2.2 §2.2.3)
- Pausável ao hover (desejável)

### 4.10 Alert Banner (Ticker)

**Propósito:** banda superior do mapa com alertas rolantes (tipo news ticker).

**Anatomia:**
- `.map-alert-bar` — barra 34px, bg `rgba(255,45,85,.14)` + blur
- `.mab-icon` — selo pink "ALERTAS" + ícone, com divisor à direita
- `.mab-ticker-inner` — conteúdo animado (animation ticker 22s linear infinite)
- `.mab-alert-item` — item individual com `.sm-ref` (chip rosa com ID)
- `.mab-more` — botão "Ver todos" à direita, abre `.alert-full-panel`

**Painel expansível `.alert-full-panel`:**
- `.afp-item` — item com `.afp-sev` (barra lateral colorida), título, sub, chip ID
- `.afp-actions` com `.afp-act` para ações rápidas

**A11y:**
- `.mab-ticker-inner:hover { animation-play-state: paused }` para permitir leitura
- Botão `.mab-more` com `aria-expanded` refletindo estado do painel
- `prefers-reduced-motion: reduce` deve desligar animação do ticker e mostrar os itens em lista estática

### 4.11 Farol (Status Indicator)

**Propósito:** indicador rico de status de uma dimensão (SM: Segurança, Clima, Rota, Tempo).

**Anatomia:**
- `.farol-row` — grid 4 colunas
- `.farol-item` — card com ícone, label uppercase e status colorido
- Variantes: `.farol-ok` · `.farol-warn` · `.farol-danger` (bg e border casam com a paleta success/warning/danger tinted)

**A11y:**
- Cada farol é `<div role="status">` com label acessível descrevendo dimensão + estado
- Cor + ícone + texto — nunca confiar só em cor

### 4.12 POD / Documents

**Propósito:** listar comprovantes de entrega com hierarquia por destino.

**Anatomia:**
- `.pod-list` / `.pod-item` — lista flat simples
- `.pod-dest` — variante hierárquica com header colapsável (`.pod-dest-hdr`, `.pod-dest-icon`, `.pod-dest-info`, `.pod-dest-badges`)
- Status pills: `.pod-ok` (green-s) · `.pod-pend` (amber-s) · `.pod-miss` (red-s)

### 4.13 Map Markers

**Propósito:** marcar entidades no mapa Leaflet com formas geométricas claras (não ícones de pino).

| Classe | Forma | Uso |
|---|---|---|
| `.gm-wrap` + `.gm-body` | Círculo 34px com cor `--mc` (dinâmica) | Veículo SM — tem `.selected` e `.pulse` (rings animados) |
| `.sm-origin` | Quadrado 22×22, radius sm | Origem da rota |
| `.sm-delivery` | Círculo 22×22 com letra | Entrega (letra = sequência) |
| `.sm-checkpoint` | Diamante 14×14 (rotated 45°) | Ponto de passagem |
| `.sm-destination` | Círculo 22×22 + ícone, purple | Destino final |
| `.sm-problem` | Diamante vermelho 22×22 | Ocorrência |
| `.sm-current` | Círculo 32×32 com 2 rings pulsantes | Posição atual |

**A11y:**
- Leaflet não é keyboard-friendly por default; implementar navegação por lista alternativa (`role="list"` em `aside`)
- `prefers-reduced-motion: reduce` → desligar `ring-out`/`ring-out2` animations

### 4.14 Stop Popup (Leaflet override)

**Propósito:** popup customizado sobre marker de stop.

**Anatomia:**
- `.leaflet-popup-content-wrapper` override — bg branco .98, radius lg, shadow alto
- `.sp-header` — ícone + nome + status-pill (done/current/pending/problem)
- `.sp-meta` — lista de metadata com `.mkey` fixed-width
- `.sp-issues` — issues danger/warn com ícone
- `.sp-actions` — `.sp-btn` variantes (primary/warn/danger)

### 4.15 Segmented Controls

**Duas implementações** — consolidar no v17:

**A. Timeline filter `.tl-seg`**
- bg `--s3`, padding 2, border `--border`, radius `md`
- `.tl-seg-btn.active` → bg `--s1`, fg `--t1`, shadow 1px

**B. View toggle `.view-seg`** (3 ícones: compact/detailed/timeline)
- bg `--s3`, padding 2, border `--border`
- `.view-seg-btn` 26×24 square
- `.active` → bg `--s1`, color `--blue`, shadow + 1px ring
- `.disabled-soft` (timeline WIP) → opacity .55, `cursor: not-allowed`

**A11y:** `role="tablist"` no container; cada button é `role="tab"` com `aria-selected`. Setas ← → navegam; Enter/Space ativa.

### 4.16 Dropdown / Menu

**Padrões:**
- `.kpi-dropdown` (checkbox list para editar KPIs visíveis)
- `.view-dropdown` (lista de opções com ícone + título + sub)
- `.saved-views-menu` (menu de views salvas + ação "Salvar atual")
- `.preset-menu` (3 opções de densidade)

**Receita comum:**
- Position absolute bottom, radius `base`, padding 5, box-shadow forte
- Open state: `opacity:1` + `translateY(0)`
- Item hover: bg `--s2`
- Item active: bg `--blue-s`, texto azul

**A11y:**
- `role="menu"` no container; items com `role="menuitem"`
- Setas ↑↓ navegam, Esc fecha, foco volta ao trigger
- `aria-expanded` no trigger

### 4.17 Detail Panel (Drawer)

**Propósito:** painel lateral direito com detalhes da SM selecionada.

**Anatomia:**
- `.detail-panel` — 0 width → 320px quando `.open`, transition 280ms cubic-bezier
- `.detail-inner` — canvas com blur(20px), border-left

**A11y:**
- `role="complementary"` + `aria-label="Detalhes da SM"`
- Quando aberto, foco move pro título; Esc fecha
- Não trapear foco (drawer convive com mapa)

### 4.18 Chat Panel

**Propósito:** painel de chat integrado com a operação.

**Anatomia:** `.chat-panel` (320px, direita, entre map e detail), `.chat-mode-strip` (barra horizontal superior no modo chat-open — esconde SM panel).

**Interaction:** `.app[data-chat="open"]` → grid muda (`0 1fr`), SM panel some, chat + detail ficam lado a lado.

---

## 5 · Padrões & Guidelines

### 5.1 Background hierarchy — a regra sagrada

**Blocos container = `--s2` (cinza claro). Itens internos = `--s1` (branco). Nunca cinza sobre cinza.**

Exemplos no v85:
- `.route-zone` usa `--s2` como divisor interno do card → card (`--s1`) mantém hierarquia
- `.pod-item` usa `--s2` sobre canvas (`--s1`) no drawer
- `.pf-chip` usa `--s1` sobre `.pf-section` (implícito em `--canvas`)

### 5.2 Status = 4 estados, sempre

**ok / warn / danger / info.** Aplicar via classe no filho: `.kpi.warn`, `.status-chip.s-parado`, `.farol-item.farol-danger`. Cada um tem:
- bg = token `-s` (10% alpha)
- border = rgba do mesmo tom, 25% alpha
- fg = cor full (`--green`, `--amber`, etc)

### 5.3 Density presets

`.preset-compact` (62px) · `.preset-standard` (92px) · `.preset-detailed` (128px) — troca de densidade **não altera dados**, só o que é mostrado. Armazenar preferência em localStorage por usuário.

### 5.4 Animation & motion

- Durações canônicas: **150ms** (hover/fast), **220ms** (slide/panel), **280ms** (drawer/chat)
- Easing padrão: `cubic-bezier(0.4, 0, 0.2, 1)` (standard)
- Ring-out (pulse) só em markers ativos; respeitar `prefers-reduced-motion`

### 5.5 Tabular numerals

Qualquer texto com números (IDs, placas, scores, tempos) → usar `font-family: var(--f-m)`. O DS aplica `font-variant-numeric: tabular-nums` globalmente via seletor.

---

## 6 · Acessibilidade — mínimos não-negociáveis

Alinhados a WCAG 2.2 AA (vigente EAA desde 06/2025):

| Critério | Regra |
|---|---|
| Contraste texto | 4.5:1 (AA normal) / 3:1 (AA large) |
| Contraste UI | 3:1 (bordas, ícones, estados) |
| Foco visível | 2px outline mínimo, contraste adequado, **sempre presente** |
| Área de toque | 24×24 mínimo (2.5.8 WCAG 2.2) — meta 44×44 |
| Drag-only | **Nunca** — toda interação drag tem alternativa (2.5.7) |
| Navegação teclado | Tab order lógico; trap só em modal |
| `prefers-reduced-motion` | Obrigatório em ticker, rings de marker, slide transitions |
| ARIA | Semântica HTML primeiro; ARIA só quando não há tag nativa |
| Cor | Nunca transmitir estado só por cor — sempre ícone + texto + cor |
| Colorblind | Paleta Wong via `html.cb-mode`; toggle acessível na sidebar |

### Pontos de atenção no v85 atual

- [ ] **Contraste de `--t4` (#c4ccd8) sobre `--s1` (#fff)** = 1.67:1 → **falha AA**. Aceitável só para disabled; **nunca** para texto informativo. Memória do projeto já marca isso como proposta DS v15.
- [ ] **Contraste de `.upd-time` (8px `--t3`)** = borderline; idealmente subir para 9px ou para `--t2`.
- [ ] **Leaflet popup não é navegável por teclado** — implementar fallback via lista de stops no drawer.
- [ ] **Ticker de alerta** precisa de toggle de pausa visível (pause-on-hover não é suficiente).

---

## 7 · Governança

### 7.1 Versionamento

SemVer. Breaking change = bump major.
Mudar **token primitivo** = major. Mudar **semantic** que componentes consomem = minor com aviso. Adicionar novo token = patch.

### 7.2 Regras de contribuição

- Todo token novo precisa entrar na 3 camadas (primitive → semantic → componente opcional)
- Toda cor nova precisa de override em `[data-theme="dark"]` e `html.cb-mode`
- Todo componente novo precisa documentar: propósito, anatomia, variantes, estados, a11y, do/don't

### 7.3 Dívidas conhecidas (para v17)

1. **Consolidar botões** em 4 variantes × 3 tamanhos (hoje são 13 classes distintas)
2. **Explicitar tokens de spacing** — hoje quase tudo em px hardcoded
3. **Migrar `!important` do dark mode** para uso de `data-theme` em `:root` com cascata natural
4. **Criar Empty State pattern** — ausente no inventário
5. **Criar Pagination** — ausente no inventário
6. **Criar Command Palette** — ausente, mas encaixaria no fluxo de Saved Views

---

## 8 · Referências

- `torre-operacional-v2_85.html` — fonte canônica
- `tokens.json` (DTCG W3C 1.0) — exportável para Style Dictionary
- `trouw-ds-showcase-v16.html` — showcase visual dos componentes
- Pipeline recomendado: Tokens Studio → Style Dictionary → CSS vars + Storybook
