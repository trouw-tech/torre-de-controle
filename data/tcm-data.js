/**
 * TCM — Torre de Controle · Dados Compartilhados
 * Fonte única de verdade: fila de SMs + tipos de evento + metadados
 *
 * Carregue ANTES de qualquer script de módulo:
 *   <script src="../data/tcm-data.js"></script>
 *
 * Expõe: window.TCM.queue, window.TCM.SORTED, window.TCM.SEV,
 *         window.TCM.clientes, window.TCM.tiposEvento
 */
(function () {
  'use strict';

  // ── Listas de referência ─────────────────────────────────────────────────
  const CLI = [
    'BOMBRIL','KELLUX','FENZA','NESTLÉ','AMBEV','UNILEVER',
    'JBS','RAIA','BAYER','BASF','SUZANO','GERDAU',
    'EMBRAER','VALE','BRASKEM'
  ];

  const RTS = [
    'SP→Salvador','Campinas→RJ','Sorocaba→Santos','SP→Curitiba',
    'SP→BH','SP→Fortaleza','SP→POA','Guarulhos→Santos',
    'SP→Recife','Uberlândia→SP','Goiânia→SP','SP→Brasília',
    'RJ→SP','Vitória→SP','Manaus→Belém'
  ];

  const MOT = [
    ['João Silva',   'J. Silva',   '(11)98472-1133'],
    ['Marcos Souza', 'M. Souza',   '(19)99721-4408'],
    ['Ricardo Almeida','R. Almeida','(15)98821-7765'],
    ['Carlos Pereira','C. Pereira','(11)99334-5521'],
    ['Paulo Santos', 'P. Santos',  '(21)97654-3210'],
    ['André Lima',   'A. Lima',    '(13)98877-6655'],
    ['Fernando Costa','F. Costa',  '(41)99123-4567'],
    ['Roberto Oliveira','R. Oliveira','(31)98765-4321'],
    ['Luís Ferreira','L. Ferreira','(85)97654-1234'],
    ['Antônio Rodrigues','A. Rodrigues','(81)99876-5432'],
    ['José Neves',   'J. Neves',   '(62)98123-4567'],
    ['Eduardo Machado','E. Machado','(71)99456-7890']
  ];

  const DEST_PH = [
    '(11)3344-5566','(21)2233-7700','(13)3221-4400',
    '(41)3332-1122','(31)3211-9900','(85)3456-7890'
  ];

  // ── Gerador LCG com seed fixa (garante fila idêntica a cada carga) ───────
  let _s = 42;
  const r    = () => { _s = (_s * 1664525 + 1013904223) & 0xffffffff; return (_s >>> 0) / 0xffffffff; };
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const n    = (a, b) => Math.floor(r() * (b - a + 1)) + a;
  const conn4g = () => ({ sinal:['ok', r() > .5 ? '4G' : '3G'], gps:['ok','Agora'], ign:['ok','Ligada'], bat:['ok',`${n(60,95)}%`] });

  // ── Padrões de ocorrência (11 tipos de evento) ───────────────────────────
  const P = [
    // 0 — GPS Offline / Parado sem comunicação
    {
      label: 'GPS Offline / Sem Comunicação',
      fonte: 'Telemetria / Rastreador',
      sev: 'crit', slaRisk: 'critical',
      sla: () => `${n(8,42)}min restantes`,
      issue: () => `Parado há ${n(30,90)}min sem comunicação`,
      det: 'GPS offline. Motorista não responde ao contato. Protocolo de localização ativo.',
      ctx: (rt, mi) => [['ETA',`+${n(1,3)}h atraso`],['ROTA',rt],['MOTORISTA',mi]],
      conn: () => ({ sinal:['bad','Sem sinal'], gps:['warn',`${n(5,30)} min`], ign:['warn','Desligada'], bat:['ok',`${n(50,85)}%`] }),
      acts: [
        { title:'Acionar central 0800', desc:'SMS automático + tentativa de contato imediato', ty:'pri', out:'snooze' },
        { title:'Consultar rastreador', desc:'Verificar histórico de posições no provedor', ty:'', out:'snooze' },
        { title:'Escalar gestor de rota', desc:'Notificar supervisor imediatamente', ty:'', out:'escalate' }
      ],
      tl: () => [
        { t:'13:47', e:'Sem telemetria — GPS offline', ty:'alert' },
        { t:'13:10', e:'Velocidade 0 km/h registrada', ty:'alert' },
        { t:'11:30', e:'Última posição conhecida', ty:'ok' },
        { t:'08:00', e:'Saída do CD confirmada', ty:'milestone' }
      ]
    },
    // 1 — OTIF em risco / Atraso crítico
    {
      label: 'OTIF em Risco / Atraso Crítico',
      fonte: 'TMS / ERP',
      sev: 'crit', slaRisk: 'critical',
      sla: () => 'SLA em risco',
      issue: () => `OTIF em risco — atraso +${n(35,120)}min`,
      det: () => `Janela de entrega expira em ${n(10,45)} minutos. Atraso acumulado compromete o SLA contratado.`,
      ctx: rt => [['ETA',`+${n(35,120)}min`],['JANELA','em risco'],['ROTA',rt]],
      conn: conn4g,
      acts: [
        { title:'Notificar cliente', desc:'Enviar nova ETA + justificativa OTIF', ty:'pri', out:'snooze' },
        { title:'Acionar motorista', desc:'Solicitar aceleração ou rota alternativa', ty:'', out:'snooze' },
        { title:'Registrar ocorrência', desc:'Documentar para auditoria de SLA', ty:'', out:'resolve' }
      ],
      tl: () => [
        { t:'14:05', e:'ETA recalculado — janela em risco', ty:'alert' },
        { t:'13:30', e:'Congestionamento detectado na rota', ty:'alert' },
        { t:'08:00', e:'Saída do CD', ty:'milestone' }
      ]
    },
    // 2 — MDF-e rejeitado pela SEFAZ
    {
      label: 'MDF-e Rejeitado pela SEFAZ',
      fonte: 'Fiscal / Documental',
      sev: 'crit', slaRisk: 'critical',
      sla: () => `${n(5,25)}min restantes`,
      issue: () => 'MDF-e rejeitado pela SEFAZ',
      det: () => `Código ${pick([539,550,562,570])} — divergência de informação. Carga bloqueada.`,
      ctx: rt => [['DOC','MDF-e'],['STATUS','Rejeitado'],['ROTA',rt]],
      conn: conn4g,
      acts: [
        { title:'Acionar equipe fiscal', desc:'Retificar MDF-e junto à SEFAZ', ty:'pri', out:'snooze' },
        { title:'Verificar dados NF-e', desc:'Conferir valores e destinatário no manifesto', ty:'', out:'snooze' },
        { title:'Orientar motorista', desc:'Aguardar liberação fiscal no local', ty:'', out:'escalate' }
      ],
      tl: () => [
        { t:'14:02', e:`MDF-e rejeitado: código ${pick([539,550])}`, ty:'alert' },
        { t:'13:50', e:'Tentativa de transmissão', ty:'ok' },
        { t:'13:00', e:'Carga manifestada', ty:'milestone' }
      ]
    },
    // 3 — Temperatura do baú fora da faixa
    {
      label: 'Temperatura do Baú Fora da Faixa',
      fonte: 'Telemetria / Rastreador',
      sev: 'crit', slaRisk: 'critical',
      sla: () => `${n(20,45)}min restantes`,
      issue: () => `Câmara ${n(6,11)}°C — limite 4°C há ${n(8,25)}min`,
      det: 'Carga termolábil em risco de perda. Protocolo de refrigeração emergencial deve ser acionado.',
      ctx: (rt, mi) => [['CÂMARA',`${n(6,11)}°C`],['LIMITE','4°C'],['MOTORISTA',mi]],
      conn: conn4g,
      acts: [
        { title:'Acionar manutenção', desc:'Protocolo emergência refrigeração', ty:'pri', out:'snooze' },
        { title:'Contatar motorista', desc:'Verificar painel da câmara frigorífica', ty:'', out:'snooze' },
        { title:'Avaliar perda de carga', desc:'Iniciar análise de risco com equipe qualidade', ty:'', out:'escalate' }
      ],
      tl: () => [
        { t:'13:48', e:'Temperatura ultrapassou limite crítico', ty:'alert' },
        { t:'13:36', e:'Alerta preditivo: tendência de alta', ty:'alert' },
        { t:'12:00', e:'Carga lacrada — viagem iniciada', ty:'milestone' }
      ]
    },
    // 4 — Desvio de rota
    {
      label: 'Desvio de Rota Detectado',
      fonte: 'API de Rota',
      sev: 'high', slaRisk: 'warn',
      sla: () => `${n(1,2)}h${n(10,55)}min restantes`,
      issue: () => `Desvio de rota — ${n(5,18)}km fora do plano`,
      det: 'Possível alternativa por congestionamento. Aguardando confirmação do motorista.',
      ctx: (rt, mi) => [['DESVIO',`+${n(5,18)}km`],['ROTA',rt],['MOTORISTA',mi]],
      conn: conn4g,
      acts: [
        { title:'Aceitar desvio', desc:'Validar rota alternativa e monitorar', ty:'pri', out:'resolve' },
        { title:'Contatar motorista', desc:'Confirmar motivo do desvio', ty:'', out:'snooze' },
        { title:'Forçar retorno', desc:'Solicitar volta à rota original', ty:'', out:'snooze' }
      ],
      tl: () => [
        { t:'14:02', e:`Desvio detectado: +${n(5,18)}km`, ty:'alert' },
        { t:'13:30', e:'Tráfego intenso reportado', ty:'ok' },
        { t:'10:00', e:'Saída do CD', ty:'milestone' }
      ]
    },
    // 5 — Bateria crítica do app
    {
      label: 'Bateria Crítica do App do Motorista',
      fonte: 'Perfil do Aplicativo',
      sev: 'high', slaRisk: 'warn',
      sla: () => `${n(1,3)}h${n(0,55)}min restantes`,
      issue: () => `Bateria do app crítica — ${n(4,12)}%`,
      det: 'Risco de perda de comunicação iminente. Motorista deve conectar carregador imediatamente.',
      ctx: (rt, mi) => [['BATERIA',`${n(4,12)}%`],['ROTA',rt],['MOTORISTA',mi]],
      conn: () => ({ sinal:['ok', r()>.5?'4G':'3G'], gps:['ok','Agora'], ign:['ok','Ligada'], bat:['bad',`${n(4,12)}%`] }),
      acts: [
        { title:'Contatar motorista', desc:'Solicitar conexão do carregador urgente', ty:'pri', out:'snooze' },
        { title:'Ativar rastreador veicular', desc:'Usar GPS do caminhão como backup', ty:'', out:'snooze' },
        { title:'Monitorar via telemetria', desc:'Acompanhar pelo rastreador do veículo', ty:'', out:'reopen' }
      ],
      tl: () => [
        { t:'14:10', e:`Bateria crítica: ${n(4,12)}%`, ty:'alert' },
        { t:'13:45', e:'Alerta bateria baixa: 20%', ty:'alert' },
        { t:'09:00', e:'App online na saída', ty:'milestone' }
      ]
    },
    // 6 — CT-e com problema
    {
      label: 'CT-e com Problema / Divergência',
      fonte: 'Fiscal / Documental',
      sev: 'high', slaRisk: 'warn',
      sla: () => `${n(1,2)}h${n(10,55)}min restantes`,
      issue: () => 'CT-e com problema — aguardando retificação',
      det: 'Valor declarado diverge do manifesto de carga. Equipe fiscal notificada.',
      ctx: rt => [['DOC','CT-e'],['STATUS','Pendente'],['ROTA',rt]],
      conn: conn4g,
      acts: [
        { title:'Acionar equipe fiscal', desc:'Retificar CT-e e reenviar emissão', ty:'pri', out:'snooze' },
        { title:'Verificar manifesto', desc:'Conferir dados NF-e e CT-e', ty:'', out:'snooze' },
        { title:'Orientar motorista', desc:'Aguardar liberação antes de prosseguir', ty:'', out:'escalate' }
      ],
      tl: () => [
        { t:'13:55', e:'CT-e rejeitado: valor divergente', ty:'alert' },
        { t:'13:20', e:'Tentativa de emissão', ty:'ok' },
        { t:'11:00', e:'Manifesto emitido', ty:'milestone' }
      ]
    },
    // 7 — Destinatário vermelho
    {
      label: 'Destinatário Vermelho Detectado',
      fonte: 'TMS / ERP',
      sev: 'high', slaRisk: 'warn',
      sla: () => `${n(2,4)}h${n(0,55)}min restantes`,
      issue: () => 'Destinatário vermelho detectado',
      det: 'Histórico de recusa acima do threshold configurado. Contato prévio recomendado.',
      ctx: rt => [['DEST','Vermelho'],['TAXA RECUSA','18%'],['ROTA',rt]],
      conn: conn4g,
      acts: [
        { title:'Contatar destinatário', desc:'Confirmar disponibilidade de recebimento', ty:'pri', out:'snooze' },
        { title:'Acionar motorista', desc:'Alertar sobre histórico e pedir atenção', ty:'', out:'snooze' },
        { title:'Registrar risco', desc:'Documentar para análise de recorrência', ty:'', out:'resolve' }
      ],
      tl: () => [
        { t:'14:00', e:'Threshold de recusa atingido', ty:'alert' },
        { t:'12:00', e:'Última recusa neste destino', ty:'alert' },
        { t:'09:00', e:'SM gerada — motorista designado', ty:'milestone' }
      ]
    },
    // 8 — ETA recalculado
    {
      label: 'ETA Recalculado — Atraso',
      fonte: 'API de Rota',
      sev: 'high', slaRisk: 'warn',
      sla: () => `${n(1,2)}h${n(5,50)}min restantes`,
      issue: () => `ETA recalculado — atraso +${n(20,60)}min`,
      det: 'Congestionamento na rota recalculou a ETA. Janela do cliente ainda dentro do tolerável.',
      ctx: (rt, mi) => [['ETA',`+${n(20,60)}min`],['ROTA',rt],['MOTORISTA',mi]],
      conn: conn4g,
      acts: [
        { title:'Notificar cliente', desc:'Informar nova ETA preventivamente', ty:'pri', out:'snooze' },
        { title:'Verificar rota alternativa', desc:'Consultar API de rotas por opção mais rápida', ty:'', out:'snooze' },
        { title:'Monitorar', desc:'Acompanhar evolução sem ação direta', ty:'', out:'reopen' }
      ],
      tl: () => [
        { t:'14:00', e:`ETA recalculado +${n(20,60)}min`, ty:'alert' },
        { t:'13:10', e:'Congestionamento detectado', ty:'alert' },
        { t:'08:30', e:'Saída do CD', ty:'milestone' }
      ]
    },
    // 9 — Janela de entrega expirando
    {
      label: 'Janela de Entrega Expirando',
      fonte: 'TMS / ERP',
      sev: 'warn', slaRisk: 'ok',
      sla: () => `${n(2,4)}h${n(5,55)}min restantes`,
      issue: () => `Janela expirando em ${n(20,45)}min`,
      det: () => `${n(2,5)} paradas ainda pendentes. Ritmo atual pode não atender a janela contratada.`,
      ctx: (rt, mi) => [['JANELA',`${n(20,45)}min`],['PENDENTES',`${n(2,5)} paradas`],['ROTA',rt]],
      conn: conn4g,
      acts: [
        { title:'Priorizar entregas', desc:'Reordenar paradas por urgência', ty:'pri', out:'resolve' },
        { title:'Contatar motorista', desc:'Orientar sobre prioridade das entregas', ty:'', out:'snooze' },
        { title:'Notificar cliente', desc:'Alertar sobre risco de janela', ty:'', out:'snooze' }
      ],
      tl: () => [
        { t:'14:05', e:'Janela em risco detectada', ty:'alert' },
        { t:'13:00', e:'60% das entregas concluídas', ty:'ok' },
        { t:'08:00', e:'Início da rota', ty:'milestone' }
      ]
    },
    // 10 — Parada não programada
    {
      label: 'Parada Não Programada',
      fonte: 'Telemetria / Rastreador',
      sev: 'warn', slaRisk: 'ok',
      sla: () => `${n(3,5)}h${n(0,55)}min restantes`,
      issue: () => `Parada não programada — ${n(15,40)}min`,
      det: 'Veículo parado fora do ponto de entrega. Aguardando justificativa do motorista.',
      ctx: (rt, mi) => [['PARADA',`${n(15,40)}min`],['ROTA',rt],['MOTORISTA',mi]],
      conn: () => ({ sinal:['ok', r()>.5?'4G':'3G'], gps:['ok','Agora'], ign:r()>.4?['ok','Ligada']:['warn','Desligada'], bat:['ok',`${n(60,90)}%`] }),
      acts: [
        { title:'Solicitar justificativa', desc:'Contatar motorista para esclarecer parada', ty:'pri', out:'snooze' },
        { title:'Verificar geofence', desc:'Confirmar se é ponto não cadastrado', ty:'', out:'snooze' },
        { title:'Monitorar', desc:'Aguardar retomada sem ação direta', ty:'', out:'reopen' }
      ],
      tl: () => [
        { t:'13:50', e:'Parada não programada detectada', ty:'alert' },
        { t:'13:00', e:'Última entrega confirmada', ty:'ok' },
        { t:'08:00', e:'Início da rota', ty:'milestone' }
      ]
    }
  ];

  // ── Distribuição dos 40 itens (4 de cada tipo) ───────────────────────────
  const DIST = [
    0,0,0,0, 1,1,1,1, 2,2,2,2, 3,3,3,3,
    4,4,4,4, 5,5,5,5, 6,6,6,6, 7,7,7,7,
    8,8,     9,9,    10,10,10,10
  ];

  // ── Geo-pontos das rotas ─────────────────────────────────────────────────
  const GEOS = [
    { origin:[-23.55,-46.63], dest:[-12.97,-38.51], pos:[-16.5,-39.2] },
    { origin:[-22.91,-47.06], dest:[-22.91,-43.20], pos:[-22.85,-45.20] },
    { origin:[-23.50,-47.46], dest:[-23.96,-46.33], pos:[-23.78,-46.50] },
    { origin:[-23.51,-46.78], dest:[-23.42,-46.46], pos:[-23.50,-46.65] },
    { origin:[-15.78,-47.93], dest:[-23.55,-46.63], pos:[-20.00,-47.00] },
    { origin:[-19.92,-43.94], dest:[-23.55,-46.63], pos:[-21.50,-45.50] },
    { origin:[-25.43,-49.27], dest:[-23.55,-46.63], pos:[-24.00,-47.80] },
    { origin:[-8.05,-34.88],  dest:[-23.55,-46.63], pos:[-14.00,-39.50] },
    { origin:[-30.03,-51.23], dest:[-23.55,-46.63], pos:[-26.00,-49.00] },
    { origin:[-3.71,-38.54],  dest:[-23.55,-46.63], pos:[-10.00,-40.50] }
  ];

  // ── Templates de chat por tipo de evento ────────────────────────────────
  const CHAT_TPLS = [
    // 0 — GPS Offline
    [
      { from:'system',   text:'WhatsApp automático enviado — sem retorno', time:'13:47' },
      { from:'operator', text:'Motorista, confirme sua situação urgente.', time:'13:52' }
    ],
    // 1 — OTIF
    [
      { from:'driver',   text:'Preso no trânsito desde as 13h. Sem previsão.', time:'13:45' },
      { from:'operator', text:'Recebido. Vou notificar o cliente.', time:'13:47' },
      { from:'system',   text:'Alerta OTIF enviado ao cliente', time:'14:05' }
    ],
    // 2 — MDF-e
    [
      { from:'system',   text:'Notificação enviada à equipe fiscal', time:'14:00' },
      { from:'driver',   text:'Portaria não me deixa entrar sem o doc.', time:'14:05' },
      { from:'operator', text:'Equipe fiscal já analisa. Aguarda no local.', time:'14:08' }
    ],
    // 3 — Temperatura
    [
      { from:'system',   text:'Alerta de temperatura enviado ao motorista', time:'13:36' },
      { from:'driver',   text:'O painel tá piscando, não sei o que fazer.', time:'13:40' },
      { from:'operator', text:'Liga o breaker auxiliar no baú. Manutenção a caminho.', time:'13:42' }
    ],
    // 4 — Desvio
    [
      { from:'driver',   text:'Mudei a rota, tava travado na Dutra.', time:'13:58' },
      { from:'system',   text:'Desvio detectado — +12km fora do plano', time:'14:02' },
      { from:'operator', text:'Entendido. Confirma nova ETA estimada?', time:'14:03' }
    ],
    // 5 — Bateria
    [
      { from:'system',   text:'Alerta: bateria crítica enviado ao motorista', time:'14:10' },
      { from:'driver',   text:'Vi o aviso. Esqueci o carregador no CD.', time:'14:12' },
      { from:'operator', text:'Use o rastreador do veículo. Monitorando por lá.', time:'14:13' }
    ],
    // 6 — CT-e
    [
      { from:'system',   text:'Equipe fiscal notificada automaticamente', time:'13:55' },
      { from:'driver',   text:'Aguardando na balança. Quanto tempo?', time:'14:00' },
      { from:'operator', text:'Retificando agora. Previsão 20min. Aguarda.', time:'14:02' }
    ],
    // 7 — Destinatário vermelho
    [
      { from:'system',   text:'Histórico de recusa consultado — 18%', time:'13:58' },
      { from:'operator', text:'Contate o destinatário antes de chegar.', time:'14:00' },
      { from:'driver',   text:'Já liguei. Confirmou que está aguardando.', time:'14:04' }
    ],
    // 8 — ETA
    [
      { from:'system',   text:'ETA recalculado: +40min por congestionamento', time:'14:00' },
      { from:'driver',   text:'Trânsito pesado na marginal. Sem melhora.', time:'14:02' },
      { from:'operator', text:'Cliente notificado. Segue monitoramento.', time:'14:05' }
    ],
    // 9 — Janela
    [
      { from:'system',   text:'Alerta preditivo de janela enviado', time:'14:05' },
      { from:'driver',   text:'Fiz 60% das entregas. Acelerando.', time:'14:08' },
      { from:'operator', text:'Priorize ponto B antes do C — janela mais curta.', time:'14:10' }
    ],
    // 10 — Parada não programada
    [
      { from:'system',   text:'Parada não programada detectada', time:'13:50' },
      { from:'operator', text:'Motorista, qual o motivo da parada?', time:'13:52' },
      { from:'driver',   text:'Parei no posto rapidinho. Volto já.', time:'13:54' }
    ]
  ];

  // Tipo de operação por padrão de evento (fonte única de verdade)
  const P_TYPE = {
    0:'Dedicado',    // GPS Offline — veículo dedicado rastreado
    1:'LTL',         // OTIF em risco — multi-entrega com SLA
    2:'Transferência',// MDF-e rejeitado — doc fiscal de transferência
    3:'Dedicado',    // Temperatura — baú refrigerado dedicado
    4:'LTL',         // Desvio de rota — rota multi-parada
    5:'Mutação',     // Bateria crítica — rota alterada em campo
    6:'Transferência',// CT-e problema — emissão de transferência
    7:'LTL',         // Destinatário vermelho — multi-entrega
    8:'LTL',         // ETA recalculado — congestionamento
    9:'LTL',         // Janela expirando — multi-parada
   10:'Dedicado'     // Parada não programada — veículo dedicado
  };

  // ── Geração da fila ──────────────────────────────────────────────────────
  function genQueue () {
    return DIST.map((pIdx, i) => {
      const p = P[pIdx];
      const cli = pick(CLI);
      const rt  = pick(RTS);
      const [mFull, mInit, mPh] = pick(MOT);
      const dPh = pick(DEST_PH);
      const geo = GEOS[i % GEOS.length];
      return {
        sm:   `SM-${9500 + i * 8 + n(1, 5)}`,
        sla:  { label: typeof p.sla === 'function' ? p.sla() : p.sla, risk: p.slaRisk },
        cli,
        sev:  p.sev,
        pIdx,                          // índice do padrão (para config)
        type: P_TYPE[pIdx] || 'LTL',  // tipo de operação
        issue:typeof p.issue === 'function' ? p.issue() : p.issue,
        det:  typeof p.det   === 'function' ? p.det()   : p.det,
        ctx:  p.ctx(rt, mInit),
        conn: p.conn(),
        geo,
        ml:   `${String(n(10,14)).padStart(2,'0')}:${String(n(0,59)).padStart(2,'0')} · ${rt.split('→')[0]} km ${n(20,250)}`,
        mot:  { n: mFull, ph: mPh },
        dest: { n: `CD ${cli} ${rt.split('→')[1] || 'Destino'}`, ph: dPh },
        tl:   p.tl(),
        acts: p.acts.map(a => ({ ...a })),
        chat: CHAT_TPLS[pIdx] || []
      };
    });
  }

  // ── Severidade numérica (para ordenação — não usar 0 para evitar ||falsy bug) ─
  const SEV = { crit: 1, high: 2, warn: 3 };

  const queue  = genQueue();
  const SORTED = queue.map((_, i) => i).sort((a, b) => (SEV[queue[a].sev] ?? 9) - (SEV[queue[b].sev] ?? 9));

  // ── Exposição global ─────────────────────────────────────────────────────
  window.TCM = window.TCM || {};
  Object.assign(window.TCM, {
    queue,
    SORTED,
    SEV,
    clientes:     CLI,
    rotas:        RTS,
    tiposEvento:  P.map((p, i) => ({ id: i, label: p.label, fonte: p.fonte, sev: p.sev })),
    chatTpls:     CHAT_TPLS
  });

})();
