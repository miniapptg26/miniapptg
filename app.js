'use strict';

/* ===== Конфигурация ===== */
var CFG = {
  GROWTH: 1.8,
  CLICK_BASE: 50, AUTO_BASE: 100, CRIT_BASE: 150,
  TICK_SEC: 5, TICKS_PER_MIN: 12,
  OFFLINE_MIN_MIN: 2, OFFLINE_MAX_MIN: 240,
  TURBO_COST: 800, TURBO_SEC: 120,
  MIN_STAKE: 10,
  CAP_CLICK_P: 300, CAP_AUTO_P: 300, CAP_CRIT: 70, CAP_DAILY: 150,
  MAX_PRESTIGE: 20,
  PRESTIGE_BASE: 50000, PRESTIGE_STEP: 30000,
  SHOP_PER_PAGE: 8, SHOP_COUNT: 20,
  REF_BONUS_INV: 250,
  CLAN_COST: 10000, CLAN_MIN_CONTRIB: 100, CLAN_SCORE_PER_LVL: 20000, CLAN_MAX_LVL: 25, CLAN_MAX_BONUS: 15,
  NOTIF_CAP: 30
};

/* Бот и связь с ЛС (https://t.me/ded_cmbot) */
var BOT_USERNAME = 'ded_cmbot';
var BOT_APP_SHORT = '';      // short_name Mini App из BotFather (/newapp) — если есть, ссылки станут короче
var SYNC_URL = '';           // URL хранилища рейтинга (JSONBin и т.п.). Пусто = локальный режим
var SYNC_TOKEN = '';
var SYNC_BIN = '';

var SECTIONS = [
  {id:'tanks',icon:'🧪',label:'Баки'},{id:'pods',icon:'📱',label:'Под-системы'},
  {id:'mods',icon:'📦',label:'Бокс-моды'},{id:'boro',icon:'🔮',label:'BORO'},
  {id:'aio',icon:'💨',label:'AIO'},{id:'custom',icon:'🛠',label:'Конструкторы'},
  {id:'juice',icon:'🧃',label:'Жижи'},{id:'wata',icon:'🧶',label:'Вата'},
  {id:'coils',icon:'🌀',label:'Койлы'},{id:'accums',icon:'🔋',label:'Аккумуляторы'}
];

var BASE_NAMES = {
  tanks:['Wotofo Profile RDA','GeekVape Zeus X RTA','Hellvape Dead Rabbit V3','Vaporesso iTank 2','Uwell Valyrian 3','Vandy Vape Kylin M','Steam Crave Aromamizer','Hellvape Blotto','Freemax Fireluke 3','Horizon Falcon King','GeekVape ZX RTA','Damn Vape Doom','Uwell Crown 5','Smok TFV18','Innokin Zenith 2','Aspire Odan','Augvape Druga','Vaporesso Cascade','GeekVape Zeus Sub-Ohm','Wotofo Sapor RTA'],
  pods:['Aspire Flexus Q','SMOK Novo 4','Lost Vape Orion','Vaporesso XROS 4','Uwell Caliburn G3','Vaporesso Luxe X','SMOK RPM5','Oxva Xlim Pro','XROS Nano','GeekVape Wenax K1','Innokin Sceptre 2','Voopoo Vinci Q','Caliburn A2','SMOK Nord 5','Aspire Vilter','Lost Vape UB Lite','Renova Zero 2','Justfog Q16','SMOK Nfix','Caliburn X'],
  mods:['Voopoo Drag 4','Vaporesso Gen 200','GeekVape Aegis Legend 2','Thelema Quest','Yihi SXmini G Class','Vaporesso Gen S','Smok Mag-18','Drag X Plus','Aegis Solo 2','Centaurus Quest','Target 200','Smok Morph','Asmodus Minikin','Wismec Reuleaux','Hadron 220','SnowWolf Mfeng','Armour Pro','Aegis Max 100','Argus XT','SXmini X Class'],
  boro:['BP Mods Pioneer','VapeSnail','Wick\u0027d Remix','Bridg\u0027d','SXK Billet Box Boro','Atmizoo Vapesnail','Mission XV Switch','QP Juggerknot Boro','Wick\u0027d Trinity','TMD Boro','VapeSnail 1.5','DotMod Boro Tank','Mobb Mini Boro','Espire Brusko','Steam Tuners Snail','Vapor Giant Boro','Atmomixani Boro','Wick\u0027d Cerberus','Billet Box Rev4 Boro','Mission Compact'],
  aio:['Dovpo Abyss','DAMN Vape Fresh AIO','Cthulhu AIO','Pulse AIO','SXK Billet Box','DotMod dotAIO V2','Aspire Boxx','Dovpo Riva','Centaurus B80','Billet Box Rev4','Cthulhu AIO v2','Pulse AIO Mini','Abyss 2.0','SXK BB 70','Stubby AIO','dotAIO SE','Aspire Raga','Boxx v2','Bilby AIO','Tesla AIO'],
  custom:['Dope Customs','Warp Moon','Asgard Titan','Valhalla 30mm','SleepTrigger','Purge Mods','Vicious Ant','Kennedy Vindicator','Deathwish Modz','HMM Mods','Basic Vaper','SVB Mods','AVS Mods','Archer Mods','Guardian Mods','RSA Mods','Shock Mods','Empire Mods','Armageddon MFG','Bogan Mods'],
  juice:['Nasty Slow Blow','Dinner Lady Lemon Tart','Jam Monster Strawberry','Pacha Mama Fuji Apple','Twelve Monkeys Mangabeys','Bad Drip Farley\u0027s Gnarly','Killer Kustard','Humble Sweater Puppies','Naked 100 Lava Flow','Air Factory Blue Razz','Mr. Freeze Blue Slushie','Daze Mango','Sailor Man Peach Berry','Billionaire Oil Orange County','Buck Naked Mello','Loaded Glazed Donut','Ruthless Grape Drank','Betty by Pinup','Vape Wild Strawberry','Zap Juice Watermelon'],
  wata:['Cotton Bacon Prime','Cotton Bacon V2','Koh Gen Do','Firebolt','Muji Hemp','Native Wicks Threads','Bacon Bits','Firebolt 2.0','Cotton Labo Puff','Wick & Wire','Kendo Gold','Mavaton Cotton','Organic Cotton 100%','Vapefly Cotton','Japanese Pads','Cotton Bacon X','WickStation','Cotton Clouds','Xfiber Cotton','Eyce Cotton'],
  coils:['Alien Clapton','Fused Clapton','Tiger Coil','Ni80 Wire','Kanthal A1','SS316L','Titanium Wire','Mesh 0.16','Clapton 26/32','Framed Staple','Staggered Fused','Juggernaut Coil','Flat Twisted','Parallel Coil','Micro Coil','Ni200 Wire','Nichrome 80','Prebuilt 5-pack','Zeus Mesh Coil','GT Mesh'],
  accums:['Sony VTC5A','Sony VTC6','Sony VTC4','Samsung 25R','Samsung 30Q','Samsung 40T','Samsung 50E','LG HG2','LG HB6','LG M50','Molicel P26A','Molicel P42A','Molicel M50A','Molicel P30B','Hohm Life','Hohm Work','Golisi S35','Vapcell N40','Efest 28A','Basen 21700']
};

var ITEMS = (function(){
  var plans = {
    tanks:{p0:260,gr:1.23,f:function(i){return {c_add:1+Math.floor(i/3),click_p:5+i*3};}},
    pods:{p0:240,gr:1.23,f:function(i){return {a_add:1+Math.floor(i/3),auto_p:5+i*3};}},
    mods:{p0:420,gr:1.24,f:function(i){return {click_p:10+i*5};}},
    boro:{p0:300,gr:1.24,f:function(i){return {auto_p:10+i*4,daily_p:5+Math.floor(i/2)};}},
    aio:{p0:380,gr:1.24,f:function(i){return {click_p:10+i*3,auto_p:10+i*3};}},
    custom:{p0:400,gr:1.25,f:function(i){return {click_p:10+i*3,crit_p:5+i,daily_p:5+Math.floor(i/3)};}},
    juice:{p0:180,gr:1.22,f:function(i){return {daily_p:10+i*3,crit_p:5+i};}},
    wata:{p0:160,gr:1.22,f:function(i){return {c_add:1+Math.floor(i/2)};}},
    coils:{p0:200,gr:1.23,f:function(i){return {auto_p:5+i*4,crit_p:5+Math.floor(i/3)};}},
    accums:{p0:300,gr:1.23,f:function(i){return {click_p:8+i*4};}}
  };
  var out = {};
  SECTIONS.forEach(function(sec){
    var names = BASE_NAMES[sec.id] || [];
    for (var i=0;i<CFG.SHOP_COUNT;i++){
      var id = sec.id+'_'+(i+1);
      var name = names[i] || (sec.label+' #'+(i+1));
      var price = Math.round(plans[sec.id].p0*Math.pow(plans[sec.id].gr,i)/5)*5;
      out[id] = {id:id,section:sec.id,icon:sec.icon,name:name,price:price,b:plans[sec.id].f(i)};
    }
  });
  return out;
})();

var RANKS = [[0,'😶 Новичок'],[50,'🫁 Парочек'],[200,'💨 Вейпер'],[500,'🌪 Клубист'],[1500,'🔥 Гуру пара'],[4000,'👑 Легенда вейпа']];

