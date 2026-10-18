document.addEventListener('DOMContentLoaded',()=>{
 const data=window.cashlyCharts||{};
 const byDay={};(data.week||[]).forEach(x=>byDay[x.movement_date]=x);const labels=[];const incomes=[];const expenses=[];for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');labels.push(d.toLocaleDateString('es-CO',{weekday:'short',day:'2-digit'}));incomes.push(Number((byDay[k]||{}).income||0));expenses.push(Number((byDay[k]||{}).expense||0));}
 if(document.getElementById('weeklyChart'))new Chart(document.getElementById('weeklyChart'),{type:'line',data:{labels,datasets:[{label:'Ingresos',data:incomes,borderColor:'#8fc8f5',backgroundColor:'rgba(143,200,245,.18)',fill:true,tension:.35,pointRadius:3},{label:'Gastos',data:expenses,borderColor:'#ed9ab6',backgroundColor:'rgba(237,154,182,.16)',fill:true,tension:.35,pointRadius:3}]},options:{responsive:true,plugins:{legend:{position:'bottom'}},scales:{y:{beginAtZero:true,grid:{color:'rgba(120,150,190,.12)'}},x:{grid:{display:false}}}}});
 const hexRgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const mix=(a,b,t)=>'#'+hexRgb(a).map((v,i)=>Math.round(v+(hexRgb(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
 ['expense','income'].forEach(type=>{
  const el=document.getElementById(type+'Chart'); if(!el)return;
  const rows=(data.categories||[]).filter(x=>x.type===type).sort((a,b)=>Number(a.total)-Number(b.total));
  const vals=rows.map(x=>Number(x.total)); const min=Math.min(...vals),max=Math.max(...vals);
  const pale=type==='expense'?'#fde7ed':'#e2f3ff'; const deep=type==='expense'?'#d94f78':'#246bc2';
  const shades=rows.map(x=>mix(pale,deep,max===min?0.55:0.18+0.82*((Number(x.total)-min)/(max-min))));
  new Chart(el,{type:'doughnut',data:{labels:rows.length?rows.map(x=>x.category):['Sin datos'],datasets:[{data:rows.length?vals:[1],backgroundColor:rows.length?shades:['#e9f0fa'],borderColor:'#ffffff',borderWidth:2,hoverOffset:6}]},options:{cutout:'68%',plugins:{legend:{position:'bottom',labels:{boxWidth:9,font:{size:10}}},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(ctx.raw)}`}}}}});
 });
 // Gráficas administrativas: se mantienen visibles incluso cuando la base de datos está vacía.
 const growthRows=(window.cashlyGrowth||[]).slice();
 const monthNames=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
 const lastMonths=[];for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);lastMonths.push({month:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),label:monthNames[d.getMonth()],total:0});}
 const growthMap={};growthRows.forEach(r=>{growthMap[String(r.month||'')]=Number(r.total||0)});
 // Inicio del administrador: registros diarios durante los últimos siete días.
 const dailyRows=window.cashlyDailyGrowth||[];const dailyMap={};dailyRows.forEach(r=>{dailyMap[String(r.day||'').slice(0,10)]=Number(r.total||0)});
 const dailyLabels=[],dailyValues=[];for(let i=6;i>=0;i--){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-i);const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');dailyLabels.push(d.toLocaleDateString('es-CO',{weekday:'short',day:'2-digit'}));dailyValues.push(Number(dailyMap[key]||0));}
 const adminGrowthCanvas=document.getElementById('adminGrowthChart');
 if(adminGrowthCanvas){new Chart(adminGrowthCanvas,{type:'line',data:{labels:dailyLabels,datasets:[{label:'Usuarios registrados',data:dailyValues,borderColor:'#4b91e7',backgroundColor:'rgba(75,145,231,.14)',fill:true,tension:.35,pointRadius:3,pointHoverRadius:6,pointBackgroundColor:'#4b91e7',pointBorderColor:'#fff',pointBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,interaction:{intersect:false,mode:'index'},plugins:{legend:{display:false},tooltip:{displayColors:false}},scales:{y:{beginAtZero:true,grace:'12%',ticks:{precision:0,maxTicksLimit:5},grid:{color:'rgba(120,150,190,.12)'}},x:{grid:{display:false}}}}});const empty=document.getElementById('adminGrowthEmpty');if(empty)empty.hidden=dailyValues.some(v=>v>0);}
 // Estadísticas: usuarios por mes en barras, incluso sin registros.
 const statsBarCanvas=document.getElementById('statsUsersBarChart');if(statsBarCanvas){const mLabels=lastMonths.map(r=>r.label);const mValues=lastMonths.map(r=>Number(growthMap[r.month]||0));new Chart(statsBarCanvas,{type:'bar',data:{labels:mLabels,datasets:[{label:'Nuevos usuarios',data:mValues,backgroundColor:'#8bbaf0',hoverBackgroundColor:'#4b91e7',borderRadius:7,maxBarThickness:34}]},options:{maintainAspectRatio:false,responsive:true,plugins:{legend:{display:false},tooltip:{displayColors:false}},scales:{y:{beginAtZero:true,ticks:{precision:0,maxTicksLimit:4},grid:{color:'rgba(120,150,190,.12)'}},x:{grid:{display:false}}}}});}
 const palette=['#3789e8','#65c8b6','#a98be8','#f4a18c','#e783bd','#9bb8f3'];
 const buildLegend=(targetId,rows)=>{const el=document.getElementById(targetId);if(!el)return;el.innerHTML='';if(!rows.length){el.innerHTML='<li class="stats-legend-empty">Sin datos registrados</li>';return;}rows.forEach((row,i)=>{const li=document.createElement('li');const dot=document.createElement('span');dot.className='stats-legend-dot';dot.style.background=palette[i%palette.length];const name=document.createElement('span');name.className='stats-legend-name';name.textContent=row.category;const val=document.createElement('b');val.textContent=row.percent;li.append(dot,name,val);el.appendChild(li);});};
 const makeStatsDonut=(canvasId,legendId,source,mode)=>{const canvas=document.getElementById(canvasId);if(!canvas)return;const rows=(source||[]).map(r=>({category:String(r.category||'Sin categoría'),value:Number(r.total||0)}));const sum=rows.reduce((a,r)=>a+r.value,0);const show=rows.map(r=>({...r,percent:sum?Math.round(r.value/sum*100)+'%':'0%'}));buildLegend(legendId,show);new Chart(canvas,{type:'doughnut',data:{labels:rows.length?rows.map(r=>r.category):['Sin datos'],datasets:[{data:rows.length?rows.map(r=>r.value):[1],backgroundColor:rows.length?rows.map((_,i)=>palette[i%palette.length]):['#e5edf8'],borderWidth:3,borderColor:'#fff',hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'64%',layout:{padding:2},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${mode==='money'?new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(ctx.raw):ctx.raw+' registros'}`}}}}});};
 makeStatsDonut('popularCategoriesChart','popularCategoriesLegend',window.cashlyPopularCategories||[],'count');
 makeStatsDonut('expenseDistributionChart','expenseDistributionLegend',window.cashlyExpenseCategories||[],'money');
 const adminStats=window.cashlyAdminStats||{};
 const accountCanvas=document.getElementById('accountChart');
 if(accountCanvas){new Chart(accountCanvas,{type:'doughnut',data:{labels:['Activas','Inactivas'],datasets:[{data:[Number(adminStats.active||0),Number(adminStats.inactive||0)],backgroundColor:['#72cbb7','#a9c9f6'],borderColor:'#fff',borderWidth:3,hoverOffset:5}]},options:{maintainAspectRatio:false,cutout:'66%',plugins:{legend:{position:'right',labels:{boxWidth:8,padding:12,font:{size:10}}}}}});}
 const userStatusCanvas=document.getElementById('userStatusChart');
 if(userStatusCanvas){new Chart(userStatusCanvas,{type:'doughnut',data:{labels:['Usuarios','Metas','Presupuestos'],datasets:[{data:[Number(adminStats.users||0),Number(adminStats.goals||0),Number(adminStats.budgets||0)],backgroundColor:['#4d91e7','#70cfb4','#c7a8f5'],borderColor:'#fff',borderWidth:3,hoverOffset:5}]},options:{maintainAspectRatio:false,cutout:'66%',plugins:{legend:{position:'right',labels:{boxWidth:8,padding:12,font:{size:10}}}}}});}
 const search=document.getElementById('tableSearch');if(search)search.addEventListener('input',()=>document.querySelectorAll('#usersTable tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(search.value.toLowerCase())?'':'none'));
});
const movementCategories={
 expense:['Alimentación','Mercado y supermercado','Restaurantes y cafés','Transporte público','Gasolina','Taxi y aplicaciones','Vivienda y arriendo','Servicios públicos','Internet y telefonía','Salud y medicamentos','Cuidado personal','Ropa y calzado','Maquillaje y belleza','Entretenimiento','Suscripciones','Educación y cursos','Libros y papelería','Mascotas','Hogar y decoración','Tecnología','Viajes y vacaciones','Regalos y donaciones','Deudas e intereses','Impuestos y trámites','Deporte y gimnasio','Seguros','Comisiones bancarias','Otros gastos'],
 income:['Salario','Pago de nómina','Trabajo independiente','Freelance','Ventas','Negocio propio','Bonificaciones','Comisiones','Propinas','Becas y apoyos','Pensión','Arriendos recibidos','Intereses y rendimientos','Dividendos','Reembolsos','Regalos recibidos','Devoluciones','Premios','Mesada','Otros ingresos']
};
function refreshMovementCategories(selected=''){
 const type=document.getElementById('movement-type'),select=document.getElementById('movement-category-select'),hidden=document.getElementById('movement-category'),customWrap=document.getElementById('custom-category-wrap'),custom=document.getElementById('movement-custom-category'),note=document.getElementById('category-note');
 if(!type||!select||!hidden)return;
 const list=movementCategories[type.value]||movementCategories.expense;
 select.innerHTML='<option value="">Selecciona una categoría</option>'+list.map(c=>`<option value="${c.replaceAll('&','&amp;').replaceAll('"','&quot;')}">${c}</option>`).join('')+'<option value="__custom__">＋ Otro / agregar categoría</option>';
 const isCustom=selected && !list.includes(selected);
 select.value=isCustom?'__custom__':selected;
 if(customWrap)customWrap.hidden=select.value!=='__custom__';
 if(custom)custom.value=isCustom?selected:'';
 hidden.value=isCustom?selected:(select.value==='__custom__'?'':select.value);
 if(note)note.textContent=type.value==='expense'?'Los gastos se mostrarán en tonos rosa: cuanto mayor sea el importe de una categoría, más intenso será su color.':'Los ingresos se mostrarán en tonos azules: los importes más altos tendrán un color más intenso.';
}
document.addEventListener('DOMContentLoaded',()=>{
 const type=document.getElementById('movement-type'),select=document.getElementById('movement-category-select'),hidden=document.getElementById('movement-category'),custom=document.getElementById('movement-custom-category'),wrap=document.getElementById('custom-category-wrap');
 if(!type||!select||!hidden)return;
 refreshMovementCategories();
 type.addEventListener('change',()=>refreshMovementCategories());
 select.addEventListener('change',()=>{const isCustom=select.value==='__custom__';if(wrap)wrap.hidden=!isCustom;hidden.value=isCustom?'':select.value;if(isCustom)custom?.focus();});
 custom?.addEventListener('input',()=>{hidden.value=custom.value.trim();});
 document.querySelector('.movement-form')?.addEventListener('submit',e=>{if(select.value==='__custom__'&&!custom.value.trim()){e.preventDefault();custom.focus();custom.setCustomValidity('Escribe un nombre para la categoría.');custom.reportValidity();}else if(!hidden.value.trim()){e.preventDefault();select.focus();select.setCustomValidity('Selecciona o escribe una categoría.');select.reportValidity();}else{custom?.setCustomValidity('');select.setCustomValidity('');}});
});
function editMovement(m){const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};set('movement-id',m.id);set('movement-type',m.type);refreshMovementCategories(m.category);set('movement-amount',m.amount);set('movement-method',m.payment_method);set('movement-date',m.movement_date);set('movement-description',m.description||'');document.getElementById('movement-form')?.scrollIntoView({behavior:'smooth'});}
function resetMovementForm(){const f=document.querySelector('.movement-form');if(f)f.reset();const id=document.getElementById('movement-id');if(id)id.value='';const d=document.getElementById('movement-date');if(d)d.value=new Date().toISOString().slice(0,10);refreshMovementCategories();}
function fillGoal(id,name,target,initial,deadline){document.getElementById('goal-form-title').textContent='Editar meta';document.getElementById('goal-id').value=id;document.getElementById('goal-name').value=name;document.getElementById('goal-target').value=target;document.getElementById('goal-initial').value=initial;document.getElementById('goal-deadline').value=deadline||'';document.getElementById('goal-form').scrollIntoView({behavior:'smooth'});}
function resetGoalForm(){document.getElementById('goal-form').reset();document.getElementById('goal-id').value='';document.getElementById('goal-initial').value='0';document.getElementById('goal-form-title').textContent='Crear nueva meta';}
function fillBudget(id,name,limit,period,category,spent,date){document.getElementById('budget-form-title').textContent='Editar presupuesto';document.getElementById('budget-id').value=id;document.getElementById('budget-name').value=name;document.getElementById('budget-limit').value=limit;document.getElementById('budget-period').value=period;document.getElementById('budget-category').value=category;document.getElementById('budget-spent').value=spent;document.getElementById('budget-date').value=date;document.getElementById('budget-form').scrollIntoView({behavior:'smooth'});}
function resetBudgetForm(){document.getElementById('budget-form').reset();document.getElementById('budget-id').value='';document.getElementById('budget-form-title').textContent='Crear presupuesto';}
function fillGoal(id,name,target,initial,deadline){const set=(x,v)=>{const el=document.getElementById(x);if(el)el.value=v??''};set('goal-id',id);set('goal-name',name);set('goal-target',target);set('goal-initial',initial);set('goal-deadline',deadline);const h=document.getElementById('goal-form-title');if(h)h.textContent='Editar meta';document.getElementById('goal-form')?.scrollIntoView({behavior:'smooth'});}
function resetGoalForm(){document.getElementById('goal-form')?.reset();const id=document.getElementById('goal-id');if(id)id.value='';const h=document.getElementById('goal-form-title');if(h)h.textContent='Crear meta';}
function fillBudget(id,name,limit,period,category,spent,date){const vals={'budget-id':id,'budget-name':name,'budget-limit':limit,'budget-period':period,'budget-category':category,'budget-spent':spent,'budget-date':date};Object.entries(vals).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.value=v??''});const h=document.getElementById('budget-form-title');if(h)h.textContent='Editar presupuesto';document.getElementById('budget-form')?.scrollIntoView({behavior:'smooth'});}
function resetBudgetForm(){document.getElementById('budget-form')?.reset();const id=document.getElementById('budget-id');if(id)id.value='';const h=document.getElementById('budget-form-title');if(h)h.textContent='Crear presupuesto';}

// Categorías del mini menú de consejos financieros.
document.addEventListener('DOMContentLoaded',()=>{
 const tabs=[...document.querySelectorAll('.advice-tab')];
 const cards=[...document.querySelectorAll('.advice-card')];
 const empty=document.getElementById('noAdvice');
 tabs.forEach(tab=>tab.addEventListener('click',()=>{
   tabs.forEach(t=>t.classList.toggle('active',t===tab));
   let shown=0;cards.forEach(card=>{const match=tab.dataset.filter==='todos'||card.dataset.category===tab.dataset.filter;card.hidden=!match;if(match)shown++});
   if(empty)empty.hidden=shown>0;
 }));
});
function selectCalendarDate(date){
 const rows=[...document.querySelectorAll('.transaction-date-row')];let shown=0, eventCount=0;
 rows.forEach(row=>{const match=row.dataset.date===date;row.hidden=!match;if(match){shown++;if(row.classList.contains('calendar-event-row'))eventCount++;}});
 document.querySelectorAll('.calendar-day[data-date]').forEach(day=>day.classList.toggle('selected-day',day.dataset.date===date));
 const label=document.getElementById('selectedDateLabel');if(label){const d=new Date(date+'T12:00:00');label.textContent='Actividad del '+d.toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})+((shown)?' · '+eventCount+' recordatorio(s) y movimientos':' · Sin actividad registrada');}
}
function clearCalendarDate(){document.querySelectorAll('.transaction-date-row').forEach(row=>row.hidden=false);document.querySelectorAll('.calendar-day.selected-day').forEach(day=>day.classList.remove('selected-day'));const label=document.getElementById('selectedDateLabel');if(label)label.textContent='Todos los movimientos registrados';}


