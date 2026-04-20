# Operacional — Contexto: Modo Cabine

> Contexto específico para trabalho no `cabine.html`. O contexto base de DS/tokens está no `../CLAUDE.md`.

---

## Arquivo de trabalho

**`cabine.html`** — v86 · 9125 linhas  
Arquivo único monolítico: CSS inline no `<style>`, HTML, JS inline no `<script>`.  
É a versão mais recente e o único arquivo para editar nesta pasta.

`torre-operacional.html` — versão anterior/referência, não editar.

---

## O que é o Modo Cabine

**Modo Cabine** = tela de tratativa rápida para o operador resolver ocorrências que escalaram do sistema.  
O operador não trabalha em sequência fixa — pode ter 3+ tratativas abertas simultaneamente, navegar entre elas e deixar tratativas em holding enquanto aguarda retorno.

Métricas de ritmo visíveis: `X/23 tratadas` · `ritmo necessário: 7/min` · `seu ritmo: X/min`

---

## Produto — decisões de design definidas

### Fontes de dados e eventos mapeados

Estrutura: **fonte → eventos gerados → tratamento (auto / cabine / ignorar)**

**Telemetria / Rastreadores**
- Velocidade zero em local divergente (parada fora do local)
- Velocidade excessiva
- Frenagem / aceleração brusca
- Ignição desligada inesperadamente
- GPS offline / sinal perdido
- Temperatura do baú fora da faixa
- Umidade / impacto físico (sensor de colisão)
- Porta aberta em local não autorizado
- Combustível abaixo do limite
- Bateria do tracker crítica

**Macros do motorista (input manual via app)**
- Check-in / confirmação de coleta ou entrega
- Tentativa de entrega (não localizou destinatário)
- Registro de ocorrência manual (foto + descrição)
- Solicitação de ajuda
- Relato de problema no veículo
- Confirmação de pausa / descanso
- Atualização de posição manual

**Perfil do aplicativo (eventos automáticos)**
- Geofence entrada / saída sem entrega concluída
- Foto de entrega ou avaria capturada
- App em background / app fechado
- GPS do celular desligado
- Bateria do celular crítica
- Sem sinal de rede (app offline)
- Assinatura do destinatário coletada

**API de rota**
- ETA recalculado acima do threshold
- Desvio de rota detectado (X km fora do plano)
- KM excedente em relação ao planejado
- Congestionamento / condição de estrada
- Janela de entrega em risco

**TMS / ERP**
- SLA em risco / Error Budget consumido
- Motorista vermelho (threshold atingido)
- Destinatário vermelho (threshold atingido)
- Oportunidade de coleta identificada

**Fiscal / Documental**
- MDF-e irregularidade / rejeição
- NF-e / CT-e com problema
- CIOT pendente
- Alteração de carga exigindo novo documento

**Segurança**
- Acesso não autorizado ao veículo
- Roubo suspeito
- Bloqueio de ignição necessário

### Camada de automação (pré-Cabine)

Existe uma camada automática abaixo do Cabine. O sistema age sozinho — há muito mais opções do que as listadas aqui, tudo configurável por cliente:

**Exemplos de automático:**
- Template WhatsApp: confirmação de agenda, reentrega, solicitação de comprovante
- Solicitação de localização ao motorista
- Alerta push ao cliente em evento crítico
- Disparo de auditoria de frete automática

**Cabine (requer ação humana):**
- Evento que **já escalou**: automação tentou, não resolveu
- Evento que **vai escalar**: sistema detectou risco iminente antes de virar crítico
- Objetivo: **mínimo de trabalho manual** — só o que a automação não consegue resolver

### Gatilhos e configuração por cliente

A lógica de quais eventos entram no Cabine (e em qual ordem) é **configurada por cliente** durante a implantação, parametrizável por:
- Tipo de evento e fonte (rastreador, app, macro, rota)
- Prioridade da SM / nível de risco
- SLA de entrega do cliente
- Threshold de escalada (ex: tentativa automática falhou 2x, parada > Xmin)