var PUFF_LINES = ['🌫 Малиновый туман!','🔥 Накрутил свежий койл!','🍓 Вкуснее, чем у соседа!','💨 Облако знатное!','⚡ 0.15 Ом — чистая мощь!','🧊 Ментол бодрит!','🍋 Лимонный тарт на подходе!','🛠 Вата свежая, вкус идеален!','🌊 Океан пара!','🍇 Виноградный взрыв!','🧁 Кремовый слоёк!','🥤 Сладкий льдинка-бласт!','🌀 Койл раскалился!','💨 Чистый клубинг!','⚔️ Летит в топ!','🌙 Пар в ночи!','☁️ Облако-легенда!','⚡ Ватт на максимум!','🧃 Жижа поёт!','🔊 Дымовой экран!','🔥 Горячий пар!','❄️ Ледяной туман!','🍬 Конфетный вкус!','🍉 Арбузный свежак!','🥝 Киви-удар!','🍑 Персиковый закат!','🌋 Вулкан пара!','🛸 НЛО заметило облако!','👾 Геймерский затяг!','🎆 Праздничный дым!','🏆 Рекордный клуб!','🌀 Спираль койла!','💎 Премиальный пар!','🍭 Сладкая вата!','🌺 Цветочный букет!','🥥 Тропики в лёгких!'];

