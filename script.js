const frameCount=12;
const framePaths=Array.from({length:frameCount},(_,i)=>`assets/scroll-frames/frame-${String(i).padStart(2,'0')}.jpg`);
const images=framePaths.map(src=>{const img=new Image();img.decoding='async';img.src=src;return img});
const canvas=document.querySelector('#animationCanvas'),ctx=canvas.getContext('2d',{alpha:false});
const scene=document.querySelector('#scrollScene'),fill=document.querySelector('#timelineFill'),counter=document.querySelector('#frameCounter'),percent=document.querySelector('#scrollPercent'),heading=document.querySelector('#storyHeading'),body=document.querySelector('#storyBody'),phase=document.querySelector('#storyBadge'),energy=document.querySelector('#telemetryEnergy');
const stories=[
 ['The Clash Begins','Two pinnacles of jujutsu collide. Spatial infinity meets relentless slashing energy.'],
 ['Cursed Energy Rises','A quiet second before impact. The air itself bends around their intent.'],
 ['Eyes On The Target','Nothing escapes the field. Every movement is read before it happens.'],
 ['The Signal Breaks','Speed becomes a blur as the distance between them collapses.'],
 ['Red Takes Over','Pressure changes the room. The balance starts to fracture.'],
 ['A Violent Pause','Every motion leaves a trace. The next strike carries everything.'],
 ['The Light Returns','The distance is gone. Two domains pull the world apart.'],
 ['No Room To Retreat','A single breath between impact and aftermath.'],
 ['Domain Collision','Limitless space meets a shrine with no walls.'],
 ['The Final Exchange','Power meets power at the edge of what should be possible.'],
 ['Aftershock','The scene fades, but the cursed energy remains.'],
 ['Sequence Complete','Scroll back through the collision whenever you want.']
];
let dpr=1,current=0,target=0,raf=0,lastProgress=-1,audio=null;
function resize(){dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);draw(current)}
function draw(index){const a=images[Math.floor(index)],b=images[Math.min(frameCount-1,Math.ceil(index))];if(!a?.complete||!a.naturalWidth)return;const scale=Math.max(innerWidth/a.naturalWidth,innerHeight/a.naturalHeight),w=a.naturalWidth*scale,h=a.naturalHeight*scale,x=(innerWidth-w)/2,y=(innerHeight-h)/2;ctx.fillStyle='#08080c';ctx.fillRect(0,0,innerWidth,innerHeight);ctx.globalAlpha=1;ctx.drawImage(a,x,y,w,h);if(b&&b!==a&&b.complete){ctx.globalAlpha=index-Math.floor(index);ctx.drawImage(b,x,y,w,h);ctx.globalAlpha=1}}
function updateReadout(progress,index){const whole=Math.min(frameCount-1,Math.round(index));fill.style.width=`${progress*100}%`;counter.textContent=`FRAME: ${String(whole+1).padStart(2,'0')} / ${String(frameCount).padStart(2,'0')}`;percent.textContent=`${Math.round(progress*100)}%`;phase.textContent=`PHASE ${String(whole+1).padStart(2,'0')} / ${String(frameCount).padStart(2,'0')}`;heading.textContent=stories[whole][0];body.textContent=stories[whole][1];energy.textContent=`${Math.round(120+progress*380)}% MAX`}
function tick(){current+=(target-current)*.16;if(Math.abs(target-current)<.001)current=target;draw(current);const progress=target/(frameCount-1),whole=Math.round(current);if(whole!==lastProgress){updateReadout(progress,current);lastProgress=whole}raf=requestAnimationFrame(tick)}
function readScroll(){const rect=scene.getBoundingClientRect(),travel=Math.max(1,scene.offsetHeight-innerHeight),progress=Math.max(0,Math.min(1,-rect.top/travel));target=progress*(frameCount-1)}
window.addEventListener('scroll',readScroll,{passive:true});window.addEventListener('resize',resize);images.forEach((img,i)=>img.addEventListener('load',()=>{if(i===0)draw(0)}));resize();readScroll();tick();
document.querySelector('#replayBtn').addEventListener('click',()=>document.querySelector('#hero').scrollIntoView({behavior:'smooth'}));
const soundBtn=document.querySelector('#soundBtn');soundBtn.addEventListener('click',()=>{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=54;gain.gain.value=.018;osc.connect(gain);gain.connect(audio.destination);osc.start();soundBtn.classList.add('sound-on');soundBtn.querySelector('.sound-icon').textContent='🔊';soundBtn.querySelector('.sound-label').textContent='SOUND: ON';}else if(audio.state==='running'){audio.suspend();soundBtn.classList.remove('sound-on');soundBtn.querySelector('.sound-icon').textContent='🔈';soundBtn.querySelector('.sound-label').textContent='SOUND: OFF';}else{audio.resume();soundBtn.classList.add('sound-on');soundBtn.querySelector('.sound-icon').textContent='🔊';soundBtn.querySelector('.sound-label').textContent='SOUND: ON'}});