**O operador não controla a ordem** — ela é determinada pelas regras configuradas.  
Supervisor e operador podem ajustar as configurações depois se algo não estiver fazendo sentido.

### Tela de configurações do Cabine vs. configurações gerais

`torre-configuracao.html` já existe — tem regras de notificação (SM parada, OTIF em risco, geo-fence, CT-e rejeitado) e regras de frete. **Não tem** a camada de regras do Cabine.

A configuração do Cabine precisa ser **separada** das configurações gerais do cliente porque:
- É a regra de negócio que define o peso e comportamento de todo o Cabine
- Tem hierarquia própria (o que é automático vs. o que escala)
- Afeta as tratativas visíveis na Torre de Controle também

**Status:** não construída ainda — é pré-requisito para evoluir o Cabine.

### Estados de uma tratativa

```
PENDENTE → ATIVA (operador abriu) → HOLDING (aguardando retorno) → RESOLVIDA
                                          ↓
                                   pode voltar pra fila se:
                                   - resolução não funcionou
                                   - novo evento foi gerado na SM
```

### Tray de holding

Tratativas em holding ficam numa **barra persistente** visível o tempo todo dentro do Cabine.  
Cada item mostra: SM ID + cliente + status ("Aguardando retorno motorista", etc.) + tempo em holding.  
O operador pode clicar em qualquer uma pra retomar sem perder o contexto das outras.

### Multi-tratativa simultânea

O operador pode ter 3+ tratativas abertas ao mesmo tempo.  
A ordem de visualização (qual está "em foco") segue o peso definido nas regras do cliente.

### Tela de configurações

Existe uma tela separada (acessível pelo supervisor e operador) para:
- Ver/editar as regras de gatilho por tipo de evento
- Definir quais eventos são automáticos vs. escalam pro Cabine
- Ajustar threshold de escalada
- Configurar as resoluções disponíveis por tipo de evento
- Configurar o contexto exibido por tipo de evento

**Status:** não construída ainda — prioridade antes de evoluir o Cabine.

---

## Como o Modo Cabine é ativado

Dois modos de ativação coexistem no arquivo:

### 1. Overlay full-screen (principal)
- Botão `.cabine-trigger` na topbar (mostra contagem `23`)
- Abre `#cabine-overlay` com `.open` via `cabineOpen()`
- Overlay é `position:fixed; inset:0; z-index:9999; backdrop-filter:blur(14px)`
- Fecha com `cabineClose()` ou `Esc`

### 2. In-place (integrado no layout)
- `data-mode="cabine"` no `.app`
- Oculta `.topbar`, mostra `.cabine-bar` (slim, 40px)
- Painel lateral `.sm-panel` troca face: `front`/`back` → `cabine-face`
- `.tray-bar` fica oculto
- `.detail-panel` expande para 320px automaticamente

---

## Estrutura do Overlay Cabine

```
#cabine-overlay
├── .cb-header          ← título + progresso (cb-progress) + ritmo (cb-rate)
├── .cb-stage
│   ├── #cb-card-host   ← card da SM atual (renderizado via JS)
│   │   ├── .cb-card-top       ← SM ID + cliente + severidade
│   │   ├── .cb-issue          ← problema + detalhe
│   │   ├── .cb-context        ← ETA, rota, motorista (3 células)
│   │   └── .cb-actions        ← 3 ações numeradas (1/2/3)
│   └── #cb-aside-host  ← painel lateral direito (renderizado via JS)
│       ├── Conectividade (sinal/GPS/ignição/bateria)
│       ├── Mapa Leaflet (#cb-map)
│       ├── Viagem (posição/restante/desvio)
│       └── Comunicação rápida (Ligar motor./dest. + WhatsApp)
├── #cb-toast           ← feedback de ação (ex: "✓ Tratativa registrada")
└── .cb-footer          ← atalhos de teclado
```

---

## Dados: QUEUE