function rnd(from,to){return Math.floor(Math.random()*(to-from+1))+from;}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}
function todayStr(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function yesterdayStr(){var d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

function defaultSave(){
  return {
    tg:'guest', name:'', username:'',
    coins:0, clicks:0, lifetime:0,
    clickPower:1, autoLevel:0, critLevel:0,
    cAdd:0,aAdd:0,critP:0,clickP:0,autoP:0,dailyP:0,
    owned:[], lastDaily:null, dailyCount:0, streak:0, lastStreak:null,
    lastActive:null, offlineTotal:0,
    prestige:0, turboUntil:0, turboCount:0,
    gamesPlayed:0, gamesWins:0,
    questDate:null, questId:null, questTarget:0, questProgress:0, questClaimed:0, questReward:0, questDone:0,
    referrals:0, referrerId:0, ach:[],
    clan:null, notifications:[], unread:0,
    createdAt:Date.now()
  };
}

function pushNotify(s, icon, text){
  s.notifications.unshift({icon:icon, text:text, ts:Date.now()});
  if(s.notifications.length>CFG.NOTIF_CAP) s.notifications.length=CFG.NOTIF_CAP;
  s.unread = (s.unread||0)+1;
}
function notifTime(ts){
  try{ return new Date(ts).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; }
}

function upgCost(kind, level){
  var base = kind==='click'?CFG.CLICK_BASE:kind==='auto'?CFG.AUTO_BASE:CFG.CRIT_BASE;
  var exp = kind==='click'?(level-1):level;
  return Math.max(10, Math.round(base*Math.pow(CFG.GROWTH, exp)));
}

function clanLevelOf(score){ return Math.max(1, Math.min(CFG.CLAN_MAX_LVL, 1+Math.floor((score||0)/CFG.CLAN_SCORE_PER_LVL))); }
function clanBonusOf(level){ return Math.min(CFG.CLAN_MAX_BONUS, (level||1)-1); }

function totalClickPower(s){
  var b = ((s.clickPower+s.cAdd)*(100+Math.min(s.clickP,CFG.CAP_CLICK_P))/100)|0;
  b = Math.round(b*(100+Math.min(s.prestige,CFG.MAX_PRESTIGE)*10)/100);
  if(s.clan) b = Math.round(b*(100+clanBonusOf(s.clan.level))/100);
  return Math.max(1,b);
}
function totalAuto(s){
  var b = ((s.autoLevel+s.aAdd)*(100+Math.min(s.autoP,CFG.CAP_AUTO_P))/100)|0;
  if(s.clan) b = Math.round(b*(100+clanBonusOf(s.clan.level))/100);
  return Math.max(0,b);
}
function totalCrit(s){ return Math.min(CFG.CAP_CRIT, s.critLevel*5+s.critP); }
function dailyBase(s){ return ((100+s.clickPower*8+s.autoLevel*10+s.critLevel*8)*(100+Math.min(s.dailyP,CFG.CAP_DAILY))/100)|0; }
function prestigeCost(s){ return CFG.PRESTIGE_BASE + CFG.PRESTIGE_STEP*s.prestige; }
function turboActive(s){ return Date.now()/1000 < s.turboUntil; }
function rankOf(clicks){ var n=RANKS[0][1]; for(var i=0;i<RANKS.length;i++){ if(clicks>=RANKS[i][0]) n=RANKS[i][1]; } return n; }
function nextRank(clicks){ for(var i=0;i<RANKS.length;i++){ if(clicks<RANKS[i][0]) return {name:RANKS[i][1],need:RANKS[i][0]-clicks}; } return null; }

/* ---- Квесты ---- */
var QUEST_TYPES = [
  {id:'puffs', desc:function(n){return 'Сделай '+n+' затяжек';}, t:function(){return rnd(30,120);}, kind:'puffs'},
  {id:'games', desc:function(n){return 'Сыграй '+n+' игр';}, t:function(){return rnd(5,15);}, kind:'games'},
  {id:'wins', desc:function(n){return 'Выиграй '+n+' игр';}, t:function(){return rnd(2,8);}, kind:'wins'},
  {id:'buys', desc:function(n){return 'Купи '+n+' предметов';}, t:function(){return rnd(3,10);}, kind:'buys'},
  {id:'crits', desc:function(n){return 'Сделай '+n+' критов';}, t:function(){return rnd(10,30);}, kind:'crits'},
  {id:'offline', desc:function(n){return 'Получи '+n+' 💨 офлайн-дохода';}, t:function(){return rnd(2000,8000);}, kind:'offline'},
  {id:'turbo', desc:function(n){return 'Активируй турбо '+n+' раз';}, t:function(){return rnd(1,2);}, kind:'turbo'}
];
function questReward(s){ return 300 + s.clickPower*5 + s.autoLevel*5 + Math.round(dailyBase(s)*0.2); }
function assignQuest(s, force){
  if(!force && s.questDate===todayStr() && s.questId) return;
  var q = pick(QUEST_TYPES);
  s.questDate = todayStr(); s.questId = q.id; s.questTarget = q.t(); s.questProgress = 0; s.questClaimed = 0;
  s.questReward = questReward(s);
}
function bumpQuest(s, kind, amount){
  if(s.questDate!==todayStr() || !s.questId || s.questClaimed) return;
  var q = null;
  for(var i=0;i<QUEST_TYPES.length;i++) if(QUEST_TYPES[i].id===s.questId) q=QUEST_TYPES[i];
  if(q && q.kind===kind) s.questProgress = Math.min(s.questTarget, s.questProgress+(amount||1));
}
function claimQuest(s){
  if(s.questDate!==todayStr() || !s.questId || s.questClaimed || s.questProgress<s.questTarget) return null;
  s.questClaimed=1; s.questDone++; s.coins+=s.questReward;
  pushNotify(s,'📋','Квест выполнен: +'+s.questReward+' 💨');
  return s.questReward;
}

/* ---- Достижения ---- */
var ACHIEVEMENTS = [
  {id:'first_puff',name:'🫁 Первый пар',desc:'Сделай первую затяжку',c:function(s){return s.clicks>=1;}},
  {id:'puffs_100',name:'💨 Сотка',desc:'100 затяжек',c:function(s){return s.clicks>=100;}},
  {id:'puffs_500',name:'🌪 Клубист',desc:'500 затяжек',c:function(s){return s.clicks>=500;}},
  {id:'vapor_1000',name:'☁️ Облако 1000',desc:'1000 💨 за всё время',c:function(s){return s.lifetime>=1000;}},
  {id:'vapor_10000',name:'🌫 Облако 10K',desc:'10000 💨 за всё время',c:function(s){return s.lifetime>=10000;}},
  {id:'shop_5',name:'🛒 Шопоголик',desc:'Купи 5 предметов',c:function(s){return s.owned.length>=5;}},
  {id:'shop_15',name:'🧱 Коллекционер',desc:'Купи 15 предметов',c:function(s){return s.owned.length>=15;}},
  {id:'shop_all',name:'👑 Легендарный арсенал',desc:'Купи все 200 предметов',c:function(s){return s.owned.length>=200;}},
  {id:'daily_3',name:'🗓 Три дня',desc:'Забери дневную 3 раза',c:function(s){return s.dailyCount>=3;}},
  {id:'daily_10',name:'📅 Завсегдатай',desc:'10 дневных',c:function(s){return s.dailyCount>=10;}},
  {id:'games_1',name:'🎰 Первая ставка',desc:'Сыграй 1 игру',c:function(s){return s.gamesPlayed>=1;}},
  {id:'games_5',name:'🎲 Везунчик',desc:'Выиграй 5 игр',c:function(s){return s.gamesWins>=5;}},
  {id:'offline_10k',name:'😴 Сонный магнат',desc:'10000 💨 офлайн',c:function(s){return s.offlineTotal>=10000;}},
  {id:'prestige_1',name:'✨ Первый престиж',desc:'Соверши перерождение',c:function(s){return s.prestige>=1;}},
  {id:'prestige_3',name:'🌟 Мастер перерождений',desc:'3 престижа',c:function(s){return s.prestige>=3;}},
  {id:'turbo_1',name:'⚡ Турбо-старт',desc:'Активируй турбо 1 раз',c:function(s){return s.turboCount>=1;}},
  {id:'quest_7',name:'📋 Квест-мастер',desc:'Выполни 7 квестов',c:function(s){return s.questDone>=7;}},
  {id:'streak_7',name:'📆 Неделя пара',desc:'Серия 7 дней',c:function(s){return s.streak>=7;}},
  {id:'clan_1',name:'🏰 В клане',desc:'Создай клан',c:function(s){return !!s.clan;}},
  {id:'ref_1',name:'🧲 Первый друг',desc:'Приведи друга',c:function(s){return s.referrals>=1;}}
];
function checkAch(s){
  var fresh = [];
  for(var i=0;i<ACHIEVEMENTS.length;i++){
    var a=ACHIEVEMENTS[i];
    if(s.ach.indexOf(a.id)===-1 && a.c(s)){ s.ach.push(a.id); fresh.push(a); pushNotify(s,'🏅',a.name+' — '+a.desc); }
  }
  return fresh;
}

/* ---- Офлайн-доход ---- */
function offlineGain(s){
  var now = Date.now();
  if(!s.lastActive){ s.lastActive=now; return 0; }
  var minutes = Math.floor((now - new Date(s.lastActive).getTime())/60000);
  if(minutes < CFG.OFFLINE_MIN_MIN){ s.lastActive=now; return 0; }
  var gain = Math.round(totalAuto(s)*CFG.TICKS_PER_MIN*Math.min(minutes,CFG.OFFLINE_MAX_MIN));
  if(gain>0){
    s.coins+=gain; s.lifetime+=gain; s.offlineTotal+=gain;
    pushNotify(s,'🌙','Офлайн-доход: +'+gain+' 💨 ('+Math.min(minutes,CFG.OFFLINE_MAX_MIN)+' мин)');
    bumpQuest(s,'offline',gain);
  }
  s.lastActive=now;
  return gain;
}

/* ---- Реферальная система (бот @ded_cmbot) ---- */
function inviteLink(s){
  var base = 'https://t.me/'+BOT_USERNAME;
  if(BOT_APP_SHORT) return base+'/'+BOT_APP_SHORT+'?startapp=ref_'+s.tg;
  return base+'?startapp=ref_'+s.tg;
}
function inviteViaBot(s){ return 'https://t.me/'+BOT_USERNAME+'?start=ref_'+s.tg; }
function botChatLink(){ return 'https://t.me/'+BOT_USERNAME; }
function botLinkMeLink(s){ return 'https://t.me/'+BOT_USERNAME+'?start=link_'+s.tg; }
function applyReferral(s, startParam){
  if(!startParam || startParam.indexOf('ref_')!==0) return null;
  var ref = parseInt(startParam.slice(4),10);
  if(!ref || String(ref)===String(s.tg) || s.referrerId) return null;
  s.referrerId = ref;
  s.coins += CFG.REF_BONUS_INV;
  pushNotify(s,'🎁','По ссылке друга: +'+CFG.REF_BONUS_INV+' 💨');
  return {bonus:CFG.REF_BONUS_INV, ref:ref};
}

/* ---- Клик ---- */
function doClick(s){
  var now = Date.now();
  var crit = Math.random()*100 < totalCrit(s);
  var gain = totalClickPower(s)*(crit?2:1);
  var turbo = turboActive(s);
  if(turbo) gain*=3;
  var line = PUFF_LINES[Math.floor(Math.random()*PUFF_LINES.length)];
  s.coins+=gain; s.clicks+=1; s.lifetime+=gain; s.lastActive=now;
  bumpQuest(s,'puffs',1);
  if(crit) bumpQuest(s,'crits',1);
  return {gain:gain, crit:crit, turbo:turbo, line:line};
}

/* ---- Покупки ---- */
function buyItem(s, id){
  var it = ITEMS[id];
  if(!it) return {ok:false,msg:'Нет такого товара'};
  if(s.owned.indexOf(id)!==-1) return {ok:false,msg:'Уже в арсенале ✅'};
  if(s.coins < it.price) return {ok:false,msg:'Не хватает 💨: нужно '+it.price};
  s.coins-=it.price; s.owned.push(id);
  var b=it.b;
  s.cAdd+=b.c_add||0; s.aAdd+=b.a_add||0; s.critP+=b.crit_p||0;
  s.clickP+=b.click_p||0; s.autoP+=b.auto_p||0; s.dailyP+=b.daily_p||0;
  bumpQuest(s,'buys',1);
  checkAch(s);
  return {ok:true,msg:it.name+' куплен!'};
}
function buyUpgrade(s, kind){
  var lvl = kind==='click'?s.clickPower:kind==='auto'?s.autoLevel:s.critLevel;
  var cost = upgCost(kind,lvl);
  if(s.coins<cost) return {ok:false,msg:'Нужно '+cost+' 💨'};
  s.coins-=cost;
  if(kind==='click') s.clickPower++; else if(kind==='auto') s.autoLevel++; else s.critLevel++;
  var lbl = kind==='click'?'🧶 Вата':kind==='auto'?'🌀 Койл':'🧪 Крит-мод';
  return {ok:true,msg:lbl+' → ур. '+(lvl+1)};
}

/* ---- Ежедневно ---- */
function claimDaily(s){
  var today = todayStr();
  if(s.lastDaily===today) return {ok:false,msg:'Уже забирал сегодня!'};
  var yesterday = yesterdayStr();
  s.streak = (s.lastStreak===yesterday)?(s.streak+1):1;
  s.lastStreak=today; s.lastDaily=today; s.dailyCount++;
  var mult = 1 + Math.min(Math.max(s.streak-1,0),30)*0.02;
  var reward = Math.round(dailyBase(s)*mult);
  s.coins+=reward;
  pushNotify(s,'🎁','Дневная заправка: +'+reward+' 💨'+(s.streak>=2?' (серия '+s.streak+')':''));
  return {ok:true,msg:'+'+reward+' 💨'+(s.streak>=2?' (серия '+s.streak+' дн.! )':''), streak:s.streak};
}

/* ---- Престиж ---- */
function doPrestige(s){
  var cost = prestigeCost(s);
  if(s.coins<cost) return {ok:false,msg:'Нужно '+cost+' 💨'};
  s.coins=0; s.clicks=0; s.clickPower=1; s.autoLevel=0; s.critLevel=0;
  s.cAdd=0;s.aAdd=0;s.critP=0;s.clickP=0;s.autoP=0;s.dailyP=0;
  s.owned=[]; s.prestige++;
  pushNotify(s,'✨','Престиж '+s.prestige+'! +10% к затяжке навсегда');
  return {ok:true,msg:'✨ Престиж '+s.prestige+'! +10% к затяжке'};
}

/* ---- Турбо ---- */
function buyTurbo(s){
  if(turboActive(s)) return {ok:false,msg:'Турбо уже активен!'};
  if(s.coins<CFG.TURBO_COST) return {ok:false,msg:'Нужно '+CFG.TURBO_COST+' 💨'};
  s.coins-=CFG.TURBO_COST; s.turboUntil=Date.now()/1000+CFG.TURBO_SEC; s.turboCount++;
  bumpQuest(s,'turbo',1);
  pushNotify(s,'⚡','Турбо x3 на 2 минуты!');
  return {ok:true,msg:'⚡ Турбо x3 на 2 минуты!'};
}

/* ---- Кланы (локальные, без рейтинга) ---- */
function clanCreate(s, name){
  name=(name||'').trim();
  if(s.clan) return {ok:false,msg:'Ты уже в клане'};
  if(name.length<2||name.length>20) return {ok:false,msg:'Название 2-20 символов'};
  if(s.coins<CFG.CLAN_COST) return {ok:false,msg:'Нужно '+CFG.CLAN_COST+' 💨'};
  s.coins-=CFG.CLAN_COST;
  s.clan={name:name, code:rnd(100000,999999), score:0, contributed:0, level:1, createdAt:Date.now()};
  pushNotify(s,'🏰','Клан «'+name+'» создан! Код: '+s.clan.code);
  checkAch(s);
  return {ok:true,msg:'🏰 Клан «'+name+'» создан! Код: '+s.clan.code+' (сохрани его)'};
}
function clanContribute(s, amount){
  amount = parseInt(amount,10)||0;
  if(!s.clan) return {ok:false,msg:'Ты не в клане'};
  if(amount<CFG.CLAN_MIN_CONTRIB) return {ok:false,msg:'Минимум '+CFG.CLAN_MIN_CONTRIB+' 💨'};
  if(s.coins<amount) return {ok:false,msg:'Не хватает 💨'};
  s.coins-=amount; s.clan.contributed+=amount; s.clan.score+=amount;
  var lvl = clanLevelOf(s.clan.score);
  if(lvl>s.clan.level){
    s.clan.level=lvl;
    pushNotify(s,'🏰','Клан «'+s.clan.name+'» достиг '+lvl+' ур.! Бонус +'+clanBonusOf(lvl)+'%');
    return {ok:true,msg:'🎉 Клан достиг '+lvl+' уровня! Бонус +'+clanBonusOf(lvl)+'%', levelUp:true};
  }
  return {ok:true,msg:'+'+amount+' 💨 вложено в клан'};
}
function clanLeave(s){
  if(!s.clan) return {ok:false,msg:'Ты не в клане'};
  s.clan=null;
  pushNotify(s,'🚪','Ты покинул клан');
  return {ok:true,msg:'Ты вышел из клана'};
}

/* ---- Рейтинг (ручное обновление) ---- */
function lbCache(){ if(typeof localStorage==='undefined') return []; try{ var r=localStorage.getItem('vc_board'); return r?JSON.parse(r):[]; }catch(e){ return []; } }
function lbSave(arr){ try{ localStorage.setItem('vc_board', JSON.stringify(arr)); }catch(e){} }
function lbLoad(){
  if(!SYNC_URL) return Promise.resolve(null);
  return fetch(SYNC_URL,{headers:{'X-Master-Key':SYNC_TOKEN}}).then(function(r){ return r.json(); }).catch(function(){ return null; });
}
function lbPush(s){
  if(!SYNC_URL) return Promise.resolve(false);
  return fetch(SYNC_URL,{method:'POST',headers:{'Content-Type':'application/json','X-Master-Key':SYNC_TOKEN,'X-Bin-ID':SYNC_BIN},
    body:JSON.stringify({id:''+s.tg, name:s.name||('id'+s.tg), coins:s.coins, lifetime:s.lifetime, clicks:s.clicks, prestige:s.prestige})})
    .then(function(){ return true; }).catch(function(){ return false; });
}

/* ---- Игры ---- */
function finishGame(s, won, profit){
  s.gamesPlayed++; if(won) s.gamesWins++;
  s.coins = Math.max(0, s.coins + profit);
  bumpQuest(s,'games',1);
  if(won) bumpQuest(s,'wins',1);
  return profit;
}
function playRoulette(s, betType, num){
  var n=rnd(0,36);
  var red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].indexOf(n)!==-1;
  var win=false,mult=1;
  if(betType==='num'){win=n===num;mult=36;}
  else if(betType==='red'){win=n!==0&&red;mult=2;}
  else if(betType==='black'){win=n!==0&&!red;mult=2;}
  else if(betType==='d1'){win=n>=1&&n<=12;mult=3;}
  else if(betType==='d2'){win=n>=13&&n<=24;mult=3;}
  else if(betType==='d3'){win=n>=25&&n<=36;mult=3;}
  return {n:n,red:red,win:win,mult:mult};
}
function playDice(s, dtype){ var a=rnd(1,6),b=rnd(1,6),t=a+b; var win=(dtype==='gt'&&t>7)||(dtype==='lt'&&t<7)||(dtype==='eq'&&t===7); return {a:a,b:b,total:t,win:win,mult:dtype==='eq'?5:2}; }
function playCoin(){ return {heads:Math.random()<0.5}; }
function makeDeck(){ var suits=['♠','♥','♦','♣'],faces=[]; for(var i=2;i<=10;i++) faces.push(String(i)); faces=faces.concat(['J','Q','K','A']); var d=[]; for(var s2=0;s2<4;s2++) for(var f=0;f<faces.length;f++) for(var c=0;c<6;c++) d.push({v:faces[f],s:suits[s2]}); for(var i2=d.length-1;i2>0;i2--){var j=Math.floor(Math.random()*(i2+1));var t=d[i2];d[i2]=d[j];d[j]=t;} return d; }
function cardVal(c){ var v=c.v; if(v==='A')return 11; if(v==='K'||v==='Q'||v==='J')return 10; return parseInt(v,10); }
function handVal(hand){ var sum=0,aces=0; for(var i=0;i<hand.length;i++){ var v=cardVal(hand[i]); if(v===11)aces++; sum+=v; } while(sum>21&&aces>0){sum-=10;aces--;} return sum; }
function bjState(){ return {deck:makeDeck(),hand:[],bank:[],doubled:false,done:false,result:''}; }
function bjDeal(st){ st.hand.push(st.deck.pop(),st.deck.pop()); st.bank.push(st.deck.pop()); return st; }
function bjHit(st){ st.hand.push(st.deck.pop()); if(handVal(st.hand)>21) bjFinish(st); return st; }
function bjFinish(st){ var hv=handVal(st.hand); if(st.bank.length<2) st.bank.push(st.deck.pop()); while(handVal(st.bank)<17) st.bank.push(st.deck.pop()); var bv=handVal(st.bank); if(hv>21) st.result='lose'; else if(bv>21) st.result='win'; else if(hv>bv) st.result='win'; else if(hv<bv) st.result='lose'; else st.result='draw'; st.done=true; return st; }
function minesInit(){ var cells=[false,false,false,false,false,false,false,false,false]; var placed=0; while(placed<2){ var i=rnd(0,8); if(!cells[i]){cells[i]=true;placed++;} } return {mines:cells,revealed:0,boom:false,done:false,mult:1.2}; }
var MINE_MULTS=[1.2,1.4,1.6,1.8,2.0,2.5,3.0];
function mineReveal(st,idx){ if(st.done||st.boom) return st; if(st.mines[idx]){st.boom=true;st.done=true;st.won=false;return st;} st.revealed++; if(st.revealed===7){st.done=true;st.won=true;st.mult=MINE_MULTS[6];} else st.mult=MINE_MULTS[Math.min(st.revealed-1,6)]; return st; }
function mineCashout(st){ if(st.done) return st; if(st.revealed<1){st.done=true;st.won=false;return st;} st.done=true; st.won=true; return st; }

/* ================= UI ================= */
var Tg = null;
if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) Tg = window.Telegram.WebApp;
var S = null, tab = 'home', modal = null, shopSec = null, shopPage = 0, gameCtx = null;
var _bjGame = null, _minesGame = null;

