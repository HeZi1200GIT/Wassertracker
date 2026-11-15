const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function boot(remote={}, overrides={}) {
 const elements=new Map();
 function element(){return {value:'',style:{},classList:{toggle(){}},setAttribute(){},append(){},replaceChildren(){},listeners:{},addEventListener(type,handler){this.listeners[type]=handler;}};}
 const storage=new Map([
 ['wassertracker-v1',JSON.stringify({'2026-11-14':{'0':'yes','1':'no'}})],
 ['wassertracker-settings-v2',JSON.stringify({startHour:9,endHour:19,minimumMl:250,dailyGoalMl:1750})],
 ['wassertracker-device-v2',JSON.stringify({token:'existing-token',deviceName:'Henning'})]
 ]);
 const context=vm.createContext({console,Intl,Date,Uint8Array,atob,setTimeout,clearTimeout,window:{isSecureContext:false},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelector:()=>element(),createElement:element,addEventListener(){}},navigator:{},location:{protocol:'https:'},fetch:async()=>({ok:true,json:async()=>({settings:remote})}),...overrides});
 vm.runInContext(fs.readFileSync('app.js','utf8'),context);
 return {context,storage,elements};
}
test('Update erhält Trinkdaten, Gerätetoken und persönliche Einstellungen bei leerer Serverantwort',async()=>{
 const {context,storage}=boot();
 const before=storage.get('wassertracker-v1');
 await vm.runInContext('loadRemoteSettings()',context);
 assert.equal(storage.get('wassertracker-v1'),before);
 assert.equal(JSON.parse(storage.get('wassertracker-device-v2')).token,'existing-token');
 const settings=JSON.parse(storage.get('wassertracker-settings-v2'));
 assert.equal(settings.startHour,9);assert.equal(settings.minimumMl,250);
 assert.equal(vm.runInContext("getValue('2026-11-14',8)",context),'yes');
 assert.equal(vm.runInContext("getValue('2026-11-14',9)",context),'no');
});
test('Ungültiger Serverzeitraum ersetzt den bestehenden Zeitraum nicht',async()=>{
 const {context,storage}=boot({start_hour:20,end_hour:8});
 await vm.runInContext('loadRemoteSettings()',context);
 const settings=JSON.parse(storage.get('wassertracker-settings-v2'));
 assert.equal(settings.startHour,9);assert.equal(settings.endHour,19);
});
test('Push zeigt auch ohne gültige JSON-Nutzlast eine Erinnerung',async()=>{
 const handlers={};let notification;
 const context=vm.createContext({URL,self:{registration:{scope:'https://example.com/wasser/' ,showNotification:async(title,options)=>{notification={title,options};}},addEventListener:(type,fn)=>handlers[type]=fn}});
 vm.runInContext(fs.readFileSync('sw.js','utf8'),context);
 let pending;
 handlers.push({data:{json(){throw new Error('invalid JSON');}},waitUntil:p=>pending=p});
 await pending;
 assert.equal(notification.title,'WasserTracker');
 assert.equal(notification.options.data.url,'https://example.com/wasser/');
});

test('Zahnrad schließt wieder zur Tagesübersicht',()=>{
 const {elements,context}=boot();vm.runInContext("$('settings-view').hidden=true",context);
 elements.get('tab-settings').listeners.click();assert.equal(elements.get('settings-view').hidden,false);
 elements.get('tab-settings').listeners.click();assert.equal(elements.get('day-view').hidden,false);
 assert.equal(elements.get('settings-view').hidden,true);
});
test('CamelCase-Einstellungen werden unterstützt',async()=>{
 const {context,storage}=boot({startHour:7,endHour:21,notificationsEnabled:true});
 await vm.runInContext('loadRemoteSettings()',context);
 const s=JSON.parse(storage.get('wassertracker-settings-v2'));
 assert.equal(s.startHour,7);assert.equal(s.endHour,21);assert.equal(s.notificationsEnabled,true);
});
test('Push überträgt Subscription mit bestehendem Bearer-Token, keine Trinkdaten',async()=>{
 const calls=[];let permissionCalls=0;let subscribed=false;
 const publicKey='BA2S9GtVTdk1VTPiI96ItcNfmoWTOnA3aOKpeMHg7HNKP0FRoqIM5etvLkq87x2chgGJJ2YTHY-zBsCEOpKLEuY';
 const subscription={toJSON:()=>({endpoint:'https://push.example/test',keys:{p256dh:'public',auth:'secret'}})};
 const registration={pushManager:{getSubscription:async()=>null,subscribe:async options=>{assert.equal(options.applicationServerKey.length,65);subscribed=true;return subscription;}}};
 const {elements,storage}=boot({}, {
 window:{isSecureContext:true,PushManager:function(){},Notification:{},matchMedia:()=>({matches:true})},
 navigator:{userAgent:'iPhone',standalone:true,serviceWorker:{register:async()=>registration,ready:Promise.resolve(registration)}},
 Notification:{permission:'granted',requestPermission:async()=>{permissionCalls++;return 'granted';}},
 fetch:async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.endsWith('/push/public-key')?{publicKey}:{success:true}};}
 });
 assert.equal(permissionCalls,0);
 await elements.get('push-enable').listeners.click();
 assert.equal(permissionCalls,1);assert.equal(subscribed,true);
 const request=calls.find(c=>c.url.endsWith('/push/subscribe'));
 assert.equal(request.options.headers.Authorization,'Bearer existing-token');
 assert.deepEqual(JSON.parse(request.options.body),subscription.toJSON());
 assert.equal(JSON.parse(storage.get('wassertracker-settings-v2')).notificationsEnabled,true);
 await elements.get('push-disable').listeners.click();
 assert.equal(JSON.parse(storage.get('wassertracker-settings-v2')).notificationsEnabled,false);
 assert.equal(JSON.parse(storage.get('wassertracker-v1'))['2026-11-14']['0'],'yes');
});

test('Abgelehnte Push-Erlaubnis sendet kein Abonnement',async()=>{
 let subscriptions=0;
 const {elements}=boot({}, {
 window:{isSecureContext:true,PushManager:function(){},Notification:{}},
 navigator:{userAgent:'desktop',serviceWorker:{register:async()=>({}),ready:Promise.resolve({})}},
 Notification:{permission:'default',requestPermission:async()=> 'denied'},
 fetch:async url=>{if(url.endsWith('/push/subscribe'))subscriptions++;return {ok:true,json:async()=>({})};}
 });
 await elements.get('push-enable').listeners.click();
 assert.equal(subscriptions,0);assert.match(elements.get('push-message').textContent,/Berechtigung verweigert/);
});
test('HTML enthält eindeutige IDs und alle direkt referenzierten Elemente',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
 for(const match of fs.readFileSync('app.js','utf8').matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(match[1]),match[1]);
 const stack=[];const voids=new Set(['meta','link','input','img','br','hr']);
 for(const match of html.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b[^>]*>/gi)){
 const [,closing,tag]=match;if(voids.has(tag))continue;
 if(closing)assert.equal(stack.pop(),tag);else stack.push(tag);
 }
 assert.equal(stack.length,0);
});