// Muestra el nombre del archivo elegido para la foto de perfil.
document.addEventListener('DOMContentLoaded',()=>{
 const input=document.querySelector('.avatar-file-input');
 const filename=document.querySelector('[data-upload-name]');
 if(input&&filename) input.addEventListener('change',()=>{
   filename.textContent=input.files&&input.files.length?input.files[0].name:'Aún no has elegido una foto';
 });
});

// Filtros y edición robusta de gastos/abonos: evita onclick con textos que contienen comillas.
document.addEventListener('DOMContentLoaded',()=>{
 const bf=document.getElementById('budgetExpenseFilter');bf?.addEventListener('change',()=>document.querySelectorAll('.budget-expense-row').forEach(r=>r.hidden=bf.value!=='all'&&r.dataset.budgetId!==bf.value));
 const gf=document.getElementById('depositGoalFilter');gf?.addEventListener('change',()=>document.querySelectorAll('.deposit-row').forEach(r=>r.hidden=gf.value!=='all'&&r.dataset.goalId!==gf.value));
 document.addEventListener('click',e=>{
  const expense=e.target.closest('[data-edit-budget-expense]');
  if(expense){e.preventDefault();fillBudgetExpense(expense.dataset.id,expense.dataset.budgetId,expense.dataset.amount,expense.dataset.date,expense.dataset.description);return;}
  const deposit=e.target.closest('[data-edit-deposit]');
  if(deposit){e.preventDefault();fillDeposit(deposit.dataset.id,deposit.dataset.goalId,deposit.dataset.amount,deposit.dataset.date,deposit.dataset.note);}
 });
});
function revealEditForm(formId, values){
 const form=document.getElementById(formId); if(!form){console.error('No se encontró el formulario:',formId);return;}
 Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.value=value??'';});
 const details=form.closest('details');
 if(details){details.hidden=false;details.open=true;}
 form.hidden=false;
 form.scrollIntoView({behavior:'smooth',block:'center'});
 const first=form.querySelector('input:not([type=hidden]),select,textarea'); if(first) first.focus({preventScroll:true});
}
function fillBudgetExpense(id,budgetId,amount,date,description){revealEditForm('budget-expense-edit-form',{'budget-expense-edit-id':id,'budget-expense-edit-budget':budgetId,'budget-expense-edit-amount':amount,'budget-expense-edit-date':date,'budget-expense-edit-description':description});}
function fillDeposit(id,goalId,amount,date,note){revealEditForm('deposit-edit-form',{'deposit-edit-id':id,'deposit-edit-goal':goalId,'deposit-edit-amount':amount,'deposit-edit-date':date,'deposit-edit-note':note});}
// Vista de lectura: muestra únicamente el consejo elegido y conserva visible el menú lateral.
document.addEventListener('DOMContentLoaded',()=>{
 const cards=[...document.querySelectorAll('.advice-card')];
 const tabs=document.querySelector('.advice-tabs');
 const back=document.getElementById('adviceBack');
 const grid=document.getElementById('adviceGrid');
 function closeAdvice(){cards.forEach(c=>{c.hidden=false;c.classList.remove('advice-expanded');const d=c.querySelector('.article-expand');if(d)d.open=false;});if(tabs)tabs.hidden=false;if(back)back.hidden=true;if(grid)grid.classList.remove('advice-reading-mode');}
 function openAdvice(card){cards.forEach(c=>{const selected=c===card;c.hidden=!selected;c.classList.toggle('advice-expanded',selected);const d=c.querySelector('.article-expand');if(d)d.open=selected;});if(tabs)tabs.hidden=true;if(back)back.hidden=false;if(grid)grid.classList.add('advice-reading-mode');card.scrollIntoView({behavior:'smooth',block:'start'});}
 cards.forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('a,button'))return;if(card.classList.contains('advice-expanded'))return;openAdvice(card);}));
 back?.addEventListener('click',closeAdvice);
});