function loadSave(){
  var uid = 'guest';
  if(Tg && Tg.initDataUnsafe && Tg.initDataUnsafe.user) uid = String(Tg.initDataUnsafe.user.id);
  var key = 'vc_save_'+uid;
  var raw = null; try{ raw = localStorage.getItem(key); }catch(e){}
  var s = defaultSave(); s.tg = uid;
  if(Tg && Tg.initDataUnsafe && Tg.initDataUnsafe.user){ var u=Tg.initDataUnsafe.user; s.name=u.first_name||''; s.username=u.username||''; }
  if(raw){ try{ var p=JSON.parse(raw); for(var k in p) if(p.hasOwnProperty(k) && k!=='tg') s[k]=p[k]; }catch(e){} }
  assignQuest(s,false);
  var off = offlineGain(s);
  var refMsg = null;
  if(Tg && Tg.initDataUnsafe && Tg.initDataUnsafe.start_param) refMsg = applyReferral(s, Tg.initDataUnsafe.start_param);
  save();
  return {save:s, offline:off, refMsg:refMsg};
}
function save(){ try{ localStorage.setItem('vc_save_'+S.save.tg, JSON.stringify(S.save)); }catch(e){} }
function fmt(n){ try{ return Math.round(n).toLocaleString('ru-RU'); }catch(e){ return ''+n; } }
function bonusStr(b){ var parts=[]; if(b.c_add)parts.push('+'+b.c_add+' 💨 затяжка'); if(b.a_add)parts.push('+'+b.a_add+' 💨 авто'); if(b.click_p)parts.push('+'+b.click_p+'% затяжка'); if(b.auto_p)parts.push('+'+b.auto_p+'% авто'); if(b.crit_p)parts.push('+'+b.crit_p+'% крит'); if(b.daily_p)parts.push('+'+b.daily_p+'% дневной'); return parts.join(', ')||'—'; }

