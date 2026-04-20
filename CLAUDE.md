# Torre de Controle — Contexto base

**Produto:** Torre de Controle Logístico (TCM) · Trouw Tecnologia  
**Status:** Produto novo, do zero. Não herda código/UI do legado.  
**Stack:** HTML + CSS custom properties + JS vanilla. Zero frameworks.  
**DS:** Trouw DS v16 (tokens DTCG, Plus Jakarta Sans).

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

## Estrutura de pastas

```
Produtos/                        ← raiz do projeto (git: trouw-tech/torre-de-controle)
├── index.html                   ← hub de navegação entre módulos
├── data/
│   ├── tcm-data.js              ← fila de 40 SMs + 11 tipos de evento (fonte única)
│   └── tcm-state.js             ← estado compartilhado via localStorage
├── Operacional/
│   ├── torre-operacional.html   ← Torre Operacional (monitor de SMs)
│   ├── cabine-v2.html           ← Modo Tratativa (fila de ocorrências)
│   └── cabine-config.html       ← Configuração de Tratativa
├── Gerencial/
│   └── torre-gerencial.html     ← Visão Gerencial (KPIs, OTIF, transportadoras)
├── Frota/
│   ├── torre-frota.html         ← Gestão de Frota
│   └── Spec.md                  ← especificação do módulo
├── Comunicacao/
│   └── torre-comunicacao.html
├── DS/                          ← Design System Trouw v16
└── _Historico/                  ← versões anteriores e arquivos legados
```