A fila de SMs é um array `QUEUE` hardcoded no JS (prova de conceito).  
Cada item tem:

```js
{
  sm: 'SM-9845',
  geo: { origin, dest, pos },       // lat/lng
  cli: 'BOMBRIL',
  issue: 'Parado há 47min...',
  det: 'Detalhamento do problema',
  ctx: [['ETA', '+1h12'], ['ROTA', '...'], ['MOTORISTA', '...']],
  conn: { sinal, gps, ign, bat },    // cada: [status, valor, emoji]
  mapPos: { x, y, label },
  mot: { n: 'Nome', f: 'Telefone' },
  dest: { n: 'Nome', f: 'Telefone' },
  trip: [['label', 'valor'], ...],   // 3 células de viagem
  tl: [['hora', 'evento', 'severity'], ...],  // timeline
  actions: [['título', 'descrição', 'primary'|null], ...],  // 3 ações
  actMap: { actionIdx: 'mot'|'dest'|'msg'|'dest_or_msg' }  // auto-marcar ao comunicar
}
```

Atualmente: 4 itens (SM-9845 BOMBRIL, SM-9712 KELLUX, SM-9633 FENZA, SM-9588 BOMBRIL)

---

## Fluxo JS principal

```
cabineOpen()   → idx=0, done=0, start=Date.now(), render()
render()       → lê QUEUE[idx], popula cb-card-host + cb-aside-host + mapa Leaflet
cabineAct(i)   → done++, toast, setTimeout(next, 350)
cabineSkip()   → next()
next()         → idx++, render() — ou fecha se idx >= total
cabineClose()  → remove .open, remove keydown listener, destroi mapa Leaflet
```

**Atalhos de teclado:** `1/2/3` → ação | `M` → ligar motorista | `D` → ligar destino | `W` → WhatsApp | `→` → pular | `Esc` → sair

---

## Comunicação rápida — preview

`cabinePrev(t)` onde `t = 'mot' | 'dest' | 'msg'`  
Injeta um `.cb-preview` no `#cb-preview-host` (dentro do aside) com confirmação antes de "executar".

`cabineExec(t)` → toast de confirmação + marca `actMap` como feito no `doneActs`

---

## Estado atual / o que funciona

- [x] Overlay abre/fecha com animação
- [x] Navegação entre SMs (próximo, pular)
- [x] 3 ações numeradas com estado `done` / `primary`
- [x] Conectividade visual (4 chips: sinal/GPS/ignição/bateria)
- [x] Mapa Leaflet por SM (posição atual + origem + destino)
- [x] Comunicação rápida com preview de confirmação
- [x] Atalhos de teclado
- [x] Ritmo calculado (done/minutos desde abertura)
- [x] Modo in-place (`data-mode="cabine"`) com cabine-face no painel lateral

---

## Pendências / o que trabalhar

> Atualizar esta seção a cada sessão.

- [ ] Tela de configurações: regras de gatilho + automação + resoluções por evento
- [ ] Tray de holding: barra persistente com tratativas em espera + status
- [ ] Multi-tratativa: navegação entre tratativas ativas simultaneamente
- [ ] Estados da tratativa: fluxo PENDENTE → ATIVA → HOLDING → RESOLVIDA (+ volta pra fila)
- [ ] QUEUE atual é hardcoded — preparar estrutura pra dados configurados por cliente

---

## Classes CSS chave do Cabine

```
.cabine-trigger       botão de entrada (topbar)
.cabine-bar           barra slim do modo in-place
.cabine-overlay       overlay full-screen
.cb-header / .cb-stage / .cb-footer
.cb-card-host / .cb-aside-host
.cb-action (+ .primary / .done)
.cb-qbtn (+ .call / .msg)
.cb-preview / .cb-prev-confirm / .cb-prev-cancel
.cb-conn-chip (+ .ok / .warn / .bad)
.panel-face.cabine-face   face do painel no modo in-place
.cabine-footer            rodapé fixo do modo in-place
```