function render(){
  var s = S.save;
  document.getElementById('balance-top').textContent = '💰 '+fmt(s.coins);
  var badge = document.getElementById('bell-badge');
  if(s.unread>0){ badge.textContent = s.unread>9?'9+':String(s.unread); badge.classList.add('show'); }
  else badge.classList.remove('show');
  var scr = document.getElementById('screen');
  document.querySelectorAll('.navbtn').forEach(function(b){ b.classList.toggle('active', b.dataset.arg===tab); });
  if(tab==='home') scr.innerHTML = homeHtml(s);
  else if(tab==='shop') scr.innerHTML = shopHtml(s);
  else if(tab==='games') scr.innerHTML = gamesHtml(s);
  else if(tab==='quest') scr.innerHTML = questHtml(s);
  else if(tab==='clan') scr.innerHTML = clanHtml(s);
  else if(tab==='profile') scr.innerHTML = profileHtml(s);
  renderModal();
}
function homeHtml(s){
  var tot={c:totalClickPower(s),a:totalAuto(s),cr:totalCrit(s)}, turbo=turboActive(s), nxt=nextRank(s.clicks);
  var h='<div class="clickzone"><button class="bigbtn" data-act="click">💨</button>'+
    '<div class="clickinfo">💨 Затянуться (<span class="plus">+'+fmt(tot.c)+'</span>'+(turbo?' · ⚡x3':'')+')</div>'+
    '<div class="puffline" id="puffline"></div></div>';
  h+='<div class="card glow"><div class="stat"><span>⭐ Ранг</span><b>'+rankOf(s.clicks)+'</b></div>';
  if(nxt) h+='<div class="stat"><span>До «'+nxt.name+'»</span><b>'+fmt(nxt.need)+' затяжек</b></div>';
  h+='<div class="stat"><span>⚡ Затяжка</span><b>'+fmt(tot.c)+' 💨</b></div>'+
    '<div class="stat"><span>🌀 Автофарм</span><b>'+fmt(tot.a)+' 💨/'+CFG.TICK_SEC+'с</b></div>'+
    '<div class="stat"><span>🧪 Крит</span><b>'+tot.cr+'%</b></div>'+
    '<div class="stat"><span>✨ Престиж</span><b>'+s.prestige+' (+'+Math.min(s.prestige,CFG.MAX_PRESTIGE)*10+'%)</b></div>'+
    (s.clan?'<div class="stat"><span>🏰 Клан</span><b>«'+s.clan.name+'» ур.'+s.clan.level+' (+'+clanBonusOf(s.clan.level)+'%)</b></div>':'')+
    (turbo?'<div class="stat"><span>⚡ Турбо x3</span><b>'+Math.ceil(s.turboUntil-Date.now()/1000)+' сек</b></div>':'')+'</div>';
  h+='<div class="grid2">'+
    '<button class="btn ghost small" data-act="daily">🎁 Дневная</button>'+
    '<button class="btn gold small" data-act="turbo">⚡ Турбо x3<br><span class="muted">'+fmt(CFG.TURBO_COST)+' 💨</span></button>'+
    '<button class="btn green small" data-act="prestige">✨ Престиж</button>'+
    '<button class="btn ghost small" data-act="invite">🔗 Пригласить</button>'+
  '</div>';
  return h;
}
function shopHtml(s){
  var h='<div class="h1">🛒 ВейпШоп</div><div class="muted" style="margin-bottom:4px">💰 '+fmt(s.coins)+' 💨 · Арсенал '+s.owned.length+'/200</div>';
  h+='<div class="h2">⚙️ Прокачка</div><div class="grid3">'+
    '<button class="btn small" data-act="upgrade" data-arg="click">🧶 Вата<br><span class="muted">ур. '+s.clickPower+' · '+fmt(upgCost('click',s.clickPower))+'</span></button>'+
    '<button class="btn small" data-act="upgrade" data-arg="auto">🌀 Койл<br><span class="muted">ур. '+s.autoLevel+' · '+fmt(upgCost('auto',s.autoLevel))+'</span></button>'+
    '<button class="btn small" data-act="upgrade" data-arg="crit">🧪 Крит<br><span class="muted">ур. '+s.critLevel+' · '+fmt(upgCost('crit',s.critLevel))+'</span></button>'+
  '</div>';
  h+='<div class="h2">📦 Разделы</div>';
  SECTIONS.forEach(function(sec){
    h+='<button class="sectionbtn" data-act="shopsec" data-arg="'+sec.id+'"><span class="sec-ic">'+sec.icon+'</span><span class="txt">'+sec.label+'<small>20 товаров</small></span><small>→</small></button>';
  });
  return h;
}
function sectionModalHtml(s,sec,page){
  var items=[]; for(var id in ITEMS){ if(ITEMS[id].section===sec) items.push(ITEMS[id]); }
  items.sort(function(a,b){return a.price-b.price;});
  var pages=Math.ceil(items.length/CFG.SHOP_PER_PAGE); page=Math.max(0,Math.min(page,pages-1));
  var slice=items.slice(page*CFG.SHOP_PER_PAGE,(page+1)*CFG.SHOP_PER_PAGE);
  var secInfo=SECTIONS.filter(function(x){return x.id===sec;})[0];
  var h='<div class="h1">'+secInfo.icon+' '+secInfo.label+'</div><div class="muted">Баланс '+fmt(s.coins)+' 💨</div>';
  h+='<div class="pager">'+(page>0?'<button class="btn ghost small" data-act="pg" data-arg="'+(page-1)+'">⬅️</button>':'<span></span>')+'<span class="pg">стр. '+(page+1)+'/'+pages+'</span>'+(page<pages-1?'<button class="btn ghost small" data-act="pg" data-arg="'+(page+1)+'">➡️</button>':'<span></span>')+'</div>';
  slice.forEach(function(it){ var owned=s.owned.indexOf(it.id)!==-1;
    h+='<div class="item'+(owned?' owned':'')+'"><div class="ic">'+it.icon+'</div><div class="info">'+
    '<div class="nm">'+it.name+'</div><div class="pr">'+fmt(it.price)+' 💨</div><div class="bd">'+bonusStr(it.b)+'</div></div>'+
    (owned?'<span style="color:var(--green)">✅</span>':'<button class="buybtn" data-act="buy" data-arg="'+it.id+'">Купить</button>')+'</div>';
  });
  return h;
}
function gamesHtml(s){
  return '<div class="h1">🎲 Игры</div><div class="muted">Ставки от '+fmt(CFG.MIN_STAKE)+' 💨. Честно: можно выиграть, можно проиграть!</div>'+
  '<button class="gamecard" data-act="game" data-arg="roulette"><h3>🎡 Рулетка</h3><p>Число x36 · цвет x2 · дюжины x3</p></button>'+
  '<button class="gamecard" data-act="game" data-arg="dice"><h3>🎲 Кубики</h3><p>&gt;7 и &lt;7 — x2 · ровно 7 — x5</p></button>'+
  '<button class="gamecard" data-act="game" data-arg="coin"><h3>🪙 Орёл / Решка</h3><p>50/50, x2</p></button>'+
  '<button class="gamecard" data-act="game" data-arg="blackjack"><h3>🃏 Блэкджек</h3><p>Против банка: взять, хватит, удвоить</p></button>'+
  '<button class="gamecard" data-act="game" data-arg="mines"><h3>💣 Сапёр</h3><p>3×3, 2 мины, множитель растёт</p></button>';
}
function questHtml(s){
  assignQuest(s,false);
  var q=null; for(var i=0;i<QUEST_TYPES.length;i++) if(QUEST_TYPES[i].id===s.questId) q=QUEST_TYPES[i];
  var pct=s.questTarget?Math.floor(s.questProgress/s.questTarget*100):0;
  var h='<div class="h1">📋 Квест дня</div><div class="card">';
  if(!q){ h+='<div class="muted">Квестов нет</div>'; }
  else{
    h+='<div class="stat"><span>🎯 Задание</span><b>'+q.desc(s.questTarget)+'</b></div>'+
      '<div class="stat"><span>✅ Прогресс</span><b>'+s.questProgress+' / '+s.questTarget+'</b></div>'+
      '<div class="progress"><i style="width:'+pct+'%"></i></div>'+
      '<div class="stat"><span>🎁 Награда</span><b>'+fmt(s.questReward)+' 💨</b></div>';
    if(s.questClaimed) h+='<div class="btn green dis">✅ Награда получена</div>';
    else if(s.questProgress>=s.questTarget) h+='<button class="btn green" data-act="claimquest">✅ Забрать награду</button>';
    else h+='<div class="muted">Выполняй — прогресс растёт сам!</div>';
  }
  h+='</div><div class="card"><div class="stat"><span>🗓 Квестов выполнено</span><b>'+s.questDone+'</b></div></div>';
  return h;
}
function clanHtml(s){
  var h='<div class="h1">🏰 Клан</div>';
  if(!s.clan){
    h+='<div class="card"><div class="muted" style="margin-bottom:10px">Ты ещё не в клане. Создай свой — это даёт постоянный бонус к затяжке и автофарму (каждый уровень +1%).</div>'+
    '<button class="btn gold" data-act="clancreate">➕ Создать клан ('+fmt(CFG.CLAN_COST)+' 💨)</button>'+
    '<div class="note">Сейчас клан хранится локально — общие члены и клановый рейтинг появятся с бэкендом. Ссылка на ЛС с ботом: <b>'+botChatLink()+'</b></div></div>';
  } else{
    var l=clanLevelOf(s.clan.score), bns=clanBonusOf(l);
    h+='<div class="card glow"><div class="lvlring"><div class="lvl">'+l+'</div><div><div class="h2" style="margin:0 0 4px">«'+s.clan.name+'»</div><div class="muted">Код: <b style="color:var(--gold)">'+s.clan.code+'</b> · Бонус +'+bns+'%</div></div></div>'+
    '<div class="stat"><span>🎯 Очки</span><b>'+fmt(s.clan.score)+'</b></div>'+
    '<div class="stat"><span>💪 Вложено</span><b>'+fmt(s.clan.contributed)+'</b></div>'+
    '<div class="progress"><i style="width:'+Math.min(100,((s.clan.score%CFG.CLAN_SCORE_PER_LVL)/CFG.CLAN_SCORE_PER_LVL*100))+'%"></i></div>'+
    '<div class="muted">До сл. уровня: '+fmt(CFG.CLAN_SCORE_PER_LVL-(s.clan.score%CFG.CLAN_SCORE_PER_LVL))+' 💨</div></div>'+
    '<div class="h2">Рост</div><div class="card"><button class="btn small" data-act="clancontrib">💪 Вложить в клан</button>'+
    '<div class="chips"><button class="chip" data-act="clanq" data-arg="500">500</button><button class="chip" data-act="clanq" data-arg="1000">1 000</button><button class="chip" data-act="clanq" data-arg="5000">5 000</button></div>'+
    '<button class="btn danger small" data-act="clanleave">🚪 Покинуть клан</button></div>';
  }
  h+='<div class="h2">🏆 Рейтинг</div><div class="card"><div class="muted">Ручное обновление: нажми «Обновить». Сервер не настроен — смотри свой локальный рейтинг и настрой SYNC_URL в app.js для общего.</div>'+
    '<button class="btn small" data-act="leaderboard">🏆 Открыть рейтинг</button></div>';
  return h;
}
function profileHtml(s){
  var tot={c:totalClickPower(s),a:totalAuto(s),cr:totalCrit(s)};
  var h='<div class="h1">👤 Профиль</div><div class="card">'+
    '<div class="stat"><span>👤 Игрок</span><b>'+(s.name||s.tg)+'</b></div>'+
    '<div class="stat"><span>💰 Баланс</span><b>'+fmt(s.coins)+' 💨</b></div>'+
    '<div class="stat"><span>⭐ Ранг</span><b>'+rankOf(s.clicks)+'</b></div>'+
    '<div class="stat"><span>👆 Затяжек</span><b>'+fmt(s.clicks)+'</b></div>'+
    '<div class="stat"><span>☁️ Пар за всё время</span><b>'+fmt(s.lifetime)+' 💨</b></div>'+
    '<div class="stat"><span>🌙 Офлайн-доход (всего)</span><b>'+fmt(s.offlineTotal)+' 💨</b></div>'+
    '<div class="stat"><span>🔥 Серия</span><b>'+s.streak+(s.streak?' дн.':'')+'</b></div>'+
    '<div class="stat"><span>✨ Престиж</span><b>'+s.prestige+'</b></div>'+
    '<div class="stat"><span>🎲 Игры</span><b>'+s.gamesPlayed+' сыграно · '+s.gamesWins+' побед</b></div>'+
    '<div class="stat"><span>🔗 Рефералов</span><b>'+s.referrals+'</b></div>'+
    '<div class="stat"><span>⚡ Затяжка / 🌀 Авто</span><b>'+fmt(tot.c)+' / '+fmt(tot.a)+'</b></div>'+
    '<div class="stat"><span>🧪 Крит</span><b>'+tot.cr+'%</b></div></div>';
  h+='<div class="h2">🔗 Ссылки и связь с ботом</div><div class="card">'+
    '<button class="btn small" data-act="botopen">💬 Написать боту (@'+BOT_USERNAME+')</button>'+
    '<div class="row" style="margin:8px 0"><button class="btn ghost small" data-act="invite">🔗 Пригласить друга</button>'+
    '<button class="btn ghost small" data-act="botsave">📤 Привязать ID к боту</button></div>'+
    '<div class="muted">Бот может слать уведомления в ЛС (офлайн-заработок, приглашённые). Настрой хендлеры в README.</div></div>';
  h+='<div class="h2">🏅 Достижения ('+s.ach.length+'/'+ACHIEVEMENTS.length+')</div><div class="card">';
  ACHIEVEMENTS.forEach(function(a){
    var on = s.ach.indexOf(a.id)!==-1;
    h+='<div class="ach'+(on?'':' locked')+'"><span class="a-ic">'+(on?a.name.slice(0,2):'🔒')+'</span><span>'+a.name+'<br><small class="muted">'+a.desc+'</small></span></div>';
  });
  h+='</div>';
  h+='<div class="h2">🗑 Данные</div><div class="card">'+
    '<div class="muted">Прогресс хранится локально (localStorage).</div>'+
    '<button class="btn danger small" data-act="reset" style="margin-top:8px">🗑 Сбросить прогресс</button></div>';
  return h;
}

