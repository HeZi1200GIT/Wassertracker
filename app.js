"use strict";
// Der ursprüngliche Speicherschlüssel bleibt unverändert: vorhandene Trinkdaten bleiben erhalten.
const DATA_KEY = 'wassertracker-v1';
const SETTINGS_KEY = 'wassertracker-settings-v2';
const AUTH_KEY = 'wassertracker-device-v2';
const API = 'https://wassertracker-push.henning-zimmer.workers.dev';
const pad = n => String(n).padStart(2, '0');
const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const formatHour = h => `${pad(h)}:00`;
const today = () => new Date();
const $ = id => document.getElementById(id);
const defaults = {startHour:8,endHour:20,minimumMl:200,dailyGoalMl:1500,notificationsEnabled:false};
function readObject(key) { try { const x=JSON.parse(localStorage.getItem(key)||'null'); return x && typeof x==='object' && !Array.isArray(x) ? x : {}; } catch { return {}; } }
let entries = readObject(DATA_KEY);
let settings = {...defaults,...readObject(SETTINGS_KEY)};
let auth = readObject(AUTH_KEY);
const slots = () => Array.from({length:settings.endHour-settings.startHour},(_,i)=>({start:settings.startHour+i,end:settings.startHour+i+1}));
// Alte Einträge 0–11 entsprechen weiterhin den Stunden 08–20.
const slotKey = hour => hour>=8 && hour<20 ? String(hour-8) : `h${hour}`;
function getValue(date,hour) { const v=entries[date]?.[slotKey(hour)]; return v==='yes'||v==='no'?v:null; }
function setValue(date,hour,value) { const row={...(entries[date]||{})}; const key=slotKey(hour); if(row[key]===value) delete row[key]; else row[key]=value; entries[date]=row; try {localStorage.setItem(DATA_KEY,JSON.stringify(entries));} catch {alert('Speichern fehlgeschlagen. Bitte prüfe den verfügbaren Speicher.');} render(); }
const needed = () => Math.ceil(settings.dailyGoalMl/settings.minimumMl);
function renderDay() {
 const date=dayKey(today()), list=slots(), values=list.map(s=>getValue(date,s.start));
 const yes=values.filter(v=>v==='yes').length, open=values.filter(v=>v===null).length, target=needed();
 $('date-title').textContent=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'}).format(today());
 $('hours-label').textContent=`${formatHour(settings.startHour)}–${formatHour(settings.endHour)} Uhr`;
 $('done-count').textContent=`${yes} von ${list.length} erreicht`;
 $('open-count').textContent=`${open} offen`;
 $('progress-fill').style.width=`${Math.min(yes/target,1)*100}%`;
 $('goal-progress').setAttribute('aria-valuemax',String(target));
 $('goal-progress').setAttribute('aria-valuenow',String(Math.min(yes,target)));
 $('goal-label').textContent=yes>=target?`${yes} Ja-Antworten · Ziel von ${settings.dailyGoalMl} ml erreicht`:`${yes} von ${target} Ja-Antworten bis zum Tagesziel (${settings.dailyGoalMl} ml)`;
 $('goal-success').hidden=yes<target;
 document.querySelector('#day-view .hint').textContent=`Ein „Ja“ bedeutet mindestens ${settings.minimumMl} ml in dieser Stunde – keine genaue Mengenmessung.`;
 const parent=$('slots');parent.replaceChildren();
 list.forEach((s,i)=>{const row=document.createElement('div');row.className='slot';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`${formatHour(s.start)}–${formatHour(s.end)}`;const subtitle=document.createElement('small');subtitle.textContent=values[i]==='yes'?`✓ Mindestens ${settings.minimumMl} ml`:values[i]==='no'?`✕ Unter ${settings.minimumMl} ml`:'Noch offen';info.append(title,subtitle);const actions=document.createElement('div');actions.className='actions';for(const [value,label] of [['yes','Ja'],['no','Nein']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=`${value}${values[i]===value?' selected':''}`;b.setAttribute('aria-pressed',String(values[i]===value));b.setAttribute('aria-label',`${formatHour(s.start)} bis ${formatHour(s.end)}: ${label}`);b.addEventListener('click',()=>setValue(date,s.start,value));actions.append(b);}row.append(info,actions);parent.append(row);});
}
function renderWeek() {
 const container=$('week-bars');container.replaceChildren();let yes=0,no=0,open=0,medals=0;const medalDays=$('medal-days');medalDays.replaceChildren();const list=slots(),target=needed();
 for(let offset=6;offset>=0;offset--){const d=today();d.setHours(12,0,0,0);d.setDate(d.getDate()-offset);const date=dayKey(d);const values=list.map(s=>getValue(date,s.start));const y=values.filter(v=>v==='yes').length;yes+=y;if(y>=target)medals++;no+=values.filter(v=>v==='no').length;open+=values.filter(v=>v===null).length;const row=document.createElement('div');row.className='bar-row';const label=document.createElement('span');label.textContent=new Intl.DateTimeFormat('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}).format(d);const track=document.createElement('div');track.className='bar';const fill=document.createElement('div');fill.style.width=`${list.length?y/list.length*100:0}%`;track.append(fill);const value=document.createElement('strong');value.textContent=`${y}/${list.length}${y>=target?' ★':''}`;row.append(label,track,value);container.append(row);const medal=document.createElement('div');medal.className='medal-day'+(y>=target?' achieved':'');medal.setAttribute('aria-label',`${date}: ${y>=target?'Tagesziel erreicht':'Tagesziel nicht erreicht'}`);const symbol=document.createElement('span');symbol.className='medal-symbol';symbol.textContent=y>=target?'🏅':'○';const dateLabel=document.createElement('small');dateLabel.textContent=new Intl.DateTimeFormat('de-DE',{weekday:'short'}).format(d);medal.append(symbol,dateLabel);medalDays.append(medal);}
 $('medal-summary').textContent=`${medals} von 7 Tagen mit erreichtem Tagesziel`;$('week-yes').textContent=yes;$('week-no').textContent=no;$('week-open').textContent=open;
}
function render(){renderDay();renderWeek();}
function tab(name){$('tab-settings').setAttribute('aria-expanded',String(name==='settings'));for(const n of ['day','week','settings']){$(`${n}-view`).hidden=n!==name;$(`tab-${n}`).classList.toggle('active',n===name);}}
for(const n of ['day','week']) $(`tab-${n}`).addEventListener('click',()=>tab(n));
$('tab-settings').addEventListener('click',()=>tab($('settings-view').hidden?'settings':'day'));
$('settings-close').addEventListener('click',()=>tab('day'));
function renderAccount(){$('account-state').textContent=auth.token?`Angemeldet als ${auth.deviceName}. Die Anmeldung ist auf diesem Gerät gespeichert.`:'Noch nicht angemeldet. Wähle dein Gerät und gib den Einladungscode ein.';$('register-form').hidden=!!auth.token;$('recovery-form').hidden=!!auth.token;refreshPushStatus();}
function fillSettings(){for(const [id,key] of [['start-hour','startHour'],['end-hour','endHour'],['minimum-ml','minimumMl'],['daily-goal','dailyGoalMl']]) $(id).value=settings[key];}
for(let h=0;h<=23;h++){for(const id of ['start-hour','end-hour']){const o=document.createElement('option');o.value=String(h);o.textContent=formatHour(h);$(id).append(o);}}
async function api(path,options={}){const response=await fetch(API+path,{...options,headers:{'Content-Type':'application/json',...(auth.token?{'Authorization':`Bearer ${auth.token}`}:{})}});let data;try{data=await response.json();}catch{throw new Error(`Serverantwort ${response.status}`);}if(!data||typeof data!=='object')throw new Error('Ungültige Serverantwort.');if(!response.ok || data.success===false)throw new Error(data.error||`Fehler ${response.status}`);return data;}
$('register-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button');btn.disabled=true;$('register-message').textContent='Anmeldung läuft …';try{const result=await api('/register',{method:'POST',body:JSON.stringify({name:$('device-name').value,inviteCode:$('invite-code').value})});if(!result.deviceId||!result.deviceName||!result.token)throw new Error('Unvollständige Geräteanmeldung vom Server.');const nextAuth={deviceId:result.deviceId,deviceName:result.deviceName,token:result.token};localStorage.setItem(AUTH_KEY,JSON.stringify(nextAuth));auth=nextAuth;$('invite-code').value='';renderAccount();$('register-message').textContent='Anmeldung erfolgreich.';await loadRemoteSettings();}catch(err){$('register-message').textContent=`Anmeldung fehlgeschlagen: ${err.message}`;}finally{btn.disabled=false;}});
async function loadRemoteSettings(){if(!auth.token)return;try{const result=await api('/settings');if(result.settings || result.startHour !== undefined || result.start_hour !== undefined){const s=result.settings || result;const next={...settings};for(const [remote,local,min,max] of [['start_hour','startHour',0,23],['end_hour','endHour',1,23],['minimum_ml','minimumMl',50,1000],['daily_goal_ml','dailyGoalMl',200,5000]]){const value=s[local] ?? s[remote];if(Number.isInteger(value)&&value>=min&&value<=max)next[local]=value;}if(next.startHour>=next.endHour){next.startHour=settings.startHour;next.endHour=settings.endHour;}const enabled=s.notificationsEnabled ?? s.notifications_enabled;if(typeof enabled==='boolean'||enabled===0||enabled===1)next.notificationsEnabled=!!enabled;settings=next;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));fillSettings();render();refreshPushStatus();}}catch(err){$('settings-message').textContent=`Servereinstellungen konnten nicht geladen werden: ${err.message}`;}}
$('settings-form').addEventListener('submit',async e=>{e.preventDefault();const next={...settings,startHour:Number($('start-hour').value),endHour:Number($('end-hour').value),minimumMl:Number($('minimum-ml').value),dailyGoalMl:Number($('daily-goal').value)};if(next.startHour>=next.endHour){$('settings-message').textContent='Der Beginn muss vor dem Ende liegen.';return;}if(next.minimumMl<50||next.minimumMl>1000||next.dailyGoalMl<200||next.dailyGoalMl>5000){$('settings-message').textContent='Bitte gültige Mengen eingeben.';return;}if(!auth.token){$('settings-message').textContent='Bitte zuerst dieses iPhone anmelden.';return;}try{await api('/settings',{method:'POST',body:JSON.stringify(next)});settings=next;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));render();$('settings-message').textContent='Einstellungen gespeichert.';}catch(err){$('settings-message').textContent=`Speichern fehlgeschlagen: ${err.message}`;}});