// Editor completo de consejos financieros en el panel administrativo.
function editArticle(article){
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.value=value??''};
 set('article-id',article.id);set('article-title',article.title);set('article-category',article.category||'Educación financiera');set('article-image',article.image_url);set('article-body',article.body);
 const published=document.getElementById('article-published');if(published)published.checked=String(article.published)==='1';
 const heading=document.getElementById('article-form-title');if(heading)heading.textContent='Editar consejo financiero';
 const button=document.getElementById('article-save-button');if(button)button.textContent='Guardar cambios';
 document.getElementById('article-editor')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function resetArticleForm(){
 const form=document.getElementById('article-form');if(form)form.reset();
 const id=document.getElementById('article-id');if(id)id.value='';
 const heading=document.getElementById('article-form-title');if(heading)heading.textContent='Crear consejo financiero';
 const button=document.getElementById('article-save-button');if(button)button.textContent='Guardar consejo';
 const category=document.getElementById('article-category');if(category)category.value='Educación financiera';
 const published=document.getElementById('article-published');if(published)published.checked=true;
}


// Ayuda y soporte: solo hay cuatro carpetas visibles; cada una abre su contenido y permite volver.
document.addEventListener('DOMContentLoaded',()=>{
 const homeHeading=document.querySelector('.help-home-heading');
 const homeCards=document.getElementById('help-home-cards');
 const details=[...document.querySelectorAll('[data-help-detail]')];
 const openButtons=[...document.querySelectorAll('[data-help-open]')];
 if(!homeHeading||!homeCards||!details.length)return;
 const privacyGrid=document.getElementById('privacyGrid');
 const privacyCards=privacyGrid?[...privacyGrid.querySelectorAll('.privacy-card')]:[];
 function resetPrivacy(){privacyCards.forEach(card=>{card.hidden=false;card.classList.remove('advice-expanded');const detail=card.querySelector('.privacy-detail');if(detail)detail.hidden=true;const btn=card.querySelector('.privacy-read');if(btn)btn.textContent='Leer apartado ↗';});privacyGrid?.classList.remove('advice-reading-mode');}
 function showHome(){details.forEach(el=>el.hidden=true);homeHeading.hidden=false;homeCards.hidden=false;resetPrivacy();window.scrollTo({top:0,behavior:'smooth'});}
 function showDetail(name){details.forEach(el=>el.hidden=el.dataset.helpDetail!==name);homeHeading.hidden=true;homeCards.hidden=true;if(name==='privacy')resetPrivacy();details.find(el=>el.dataset.helpDetail===name)?.scrollIntoView({behavior:'smooth',block:'start'});}
 openButtons.forEach(btn=>btn.addEventListener('click',()=>showDetail(btn.dataset.helpOpen)));
 document.querySelectorAll('[data-help-back]').forEach(btn=>btn.addEventListener('click',showHome));
 function openPrivacyCard(card){privacyCards.forEach(c=>{const selected=c===card;c.hidden=!selected;c.classList.toggle('advice-expanded',selected);const detail=c.querySelector('.privacy-detail');if(detail)detail.hidden=!selected;const btn=c.querySelector('.privacy-read');if(btn)btn.textContent=selected?'Apartado abierto':'Leer apartado ↗';});privacyGrid?.classList.add('advice-reading-mode');card.scrollIntoView({behavior:'smooth',block:'start'});}
 privacyCards.forEach(card=>{card.addEventListener('click',e=>{if(e.target.closest('a,button'))return;if(!card.classList.contains('advice-expanded'))openPrivacyCard(card);});card.querySelector('.privacy-read')?.addEventListener('click',e=>{e.stopPropagation();if(card.classList.contains('advice-expanded')){resetPrivacy();}else openPrivacyCard(card);});});
 // La selección inicial de carpeta la controla el servidor mediante ?page=ayuda&section=...;
 // no llamar showHome() aquí, porque ocultaría el contenido recién abierto.
});