/* ---- Модалки ---- */
function openModal(type, data){
  modal = {type:type, data:data||{}};
  if(Tg && Tg.BackButton) Tg.BackButton.show();
  renderModal();
}
function closeModal(){
  modal=null; gameCtx=null; shopSec=null;
  if(Tg && Tg.BackButton) Tg.BackButton.hide();
  render();
}
function renderModal(){
  var root = document.getElementById('modal-root');
  if(!modal){ root.classList.remove('open'); root.innerHTML=''; return; }
  var s = S.save;
  var inner = '';
  var t = modal.type;
  if(t==='section'){
    inner = sectionModalHtml(s, modal.data.sec, modal.data.page||0);
  }
  else if(t==='game_choice'){
    var g = modal.data.game;
    if(g==='roulette'){
      inner = '<div class="h1">🎡 Рулетка</div>' +
        '<div class="grid2">' +
          '<button class="btn small" data-act="stake" data-arg="num" data-game="roulette">🎯 Число x36</button>' +
          '<button class="btn small" data-act="stake" data-arg="red" data-game="roulette">🔴 Красное x2</button>' +
          '<button class="btn small" data-act="stake" data-arg="black" data-game="roulette">⚫ Чёрное x2</button>' +
          '<button class="btn small" data-act="stake" data-arg="d1" data-game="roulette">1-12 x3</button>' +
          '<button class="btn small" data-act="stake" data-arg="d2" data-game="roulette">13-24 x3</button>' +
          '<button class="btn small" data-act="stake" data-arg="d3" data-game="roulette">25-36 x3</button>' +
        '</div>';
    } else if(g==='dice'){
      inner = '<div class="h1">🎲 Кубики</div>' +
        '<div class="grid3">' +
          '<button class="btn small" data-act="stake" data-arg="gt" data-game="dice">&gt;7 x2</button>' +
          '<button class="btn small" data-act="stake" data-arg="lt" data-game="dice">&lt;7 x2</button>' +
          '<button class="btn small" data-act="stake" data-arg="eq" data-game="dice">=7 x5</button>' +
        '</div>';
    } else if(g==='coin'){
      inner = '<div class="h1">🪙 Орёл / Решка</div><div class="muted" style="margin-bottom:10px">50/50, выигрыш x2</div>' +
        '<button class="btn gold" data-act="stake" data-arg="coin">🪙 Сыграть (своя ставка)</button>';
    } else if(g==='blackjack'){
      inner = '<div class="h1">🃏 Блэкджек</div><div class="muted" style="margin-bottom:10px">Против банка. Туз = 11/1, В/Д/К = 10. Собери 21 или перебей банк!</div>' +
        '<button class="btn" data-act="stake" data-arg="blackjack">🃏 Сыграть (своя ставка)</button>';
    } else if(g==='mines'){
      inner = '<div class="h1">💣 Сапёр</div><div class="muted" style="margin-bottom:10px">Поле 3×3 с 2 минами. Открывай клетки — множитель растёт. Мина = проигрыш!</div>' +
        '<button class="btn" data-act="stake" data-arg="mines">💣 Старт (своя ставка)</button>';
    }
    inner += '<button class="btn ghost small" data-act="closemodal" style="margin-top:10px">⬅️ Назад</button>';
  }
  else if(t==='stake'){
    var gname = modal.data.game;
    var gt = {roulette:'🎡 Рулетка',dice:'🎲 Кубики',coin:'🪙 Орёл/Решка',blackjack:'🃏 Блэкджек',mines:'💣 Сапёр'}[gname]||'🎮 Игра';
    var lab = gt+' — ставка на «'+stakeLabel(modal.data.arg)+'»';
    inner = '<div class="h1">'+lab+'</div>' +
      '<input type="number" id="stake-inp" min="'+CFG.MIN_STAKE+'" placeholder="Ставка (мин '+CFG.MIN_STAKE+')">' +
      '<button class="btn" data-act="dogame">🎲 Сыграть</button>' +
      '<button class="btn ghost small" data-act="gameback" data-arg="'+gname+'">⬅️ Назад</button>';
  }
  else if(t==='blackjack'){
    inner = bjHtml(modal.data.st || bjDeal(bjState()));
  }
  else if(t==='mines'){
    inner = minesHtml(modal.data.st || minesInit());
  }
  else if(t==='invite'){
    var link = inviteLink(s);
    var via = inviteViaBot(s);
    inner = '<div class="h1">🔗 Пригласи друга</div>' +
      '<div class="muted">Друг по твоей ссылке получает +'+fmt(CFG.REF_BONUS_INV)+' 💨 на старт!</div>' +
      '<div class="note">📱 Открыть игру:<br><b>'+link+'</b></div>' +
      '<div class="note">📣 Через ЛС бота:<br><b>'+via+'</b></div>' +
      '<div class="row">' +
        '<button class="btn small" data-act="botgame">🔗 Открыть игру</button>' +
        '<button class="btn ghost small" data-act="botvia">📣 Через ЛС бота</button>' +
      '</div>' +
      '<button class="btn ghost small" data-act="copylink" style="margin-top:8px">📋 Скопировать ссылку</button>' +
      '<button class="btn ghost small" data-act="closemodal">Закрыть</button>';
  }
  else if(t==='notify'){
    inner = '<div class="h1">🔔 Уведомления</div>' +
      '<button class="btn ghost small" data-act="notifyclear" style="margin-bottom:10px">🧹 Очистить</button>' +
      '<div class="nlist">';
    if(!s.notifications.length) inner += '<div class="muted">Пока нет уведомлений 😴</div>';
    else s.notifications.forEach(function(n){
      inner += '<div class="nitem"><span class="n-ic">'+n.icon+'</span><span class="n-tx">'+n.text+'</span><span class="n-time">'+notifTime(n.ts)+'</span></div>';
    });
    inner += '</div>';
  }
  else if(t==='leaderboard'){
    inner = leaderboardHtml(s);
  }
  else if(t==='input'){
    inner = '<div class="h1">'+(modal.data.title||'Ввод')+'</div>' +
      '<input type="text" id="inp-val" placeholder="'+(modal.data.placeholder||'')+'">' +
      '<button class="btn" data-act="inputok">✅ Готово</button>' +
      '<button class="btn ghost small" data-act="closemodal">Отмена</button>';
    modal.action = modal.data.action || function(){ return {ok:false,msg:'Нет действия'}; };
  }
  else if(t==='clancontrib'){
    inner = '<div class="h1">💪 Вклад в клан</div>' +
      '<div class="muted">Минимум '+fmt(CFG.CLAN_MIN_CONTRIB)+' 💨. Каждые '+fmt(CFG.CLAN_SCORE_PER_LVL)+' очков — уровень (+1% бонус).</div>' +
      '<div class="chips">' +
        '<button class="chip" data-act="clanq" data-arg="500">500</button>' +
        '<button class="chip" data-act="clanq" data-arg="1000">1 000</button>' +
        '<button class="chip" data-act="clanq" data-arg="5000">5 000</button>' +
      '</div>' +
      '<input type="number" id="inp-val" min="'+CFG.CLAN_MIN_CONTRIB+'" placeholder="Сумма вклада">' +
      '<button class="btn" data-act="inputok">✅ Вложить</button>' +
      '<button class="btn ghost small" data-act="closemodal">Отмена</button>';
    modal.action = function(s2,val){ return clanContribute(s2, parseInt(val,10)||0); };
  }
  else if(t==='prestige'){
    inner = '<div class="h1">✨ Перерождение</div>' +
      '<div class="note">Сбросит монеты, затяжки, прокачку, устройства. Сохранит: достижения, квесты, рефералов, серию.<br><br>Навсегда: <b>+10% к затяжке</b> (до +200%).</div>' +
      '<div class="stat"><span>Стоимость</span><b>'+fmt(prestigeCost(s))+' 💨</b></div>' +
      '<button class="btn danger" data-act="prestigedo">✨ Переродиться</button>' +
      '<button class="btn ghost small" data-act="closemodal">Отмена</button>';
  }
  else if(t==='clanleave'){
    inner = '<div class="h1">🚪 Выйти из клана?</div>' +
      '<div class="note">Ты потеряешь бонусы клана и вложенные очки. Действие нельзя отменить.</div>' +
      '<div class="row">' +
        '<button class="btn ghost" data-act="closemodal">Отмена</button>' +
        '<button class="btn danger" data-act="clanleaveyes">🚪 Выйти</button>' +
      '</div>';
  }
  root.innerHTML = '<div class="mbackdrop" data-act="closemodal"></div><div class="modal">'+inner+'</div>';
  root.classList.add('open');
}
function leaderboardHtml(s){
  var arr = lbCache();
  var h = '<div class="h1">🏆 Рейтинг</div>';
  if(!SYNC_URL) h += '<div class="note">SYNC_URL не настроен — показываю локальный кэш. Для общего рейтинга впиши SYNC_URL/SYNC_TOKEN/SYNC_BIN в начале app.js.</div>';
  h += '<div class="row">' +
    '<button class="btn small" data-act="lbup">🔄 Обновить</button>' +
    '<button class="btn ghost small" data-act="lbsend">📤 Отправить</button>' +
  '</div>';
  h += '<div class="nlist" style="margin-top:10px">';
  if(!arr || !arr.length) h += '<div class="muted">Пока пусто — нажми «📤 Отправить», чтобы попасть в рейтинг.</div>';
  else{
    var sorted = arr.slice().sort(function(a,b){ return ((b.lifetime||0)-(a.lifetime||0)) || ((b.coins||0)-(a.coins||0)); });
    sorted.forEach(function(e,i){
      h += '<div class="rating-row"><span class="place">'+(i+1)+'</span><span class="nm2">'+(e.name||('id'+e.id))+'</span><span class="sc">'+fmt(e.lifetime||0)+' 💨</span></div>';
    });
  }
  h += '</div>';
  return h;
}
function stakeLabel(arg){
  return {num:'🎯 число',red:'🔴 красное',black:'⚫ чёрное',d1:'1-12',d2:'13-24',d3:'25-36',gt:'больше 7',lt:'меньше 7',eq:'ровно 7',coin:'🪙 орёл/решка',blackjack:'🃏 блэкджек',mines:'💣 сапёр'}[arg]||arg;
}
function bjHtml(st){
  var hv = handVal(st.hand), bv = handVal(st.bank);
  var h = '<div class="h1">🃏 Блэкджек</div>';
  h += '<div class="card"><div class="muted">Твои карты:</div><div style="font-size:22px">'+(st.hand.map(function(c){return c.v+c.s;}).join(' '))+'</div><div class="stat"><span>Сумма</span><b>'+hv+'</b></div></div>';
  h += '<div class="card"><div class="muted">Банк '+(st.done?'':('(' + (st.bank[0]?st.bank[0].v+st.bank[0].s:'') + ' + скрытая)'))+'</div><div style="font-size:22px">'+(st.done?st.bank.map(function(c){return c.v+c.s;}).join(' '):((st.bank[0]?st.bank[0].v+st.bank[0].s:'')+' 🂠'))+'</div>'+(st.done?'<div class="stat"><span>Сумма</span><b>'+handVal(st.bank)+'</b></div>':'')+'</div>';
  if(st.done){
    var txt = st.result==='win'?'🎉 ПОБЕДА! (x2)':st.result==='draw'?'🤝 Ничья, ставка вернулась':'💸 ПРОИГРЫШ';
    h += '<div class="card"><b>'+txt+'</b><div class="muted">('+fmt(st.stake||0)+' 💨)</div></div>';
    h += '<button class="btn" data-act="gameback" data-arg="blackjack">🃏 Ещё партию</button>';
  } else {
    h += '<div class="row">' +
      '<button class="btn" data-act="bjhit">➕ Карту</button>' +
      '<button class="btn green" data-act="bjsure">✋ Хватит</button>' +
      (!st.doubled?'<button class="btn gold" data-act="bjdouble">💰 Удвоить</button>':'') +
    '</div>';
  }
  h += '<button class="btn ghost small" data-act="closemodal">В меню игр</button>';
  return h;
}
function minesHtml(st){
  var h = '<div class="h1">💣 Сапёр</div>';
  if(!st.done){
    h += '<div class="stat"><span>Открыто</span><b>'+st.revealed+'/7</b></div>' +
      '<div class="stat"><span>Множитель сейчас</span><b>x'+st.mult.toFixed(1)+'</b></div>';
  }
  h += '<div class="grid3" style="margin:10px 0">';
  for(var i=0;i<9;i++){
    var txt, cls='btn small';
    if(st.boom && st.mines[i]){ txt='💥'; }
    else if(st.revealedCells && st.revealedCells.indexOf(i)!==-1){ txt='✅'; }
    else txt = String(i+1);
    h += '<button class="'+cls+'" data-act="mine" data-arg="'+i+'">'+txt+'</button>';
  }
  h += '</div>';
  if(st.done){
    if(st.won) h += '<div class="card"><b>🎉 ВЫИГРЫШ x'+st.mult.toFixed(1)+' ('+fmt(st.stake||0)+' 💨)</b></div>';
    else h += '<div class="card"><b>💥 БУМ! Проигрыш</b></div>';
    h += '<button class="btn" data-act="gameback" data-arg="mines">💣 Ещё раз</button>';
  } else if(st.revealed>0){
    h += '<button class="btn gold" data-act="minecash">🛑 Забрать x'+st.mult.toFixed(1)+'</button>';
  }
  h += '<button class="btn ghost small" data-act="closemodal">В меню игр</button>';
  return h;
}