document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();refreshPushStatus();}});


// Push-Abonnement und Serverversand sind getrennte Zustände. Keine lokalen Erinnerungstimer.
let pushBusy=false;
const PUSH_KEY='wassertracker-push-v1';
let workerPromise;
function pushProblem(){
 if(!window.isSecureContext)return 'Benachrichtigungen benötigen HTTPS (für PC-Tests auch localhost).';
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)|| (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(ios && !(navigator.standalone || window.matchMedia('(display-mode: standalone)').matches))return 'Bitte in Safari über Teilen → Zum Home-Bildschirm hinzufügen und WasserTracker über das neue Symbol öffnen.';
 if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))return 'Web-Push wird hier nicht unterstützt. Auf dem iPhone wird iOS 16.4 oder neuer benötigt.';
 return '';
}
function ensureWorker(){
 if(!workerPromise)workerPromise=(async()=>{
  await navigator.serviceWorker.register('./sw.js');
  let timer;
  try{return await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Service Worker nicht bereit. Bitte App online neu öffnen.')),15000);})]);}
  finally{clearTimeout(timer);}
 })().catch(error=>{workerPromise=undefined;throw error;});
 return workerPromise;
}
function vapidBytes(key){
 if(typeof key!=='string'||!key)throw new Error('Der Worker liefert keinen öffentlichen VAPID-Schlüssel.');
 const base64=key.replace(/-/g,'+').replace(/_/g,'/');
 const bytes=Uint8Array.from(atob(base64+'='.repeat((4-base64.length%4)%4)),c=>c.charCodeAt(0));
 if(bytes.length!==65||bytes[0]!==4)throw new Error('Der öffentliche VAPID-Schlüssel ist ungültig.');
 return bytes;
}
function refreshPushStatus(message){
 const problem=pushProblem();
 // Voraussetzungen beim Antippen erklären, statt eine stumme graue Schaltfläche zu zeigen.
 $('push-enable').disabled=pushBusy;
 $('push-disable').disabled=pushBusy;
 if(message){$('push-message').textContent=message;return;}
 if(problem){$('push-message').textContent=problem;return;}
 if(!auth.token){$('push-message').textContent='Bitte zuerst dieses Gerät anmelden.';return;}
 if(Notification.permission==='denied'){$('push-message').textContent='Benachrichtigungen sind blockiert. Öffne die iPhone-Einstellungen → Mitteilungen → WasserTracker und erlaube Mitteilungen. Danach die App erneut öffnen.';return;}
 const saved=readObject(PUSH_KEY);
 $('push-message').textContent=Notification.permission!=='granted'?'Benachrichtigungen noch nicht aktiviert.':saved.deviceId===auth.deviceId&&saved.registered&&settings.notificationsEnabled?'Push-Abonnement erfolgreich beim Worker registriert. Automatischer Erinnerungsversand ist serverseitig noch nicht eingerichtet.':settings.notificationsEnabled?'Berechtigung erteilt. Bitte das Push-Abonnement über die Schaltfläche beim Worker registrieren.':'Benachrichtigungen deaktiviert beziehungsweise noch nicht beim Worker aktiviert.';
}
$('push-enable').addEventListener('click',async()=>{
 if(pushBusy)return;
 const problem=pushProblem();if(problem||!auth.token){refreshPushStatus(problem||'Auf dieser Installation wurde keine Geräteanmeldung erkannt. Prüfe oben Mein iPhone und ob du die bisherige App-Adresse verwendest. Vorhandene App und Websitedaten nicht löschen.');return;}
 pushBusy=true;
 try{
  // Vor dem ersten await direkt auf den Fingertipp reagieren (iOS-Berechtigungsregel).
  const permission=await Notification.requestPermission();
  if(permission!=='granted')throw new Error(permission==='denied'?'Berechtigung verweigert. In iPhone-Einstellungen → Mitteilungen → WasserTracker erlauben.':'Die Freigabe wurde nicht erteilt. Du kannst es erneut versuchen.');
  refreshPushStatus('Berechtigung erteilt. Push-Abonnement wird registriert …');
  const registration=await ensureWorker();
  const result=await api('/push/public-key');
  const key=vapidBytes(result.publicKey);
  let subscription=await registration.pushManager.getSubscription();
  if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  await api('/push/subscribe',{method:'POST',body:JSON.stringify(subscription.toJSON())});
  const next={...settings,notificationsEnabled:true};
  await api('/settings',{method:'POST',body:JSON.stringify(next)});
  settings=next;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
  localStorage.setItem(PUSH_KEY,JSON.stringify({deviceId:auth.deviceId,registered:true}));
  refreshPushStatus('Push-Abonnement erfolgreich registriert. Automatischer Erinnerungsversand ist serverseitig noch nicht eingerichtet.');
 }catch(error){refreshPushStatus('Registrierung fehlgeschlagen: '+error.message);}
 finally{pushBusy=false;refreshPushStatus($('push-message').textContent);}
});
$('push-disable').addEventListener('click',async()=>{
 if(pushBusy)return;
 if(!auth.token){refreshPushStatus('Bitte zuerst unter Mein iPhone prüfen, ob dieses Gerät angemeldet ist. Die vorhandene Anmeldung nicht zurücksetzen.');return;}
 if(!settings.notificationsEnabled){refreshPushStatus('Benachrichtigungen sind in deinen Geräteeinstellungen bereits deaktiviert.');return;}
 pushBusy=true;refreshPushStatus('Benachrichtigungen werden deaktiviert …');
 try{
  const next={...settings,notificationsEnabled:false};
  await api('/settings',{method:'POST',body:JSON.stringify(next)});
  settings=next;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
  refreshPushStatus('Benachrichtigungen in deinen Geräteeinstellungen deaktiviert. Das Abonnement bleibt gespeichert, bis der Worker eine sichere Abmeldung unterstützt.');
 }catch(error){refreshPushStatus('Deaktivieren fehlgeschlagen: '+error.message);}
 finally{pushBusy=false;refreshPushStatus($('push-message').textContent);}
});
$('recovery-form').addEventListener('submit',async event=>{
 event.preventDefault();
 if(auth.token){$('recovery-message').textContent='Dieses Gerät ist bereits angemeldet.';return;}
 const code=$('recovery-code').value;
 if(code.length<32||code.length>256){$('recovery-message').textContent='Bitte den vollständigen Wiederherstellungscode mit 32 bis 256 Zeichen eingeben. Nicht den Einladungscode verwenden.';return;}
 const button=event.currentTarget.querySelector('button');button.disabled=true;
 $('recovery-message').textContent='Zugang wird wiederhergestellt …';
 try{
  // Vor dem serverseitigen Tokenwechsel prüfen, ob lokales Speichern möglich ist.
  const probe='wassertracker-storage-probe';localStorage.setItem(probe,'1');localStorage.removeItem(probe);
  const result=await api('/recover',{method:'POST',body:JSON.stringify({name:'Henning',recoveryCode:code})});
  if(!result.deviceId||result.deviceName!=='Henning'||!result.token)throw new Error('Unvollständige Antwort vom Worker.');
  const nextAuth={deviceId:result.deviceId,deviceName:result.deviceName,token:result.token};
  localStorage.setItem(AUTH_KEY,JSON.stringify(nextAuth));auth=nextAuth;
  settings={...settings,notificationsEnabled:false};
  $('recovery-code').value='';renderAccount();
  $('register-message').textContent='Angemeldet als Henning. Zugang wiederhergestellt. Bitte den Wiederherstellungscode in Cloudflare entfernen und Push neu aktivieren.';
  await loadRemoteSettings();
 }catch(error){$('recovery-message').textContent='Wiederherstellung fehlgeschlagen: '+error.message;}
 finally{button.disabled=false;}
});
fillSettings();renderAccount();render();loadRemoteSettings();
if('serviceWorker' in navigator && window.isSecureContext)ensureWorker().catch(error=>refreshPushStatus('Offline-/Push-Vorbereitung fehlgeschlagen: '+error.message));

// Erst freigeben, wenn der Wiederherstellungs-Handler und die Oberfläche bereit sind.
$('recovery-submit').disabled=false;
$('recovery-message').textContent='Bereit. Den separaten Wiederherstellungscode eingeben und anschließend den Zugang wiederherstellen.';
$('code-version').textContent='Programmcode 1.5.4 bereit.';
