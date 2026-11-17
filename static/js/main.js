(()=>{
const $=id=>document.getElementById(id);
const skillPool=[
{name:"Barrera",description:"Genera un escudo de energía para protegerte a ti y a quienes estén cerca."},
{name:"Relámpago",description:"Canaliza descargas eléctricas para atacar y desestabilizar a tus oponentes."},
{name:"Rayo de energía",description:"Concentra tu aura y dispara proyectiles de energía a distancia."},
{name:"Curación",description:"Utiliza tu aura para acelerar la recuperación de heridas."},
{name:"Manipulación temporal",description:"Altera brevemente el flujo del tiempo a tu alrededor."},
{name:"Cazador",description:"Mejora tus sentidos y tu capacidad para localizar objetivos."},
{name:"Regeneración",description:"Recupera tu estado físico de forma gradual."},
{name:"Cambio de fase",description:"Altera tu estado corporal para esquivar o atravesar ataques."},
{name:"Descarga de energía",description:"Libera ráfagas de aura en un área cercana."},
{name:"Telequinesis",description:"Mueve y manipula objetos a distancia mediante tu aura."}
];
let savedSkill=null;try{savedSkill=JSON.parse(localStorage.getItem("unordinary_player_skill")||"null")}catch(e){}
const state={aura:60,auraActive:false,relations:{john:0,seraphina:0,arlo:0},missionDone:false,inventory:[],skill:savedSkill,stats:{power:1,defense:1,speed:1,recovery:1,trick:1}};
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("visible");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("visible"),1800)}
function closeModal(){if(!state.skill)return;$("modalBackdrop").classList.add("hidden");$("modalClose").style.display=""}
function openModal(kicker,title,body,buttons=[]){$("modalKicker").textContent=kicker;$("modalTitle").textContent=title;$("modalBody").innerHTML=body;$("modalActions").replaceChildren();buttons.forEach(b=>{const el=document.createElement("button");el.textContent=b.label;el.onclick=()=>{b.onClick?.();if(b.close!==false)closeModal()};$("modalActions").append(el)});$("modalBackdrop").classList.remove("hidden")}
$("modalClose").onclick=closeModal;$("modalBackdrop").onclick=e=>{if(e.target===$("modalBackdrop"))closeModal()};
function showInitialRoll(){
$("modalClose").style.display="none";
$("modalBackdrop").onclick=e=>{if(e.target===$("modalBackdrop")&&state.skill)closeModal()};
openModal("BIENVENIDO A WELLSTON","Despierta tu habilidad",'<p>Tu historia comienza con una habilidad que todavía no conoces. Tienes <strong>un giro gratuito</strong> para descubrirla.</p><div class="roll-orb" id="rollOrb"><span>?</span></div><p class="roll-caption" id="rollCaption">La habilidad se determinará al azar.</p>',[{label:"Girar habilidad gratis",close:false,onClick:()=>{
const action=$("modalActions").querySelector("button");if(action){action.disabled=true;action.textContent="Girando…"}
$("rollOrb").classList.add("rolling");$("rollCaption").textContent="Analizando tu aura…";
const interval=setInterval(()=>$("rollOrb").querySelector("span").textContent=skillPool[Math.floor(Math.random()*skillPool.length)].name,95);
setTimeout(()=>{clearInterval(interval);const picked=skillPool[Math.floor(Math.random()*skillPool.length)];state.skill=picked;try{localStorage.setItem("unordinary_player_skill",JSON.stringify(picked))}catch(e){}
$("rollOrb").classList.remove("rolling");$("rollOrb").querySelector("span").textContent="✦";$("modalTitle").textContent=picked.name;
$("modalBody").innerHTML='<div class="roll-result"><div class="roll-result-icon">✦</div><h3>'+picked.name+'</h3><p>'+picked.description+'</p><span>HABILIDAD OBTENIDA · GIRO GRATUITO</span></div><p class="roll-caption">Tus cinco estadísticas comienzan en nivel 1. El progreso dependerá de tu entrenamiento.</p>';
$("modalActions").replaceChildren();const start=document.createElement("button");start.textContent="Comenzar partida";start.onclick=()=>{closeModal();$("modalClose").style.display=""};$("modalActions").append(start)
},1800)
}}])
}
function inventory(){let slots="";for(let i=0;i<16;i++){const item=state.inventory[i];slots+=`<div class="inventory-slot ${item?"filled":""}"><b>${item?item.icon:"＋"}</b><span>${item?item.name:"Vacío"}</span></div>`}openModal("PERTENENCIAS","Inventario",'<p>Objetos que llevas contigo.</p><div class="inventory-grid">'+slots+'</div><div class="stat-row"><span>Espacio utilizado</span><strong>'+state.inventory.length+' / 16</strong></div>',[{label:"Cerrar"}])}
function radarChart(){
const names=["Poder","Velocidad","Truco","Recuperación","Defensa"],cx=180,cy=143,r=88;
const point=(level,i)=>{const a=-Math.PI/2+Math.PI*2*i/5;return[cx+Math.cos(a)*r*level/10,cy+Math.sin(a)*r*level/10]};
let rings="";for(let n=2;n<=10;n+=2)rings+='<polygon points="'+names.map((_,i)=>point(n,i).join(",")).join(" ")+'" class="radar-ring"/>';
let axes="",labels="";names.forEach((name,i)=>{const p=point(10,i),l=point(11.5,i);axes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" class="radar-axis"/>';labels+='<text x="'+l[0]+'" y="'+l[1]+'" class="radar-label" text-anchor="middle" dominant-baseline="middle">'+name+'</text>'});
const values=[1,1,1,1,1],data=values.map((v,i)=>point(v,i).join(",")).join(" ");
return '<svg class="radar-chart" viewBox="0 0 360 286" role="img" aria-label="Gráfico de radar con todas las estadísticas en nivel 1"><g>'+rings+axes+'<polygon points="'+data+'" class="radar-data"/>'+values.map((v,i)=>{const p=point(v,i);return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" class="radar-point"/>'}).join("")+'</g>'+labels+'<text x="180" y="276" class="radar-scale">ESCALA DE ESTADÍSTICAS · 1–10</text></svg>'
}
function ability(){
const labels=["Poder","Velocidad","Truco","Recuperación","Defensa"];
const values=labels.map(n=>'<div><span>'+n+'</span><strong>1</strong></div>').join("");
openModal("EXPEDIENTE DE HABILIDAD",state.skill?state.skill.name:"Habilidad sin asignar",'<div class="ability-summary"><span class="ability-tag">HABILIDAD</span><p>'+(state.skill?state.skill.description:"Todavía no has obtenido una habilidad.")+'</p></div>'+radarChart()+'<div class="ability-values">'+values+'</div><div class="ability-level"><span>NIVEL ACTUAL</span><strong>1.0</strong><small>Principiante · Todo está por desarrollar</small></div><div class="aura-readout">Aura disponible <strong>'+Math.ceil(state.aura)+' / 60</strong></div>',[{label:"Cerrar"}])
}
function missions(){openModal("DIARIO","Misiones",'<div class="mission-card"><strong>Un nuevo comienzo</strong><p>Explora el patio y habla con un estudiante.</p><div class="mission-status">'+(state.missionDone?"COMPLETADA":"EN CURSO")+'</div></div><div class="mission-card"><strong>La jerarquía</strong><p>Descubre cómo se organiza Wellston.</p><div class="mission-status">PRÓXIMAMENTE</div></div>',[{label:"Cerrar"}])}
function phone(){openModal("DISPOSITIVO PERSONAL","Teléfono",'<div class="mission-card"><strong>Mensajes</strong><p>No tienes mensajes nuevos.</p></div><div class="mission-card"><strong>Noticias</strong><p>El campus está tranquilo esta mañana.</p></div>',[{label:"Cerrar"}])}
const panels={inventory,ability,missions,phone};
document.querySelectorAll(".quick-button").forEach(b=>b.addEventListener("click",()=>panels[b.dataset.panel]?.()));
const shortcuts={i:inventory,k:ability,j:missions,m:phone};
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();return}if(!e.repeat&&shortcuts[e.key.toLowerCase()]&&$("modalBackdrop").classList.contains("hidden"))shortcuts[e.key.toLowerCase()]()});
function fail(message){const game=$("game");game.innerHTML='<div style="height:100%;display:grid;place-items:center;background:#9aa78a;color:#172536;font:600 15px Inter, sans-serif;padding:24px;text-align:center">'+message+'</div>'}
if(!window.Phaser){fail("No se pudo cargar el motor del juego. Recarga la página o comprueba tu conexión.");return}
try{
const config={type:Phaser.AUTO,parent:"game",width:900,height:500,backgroundColor:"#9aa78a",scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:{create,update}};
new Phaser.Game(config);
}catch(error){console.error("Error iniciando UnOrdinary-RPG:",error);fail("Hubo un error al iniciar el escenario. Abre la consola del navegador para ver el detalle.")}
function create(){
const s=this;
s.add.rectangle(450,250,900,500,0x9aa78a);
s.add.rectangle(450,250,900,104,0xc5c0a8);
s.add.rectangle(450,250,104,500,0xc5c0a8);
s.add.rectangle(450,75,430,115,0x526a7b).setStrokeStyle(4,0x30495b);
s.add.rectangle(450,75,400,83,0x71899a);
s.add.rectangle(450,33,400,16,0x40596b);
s.add.text(450,67,"WELLSTON",{fontFamily:"Arial",fontSize:"24px",fontStyle:"bold",color:"#f1f5f7"}).setOrigin(.5);
s.add.text(450,94,"PRIVATE HIGH SCHOOL",{fontFamily:"Arial",fontSize:"9px",color:"#dce8ee"}).setOrigin(.5);
for(let x=290;x<=610;x+=64){s.add.rectangle(x,48,24,22,0x9ec8d5).setStrokeStyle(2,0x3e596b);s.add.rectangle(x,101,24,22,0x9ec8d5).setStrokeStyle(2,0x3e596b)}
const tree=(x,y)=>{s.add.rectangle(x,y+17,9,25,0x70563f);s.add.circle(x,y,20,0x416f58).setStrokeStyle(2,0x315844)};
[[85,90],[160,180],[740,90],[820,170],[95,390],[790,390],[330,400],[575,400]].forEach(p=>tree(p[0],p[1]));
[[250,250],[650,250],[250,330],[650,330]].forEach(p=>{s.add.rectangle(p[0],p[1],58,12,0x795b43).setStrokeStyle(2,0x523d30);s.add.rectangle(p[0],p[1]-8,58,5,0x9a7958)});
s.add.text(450,145,"PATIO CENTRAL",{fontFamily:"Arial",fontSize:"10px",fontStyle:"bold",color:"#516c5a"}).setOrigin(.5);
function makeNpc(id,x,y,label,color,initial){const c=s.add.container(x,y);c.add([s.add.ellipse(0,13,23,8,0x17251e,.25),s.add.rectangle(0,0,19,27,color).setStrokeStyle(2,0x24303a),s.add.circle(0,-19,9,0xd7ad8d),s.add.text(0,-19,initial,{fontFamily:"Arial",fontSize:"9px",fontStyle:"bold",color:"#263747"}).setOrigin(.5)]);s.add.text(x,y-42,label,{fontFamily:"Arial",fontSize:"10px",fontStyle:"bold",color:"#142538",backgroundColor:"#e7ecdf",padding:{x:5,y:3}}).setOrigin(.5);return{id,x,y,label,container:c}}
s.npcs=[makeNpc("john",390,280,"John",0x3d5870,"J"),makeNpc("seraphina",535,280,"Seraphina",0x6c5d83,"S"),makeNpc("arlo",610,365,"Arlo",0x8b744c,"A")];
s.player=s.add.container(450,285);s.player.add([s.add.ellipse(0,13,23,9,0x17251e,.28),s.add.rectangle(0,0,19,27,0x253f58).setStrokeStyle(2,0x142b40),s.add.circle(0,-19,9,0xd7ad8d).setStrokeStyle(1,0x8e6d59)]);
s.playerAura=null;s.cameras.main.setBounds(0,0,900,500);s.cameras.main.startFollow(s.player,true,.08,.08);s.keys=s.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D",run:"SHIFT"});
s.input.keyboard.on("keydown-Q",()=>{state.auraActive=!state.auraActive;if(state.auraActive&&state.aura<=0){state.auraActive=false;toast("No tienes aura suficiente.");return}if(state.auraActive)s.playerAura=s.add.circle(s.player.x,s.player.y-9,25,0x75d7f1,.13).setStrokeStyle(2,0x8de7ff,.85);else{s.playerAura?.destroy();s.playerAura=null}toast(state.auraActive?"Aura activada":"Aura desactivada")});
s.input.keyboard.on("keydown-E",()=>{if(s.nearestNpc&&s.nearestDistance<65){const n=s.nearestNpc;state.missionDone=true;if(n.id==="john")openModal("ESTUDIANTE · WELLSTON","John Doe",'<p>«¿Eres nuevo? Intenta no meterte en problemas. Esta escuela puede ser complicada.»</p>',[{label:"Hablar un poco más",onClick:()=>{state.relations.john+=2;toast("Relación con John +2")}},{label:"Despedirse"}]);else if(n.id==="seraphina")openModal("ESTUDIANTE · WELLSTON","Seraphina",'<p>«¿Necesitas algo? Estoy ocupada, así que ve al grano.»</p>',[{label:"Presentarte",onClick:()=>{state.relations.seraphina+=2;toast("Relación con Seraphina +2")}},{label:"Despedirse"}]);else openModal("ESTUDIANTE · JERARQUÍA","Arlo",'<p>«Si vas a estudiar aquí, aprende cómo funcionan las cosas.»</p>',[{label:"Responder con respeto",onClick:()=>{state.relations.arlo++;toast("Arlo toma nota.")}},{label:"Desafiarlo",onClick:()=>{state.relations.arlo-=2;toast("Arlo no parece impresionado.")}}])}else toast("No hay nadie lo suficientemente cerca.")});
if(!state.skill)showInitialRoll();
}
function update(){
const s=this,p=s.player,k=s.keys;if(!p)return;
const speed=k.run.isDown?205:145;let vx=0,vy=0;if(k.left.isDown)vx=-1;if(k.right.isDown)vx=1;if(k.up.isDown)vy=-1;if(k.down.isDown)vy=1;const len=Math.hypot(vx,vy)||1;
p.x=Phaser.Math.Clamp(p.x+vx/len*speed/60,20,880);p.y=Phaser.Math.Clamp(p.y+vy/len*speed/60,20,480);
if(s.playerAura)s.playerAura.setPosition(p.x,p.y-9);
let nearest=null,dist=Infinity;s.npcs.forEach(n=>{const d=Phaser.Math.Distance.Between(p.x,p.y,n.x,n.y);if(d<dist){dist=d;nearest=n}});
s.nearestNpc=nearest;s.nearestDistance=dist;$("interactionHint").textContent=dist<75?"E · Interactuar con "+nearest.label:"WASD · Mover     E · Interactuar";
if(state.auraActive&&state.aura>0){state.aura=Math.max(0,state.aura-.012);if(state.aura===0){state.auraActive=false;s.playerAura?.destroy();s.playerAura=null}}
}
})();