/* ---- Действия ---- */
var ACTIONS = {
  tab:function(arg){ tab=arg; render(); if(Tg&&Tg.HapticFeedback) Tg.HapticFeedback.impactOccurred('light'); },
  closemodal:function(){ closeModal(); },
  click:function(){
    var s=S.save; var r=doClick(s);
    if(!r){ toast('⏳ Секундочку...'); return; }
    save();
    var fresh=checkAch(s); if(fresh.length) toast('🏅 '+fresh[0].name);
    render();
    var pl=document.getElementById('puffline');
    if(pl) pl.textContent = (r.crit?'🧪 КРИТ! ':(r.turbo?'⚡ ТУРБО! ':'💨 '))+'+'+fmt(r.gain)+' 💨 '+r.line;
    if(Tg&&Tg.HapticFeedback) Tg.HapticFeedback.impactOccurred('heavy');
  },
  daily:function(){
    var s=S.save; var r=claimDaily(s); save(); checkAch(s); toast(r.msg); render();
  },
  turbo:function(){
    var r=buyTurbo(S.save); save(); checkAch(S.save); toast(r.msg); render();
  },
  prestige:function(){ openModal('prestige'); },
  prestigedo:function(){
    var r=doPrestige(S.save); save(); checkAch(S.save); toast(r.msg); closeModal();
  },
  invite:function(){ openModal('invite'); },
  copylink:function(){
    var link=inviteLink(S.save);
    if(navigator.clipboard){ navigator.clipboard.writeText(link).then(function(){toast('Ссылка скопирована!');}); }
    else toast(link);
  },
  notify:function(){
    var s=S.save;
    if(s.unread){ s.unread=0; save(); }
    openModal('notify');
  },
  notifyclear:function(){
    var s=S.save;
    s.notifications=[]; s.unread=0; save();
    toast('🧹 Уведомления очищены');
    openModal('notify');
  },
  upgrade:function(arg){
    var r=buyUpgrade(S.save,arg); save(); checkAch(S.save); toast(r.msg); render();
  },
  shopsec:function(arg){ shopSec=arg; shopPage=0; openModal('section',{sec:arg,page:0}); },
  pg:function(arg){ openModal('section',{sec:modal.data.sec,page:parseInt(arg,10)}); },
  buy:function(arg){
    var r=buyItem(S.save,arg); save(); var fr=checkAch(S.save); if(fr.length) toast('🏅 '+fr[0].name); toast(r.msg);
    openModal('section',{sec:modal?modal.data.sec:shopSec,page:shopPage});
  },
  game:function(arg){ gameCtx={game:arg}; openModal('game_choice',{game:arg}); },
  gameback:function(arg){ gameCtx={game:arg}; openModal('game_choice',{game:arg}); },
  stake:function(arg){
    if(!modal||!modal.data.game) return;
    openModal('stake',{game:modal.data.game,arg:arg});
  },
  dogame:function(){
    var inp=document.getElementById('stake-inp');
    var stake=parseInt(inp?inp.value:'',10);
    var s=S.save;
    if(!stake||stake<CFG.MIN_STAKE){ toast('Мин ставка '+CFG.MIN_STAKE+' 💨'); return; }
    if(stake>s.coins){ toast('Не хватает 💨!'); return; }
    var g=modal.data.game, arg=modal.data.arg;
    if(g==='roulette'){
      var r=playRoulette(s,arg,parseInt(modal.data.num||'0',10));
      var profit=r.win?stake*r.mult-stake:-stake;
      var col=r.n===0?'🟢':r.red?'🔴':'⚫';
      finishGame(s,r.win,profit); save(); checkAch(s);
      toast('🎡 '+r.n+' '+col+(r.win?' 🎉 +'+fmt(profit)+' 💨 (x'+r.mult+')':' 💸 −'+fmt(stake)+' 💨'));
      render(); closeModal();
      return;
    }
    if(g==='dice'){
      var d=playDice(s,arg);
      var profit2=d.win?stake*d.mult-stake:-stake;
      finishGame(s,d.win,profit2); save(); checkAch(s);
      toast('🎲 '+d.a+' + '+d.b+' = '+d.total+(d.win?' 🎉 +'+fmt(profit2)+' 💨':' 💸 −'+fmt(stake)+' 💨'));
      render(); closeModal();
      return;
    }
    if(g==='coin'){
      var c=playCoin();
      var profit3=c.heads?stake:-stake;
      finishGame(s,c.heads,profit3); save(); checkAch(s);
      toast(c.heads?'🪙 Орёл! 🎉 +'+fmt(profit3)+' 💨':'🪙 Решка! 💸 −'+fmt(stake)+' 💨');
      render(); closeModal();
      return;
    }
    if(g==='blackjack'){
      _bjGame=bjDeal(bjState()); _bjGame.stake=stake;
      openModal('blackjack',{st:_bjGame});
      return;
    }
    if(g==='mines'){
      _minesGame=minesInit(); _minesGame.stake=stake;
      openModal('mines',{st:_minesGame});
      return;
    }
  },
  bjhit:function(){ if(!_bjGame) return; bjHit(_bjGame); renderModal(); },
  bjsure:function(){
    if(!_bjGame) return;
    bjFinish(_bjGame);
    resolveBJ();
  },
  bjdouble:function(){
    if(!_bjGame||_bjGame.doubled) return;
    var s=S.save;
    if(s.coins<_bjGame.stake){ toast('Не хватает 💨!'); return; }
    _bjGame.doubled=true; _bjGame.stake*=2;
    s.coins-=_bjGame.stake;
    save(); renderModal();
  },
  mine:function(arg){
    if(!_minesGame||_minesGame.done) return;
    var idx=parseInt(arg,10);
    if(!_minesGame.revealedCells) _minesGame.revealedCells=[];
    if(_minesGame.revealedCells.indexOf(idx)!==-1) return;
    mineReveal(_minesGame,idx);
    if(!_minesGame.boom && !_minesGame.done) _minesGame.revealedCells.push(idx);
    if(_minesGame.done && !_minesGame.boom && _minesGame.won) _minesGame.revealedCells.push(idx);
    if(_minesGame.done){
      var s=S.save;
      var profit = _minesGame.won ? Math.round(_minesGame.stake*_minesGame.mult - _minesGame.stake) : -_minesGame.stake;
      finishGame(s,_minesGame.won,profit); save(); checkAch(s);
      toast(_minesGame.won?'🎉 Выигрыш x'+_minesGame.mult.toFixed(1)+' (+'+fmt(profit)+' 💨)':'💥 Проигрыш −'+fmt(_minesGame.stake)+' 💨');
    }
    renderModal();
  },
  minecash:function(){
    if(!_minesGame||_minesGame.done) return;
    mineCashout(_minesGame);
    var s=S.save;
    var profit=_minesGame.won?Math.round(_minesGame.stake*_minesGame.mult-_minesGame.stake):-_minesGame.stake;
    finishGame(s,_minesGame.won,profit); save(); checkAch(s);
    toast('🛑 Забрал x'+_minesGame.mult.toFixed(1)+' (+'+fmt(profit)+' 💨)');
    renderModal();
  },
  claimquest:function(){
    var r=claimQuest(S.save); if(r===null){toast('Квест ещё не выполнен');return;}
    save(); checkAch(S.save); toast('🎁 +'+fmt(r)+' 💨!'); render();
  },
  clancreate:function(){
    openModal('input',{title:'🏰 Создать клан', placeholder:'Название клана (2-20 символов)', action:function(s,val){ return clanCreate(s,val); }});
  },
  clancontrib:function(){ openModal('clancontrib'); },
  clanq:function(arg){
    var r=clanContribute(S.save, parseInt(arg,10)||0);
    save();
    toast(r.msg);
    openModal('clancontrib');
  },
  clanleave:function(){
    if(!S.save.clan){ toast('Ты не в клане'); return; }
    openModal('clanleave');
  },
  clanleaveyes:function(){
    var r=clanLeave(S.save); save(); checkAch(S.save); toast(r.msg); closeModal();
  },
  leaderboard:function(){ openModal('leaderboard'); },
  lbup:function(){
    if(!SYNC_URL){ toast('⚠️ SYNC_URL не настроен — глобальный рейтинг недоступен'); renderModal(); return; }
    lbLoad().then(function(data){
      if(data && data.record){ lbSave(data.record); toast('🔄 Рейтинг обновлён ('+data.record.length+' игроков)'); }
      else toast('⚠️ Не удалось загрузить рейтинг');
      renderModal();
    });
  },
  lbsend:function(){
    if(!SYNC_URL){ toast('⚠️ SYNC_URL не настроен — некуда отправлять'); return; }
    lbPush(S.save).then(function(ok){ toast(ok?'📤 Результат отправлен':'⚠️ Ошибка отправки'); });
  },
  botopen:function(){ openTgLink(botChatLink()); },
  botsave:function(){ openTgLink(botLinkMeLink(S.save)); },
  botgame:function(){ openTgLink(inviteLink(S.save)); },
  botvia:function(){ openTgLink(inviteViaBot(S.save)); },
  inputok:function(){
    var inp=document.getElementById('inp-val');
    var val=inp?inp.value.trim():'';
    if(!modal || !modal.action){ return; }
    var r=modal.action(S.save, val);
    save(); checkAch(S.save);
    if(r && r.ok){ toast(r.msg); closeModal(); }
    else if(r){ toast(r.msg); renderModal(); }
    else { toast('Готово'); closeModal(); }
  },
  reset:function(){
    if(!confirm('Точно сбросить весь прогресс?')) return;
    var uid=S.save.tg, name=S.save.name, username=S.save.username;
    S.save=defaultSave(); S.save.tg=uid; S.save.name=name; S.save.username=username;
    save(); toast('🗑 Прогресс сброшен'); render();
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', function(e){
    var el=e.target.closest('[data-act]');
    if(!el) return;
    var act=el.dataset.act, arg=el.dataset.arg, game=el.dataset.game;
    if(game) modal={type:'game_choice',data:{game:game}};
    var fn=ACTIONS[act];
    if(fn) fn(arg,el,e);
  });
}

