# Torre de Controle — Contexto base

**Produto:** Torre de Controle Logístico (TCM) · Trouw Tecnologia  
**Status:** Produto novo, do zero. Não herda código/UI do legado.  
**Stack:** HTML + CSS custom properties + JS vanilla. Zero frameworks.  
**DS:** Trouw DS v13 → v16 (transição em andamento, cabine.html usa v16+).

---

## Design System — tokens obrigatórios

Zero hardcode hex. Sempre `var(--token)`.

```css
/* Surfaces */
--bg: #EEF1F8          /* app background */
--s1: #ffffff          /* card / surface */
--s2: #f8f9fb          /* container cinza */
--s3: #f1f3f7          /* borda interna */
--canvas: #f8f9fb

/* Text */
--t1: #0D0F12   --t2: #6B7280   --t3: #9CA3AF   --t4: disabled

/* Borders */
--border / --b2 / --b3  (du --neutral-200/300/400)

/* Semântico */
--green / --green-s    --amber / --amber-s    --red / --red-s    --blue / --blue-s

/* Elevação */
--elev-1 (card)   --elev-2 (dropdown)   --elev-3 (modal)

/* Border-radius */
--radius-sm(4) --radius-md(6) --radius-base(8) --radius-lg(10) --radius-xl(14) --radius-full(9999)

/* Tipografia */
--f-u (Plus Jakarta Sans)   --f-m (monospace — tabular-nums para IDs/timestamps)
--text-2xs(8) --text-xs(9) --text-sm(10) --text-base(11) --text-md(12) --text-lg(14) --text-xl(16)
```

---

## Terminologia de domínio

| Termo | Significado |
|---|---|
| SM | Serviço de Manifesto |
| Farol | Indicador visual consolidado (verde/amarelo/vermelho) |
| Taxa de Reversão | % de ocorrências revertidas em entrega |
| Motorista Vermelho | Motorista com X% devolução/atraso acima do threshold |
| Destinatário Vermelho | Destinatário com X% devolução/atraso acima do threshold |
| DT/ST/CD/PM | Tipos de veículo: Dedicado/Subcontratado/Centro Dist./Programado |
| OTIF | On Time In Full |

---

## Regras de desenvolvimento

1. Zero hardcode de cores — sempre `var(--token)`
2. Componentes novos: seguir padrão do componente mais similar existente
3. Dark mode: testar sempre com `[data-theme="dark"]`
4. Colorblind: testar com `html.cb-mode`
5. Desktop-first, min-width 1280px
6. WCAG 2.2 AA mínimo

---

## Estrutura de pastas relevante

```
Torre de Controle/
├── CLAUDE.md              ← este arquivo (contexto base compartilhado)
├── Operacional/
│   ├── CLAUDE.md          ← contexto específico: Modo Cabine + Torre Operacional
│   ├── cabine.html        ← arquivo de trabalho principal (v86)
│   └── torre-operacional.html
├── Cadastro/              ← cadastro de motoristas/veículos/destinatários
├── DS/                    ← design system tokens
└── Docs/                  ← contexto legado (CONTEXTO-CLAUDE-CODE.md, specs)
```