var _toastTimer=null;
function toast(msg){
  var t=document.getElementById('banner');
  if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer=setTimeout(function(){ t.classList.remove('show'); },2600);
}
function openTgLink(url){
  if(Tg && Tg.openTelegramLink) Tg.openTelegramLink(url);
  else window.open(url,'_blank');
}

/* resolveBJ — завершение блэкджека со ставкой */
function resolveBJ(){
  var s=S.save;
  var st=_bjGame;
  var netGain = st.result==='win'?st.stake : st.result==='draw'?0 : -st.stake;
  var profit;
  if(st.doubled){
    /* ставка уже списана при удвоении */
    profit = st.result==='win' ? st.stake*2 : st.result==='draw' ? st.stake : 0;
  } else {
    profit = st.result==='win' ? st.stake*2-st.stake : st.result==='draw' ? 0 : -st.stake;
  }
  finishGame(s, st.result==='win', profit);
  save(); checkAch(s);
  toast(st.result==='win'?'🎉 Блэкджек-победа! +'+fmt(netGain)+' 💨':st.result==='draw'?'🤝 Ничья':'💸 Проигрыш −'+fmt(st.stake)+' 💨');
  renderModal();
}

(function init(){
  if(typeof document==='undefined') return;
  var loaded=loadSave();
  S={save:loaded.save};
  if(loaded.offline>0) setTimeout(function(){toast('🌙 Койл накопил +'+fmt(loaded.offline)+' 💨!');},400);
  if(loaded.refMsg) setTimeout(function(){toast('🎁 '+loaded.refMsg.bonus+' 💨 от друга!');},900);
  var fresh=checkAch(S.save); if(fresh.length) setTimeout(function(){toast('🏅 '+fresh[0].name);},1400);
  if(Tg){
    Tg.ready(); Tg.expand();
    try{ Tg.setHeaderColor('#0a0e14'); Tg.setBackgroundColor('#0a0e14'); }catch(e){}
  }
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') closeModal();
  });
  if(Tg && Tg.BackButton){
    Tg.BackButton.onClick(function(){ if(modal) closeModal(); });
  }
  render();
})();

/* экспорт для Node-тестов */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {CFG:CFG, SECTIONS:SECTIONS, ITEMS:ITEMS, defaultSave:defaultSave,
    upgCost:upgCost, totalClickPower:totalClickPower, totalAuto:totalAuto, totalCrit:totalCrit,
    dailyBase:dailyBase, prestigeCost:prestigeCost, buyItem:buyItem, buyUpgrade:buyUpgrade,
    claimDaily:claimDaily, doPrestige:doPrestige, buyTurbo:buyTurbo, doClick:doClick,
    claimQuest:claimQuest, bumpQuest:bumpQuest, assignQuest:assignQuest, questReward:questReward,
    offlineGain:offlineGain, applyReferral:applyReferral, checkAch:checkAch, ACHIEVEMENTS:ACHIEVEMENTS,
    playRoulette:playRoulette, playDice:playDice, playCoin:playCoin,
    bjState:bjState, bjDeal:bjDeal, bjHit:bjHit, bjFinish:bjFinish, handVal:handVal,
    minesInit:minesInit, mineReveal:mineReveal, mineCashout:mineCashout,
    stakeLabel:stakeLabel,
    rankOf:rankOf, finishGame:finishGame, todayStr:todayStr, yesterdayStr:yesterdayStr,
    clanCreate:clanCreate, clanContribute:clanContribute, clanLeave:clanLeave,
    clanLevelOf:clanLevelOf, clanBonusOf:clanBonusOf, pushNotify:pushNotify,
    lbCache:lbCache, lbSave:lbSave, inviteLink:inviteLink, inviteViaBot:inviteViaBot,
    botChatLink:botChatLink, botLinkMeLink:botLinkMeLink, BOT_USERNAME:BOT_USERNAME};
}