window.apresChargement(function(){
if(!window.gsap) return;
gsap.ticker.lagSmoothing(0);
var calme=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var $=function(q,c){return (c||document).querySelector(q)}, $$=function(q,c){return Array.prototype.slice.call((c||document).querySelectorAll(q))};
var scene=$("#a-scene"), tl=null, s=function(n){return $("#as"+n)};
$("#as4 .trace").setAttribute("d",$("#etiq-forme").getAttribute("d"));

/* Les mots ne dépassent jamais l'écran */
function ajuster(){
  var W=scene.clientWidth;
  $$(".a-fit").forEach(function(el){el.style.fontSize="100px";var w=el.scrollWidth||1;el.style.fontSize=Math.min(190,Math.max(W*.13,40),100*W*.84/w)+"px"});
  $$(".fitw").forEach(function(t){if(!t.dataset.fs)t.dataset.fs=t.getAttribute("font-size");t.setAttribute("font-size",t.dataset.fs);var w=t.getBBox().width;if(w>900)t.setAttribute("font-size",(+t.dataset.fs*900/w).toFixed(1))});
}
window.addEventListener("resize",ajuster);
function suivre(path,dot,p){var L=path.getTotalLength(),pt=path.getPointAtLength(L*p);dot.setAttribute("cx",pt.x);dot.setAttribute("cy",pt.y)}

function reset(){
  if(tl) tl.kill();
  gsap.set(".a-s",{autoAlpha:0,clearProps:"filter,scale"}); gsap.set(".a-phrase",{clearProps:"scale"});
  gsap.set(".a-ligne > span",{yPercent:110}); gsap.set(".a-liste span,.a-cta",{opacity:0,y:10}); gsap.set(".a-etiq",{opacity:0,y:8});
  gsap.set("#a-eclat",{opacity:0}); $(".a-dore").style.backgroundPosition="100% 0";
  gsap.set(["#relief-diff","#relief-spec"],{attr:{surfaceScale:0}}); gsap.set(["#relief-l1","#relief-l2"],{attr:{azimuth:200}});
  gsap.set("#vernis-spec",{attr:{surfaceScale:0}}); gsap.set("#vernis-l",{attr:{azimuth:150}});
  var tr=$("#as4 .trace"),L=tr.getTotalLength(); gsap.set(tr,{strokeDasharray:L,strokeDashoffset:L,opacity:1});
  gsap.set("#as4 .chute",{opacity:1,y:0}); gsap.set("#as4 .etiquette-g",{y:0,scale:1,transformOrigin:"50% 50%",filter:"none"});
  $("#as4 .etincelle").setAttribute("cx",-50); gsap.set("#as4 .etincelle",{opacity:0});
}
function entree(t,el,at){
  t.fromTo("#a-eclat",{left:"-45%",opacity:1},{left:"120%",duration:.95,ease:"power2.inOut"},at-.45);
  var doux=el.id==="as4";
  t.set(el,{autoAlpha:1},at).fromTo(el,{filter:doux?"blur(6px)":"brightness(2.4) blur(6px)",opacity:doux?0:1,scale:1.03},{filter:doux?"blur(0px)":"brightness(1) blur(0px)",opacity:1,scale:1,duration:1,ease:"power2.out"},at);
  t.to($(".a-etiq",el),{opacity:1,y:0,duration:.6,ease:"power2.out"},at+.5);
}
function sortie(t,el,at){if(el.id==="as4"){t.to(el,{autoAlpha:0,scale:.94,duration:.45,ease:"power2.in"},at)}else{t.to(el,{autoAlpha:0,filter:"brightness(2.2)",duration:.4,ease:"power2.in"},at)}}

$$(".a-ligne > span",s(1)).forEach(function(l){if(l.dataset.dec)return;l.dataset.dec=1;var t=l.textContent;l.textContent="";l.setAttribute("aria-label",t);t.split("").forEach(function(c){var e=document.createElement("span");e.className="a-car";e.setAttribute("aria-hidden","true");e.textContent=c===" "?"\u00a0":c;l.appendChild(e)})});
function jouer(){
  if(boucle){boucle.kill();boucle=null}
  reset(); ajuster();
  if(calme){gsap.set(s(6),{autoAlpha:1});gsap.set(".a-ligne > span",{yPercent:0});gsap.set(".a-liste span,.a-cta",{opacity:1,y:0});return}
  tl=gsap.timeline();
  /* 1 Accroche */
  var cars=$$(".a-car",s(1));
  tl.set(s(1),{autoAlpha:1},0).set($$(".a-ligne > span",s(1)),{yPercent:0},0)
    .fromTo(cars,{opacity:0,yPercent:140,rotationX:-100,scale:1.6,filter:"blur(10px)",color:"#ffe39a"},{opacity:1,yPercent:0,rotationX:0,scale:1,filter:"blur(0px)",duration:.75,ease:"back.out(1.6)",stagger:{each:.026,from:"start"}},.05)
    .to(cars,{color:"#f1efea",duration:.6,stagger:.02,ease:"power1.out"},.55)
    .fromTo("#a-eclat",{left:"-45%",opacity:1},{left:"120%",duration:.9,ease:"power2.inOut"},1.05)
    .fromTo($(".a-trait",s(1)),{scaleX:0},{scaleX:1,duration:.7,ease:"expo.out"},1.2)
    .to($(".a-phrase",s(1)),{scale:1.04,duration:2,ease:"none"},.2)
    .to(s(1),{autoAlpha:0,scale:1.25,filter:"blur(8px)",duration:.45,ease:"power2.in"},2.1);
  /* 2 Lumière */
  entree(tl,s(2),2.5);
  tl.fromTo($(".a-dore"),{letterSpacing:".2em"},{letterSpacing:".02em",duration:1.4,ease:"power3.out"},2.5);
  tl.fromTo($(".a-dore"),{backgroundPosition:"100% 0"},{backgroundPosition:"0% 0",duration:2,ease:"power1.inOut"},2.6);
  sortie(tl,s(2),4.9);
  /* 3 Relief */
  entree(tl,s(3),5.3);
  tl.to(["#relief-diff","#relief-spec"],{attr:{surfaceScale:3.4},duration:1.4,ease:"power2.inOut"},5.5);
  tl.to(["#relief-l1","#relief-l2"],{attr:{azimuth:290},duration:2.2,ease:"sine.inOut"},5.6);
  sortie(tl,s(3),7.6);
  /* 4 Forme : étiquette découpée dans une feuille */
  var el=s(4), tr=$(".trace",el), dot=$(".etincelle",el), pr={p:0};
  entree(tl,el,8.0);
  tl.to(tr,{strokeDashoffset:0,duration:1.5,ease:"power1.inOut"},8.2)
    .set(dot,{opacity:1},8.2)
    .to(pr,{p:1,duration:1.5,ease:"power1.inOut",onUpdate:function(){suivre(tr,dot,pr.p)}},8.2)
    .set(dot,{opacity:0,attr:{cx:-50,cy:-50}},9.75)
    .to($(".chute",el),{y:90,opacity:0,duration:.8,ease:"power2.in"},9.7)
    .to(tr,{opacity:0,duration:.4},9.8)
    .to($(".etiquette-g",el),{y:-14,scale:1.03,filter:"url(#ombre-etiq)",duration:.9,ease:"power3.out"},9.9);
  tl.set($(".etiquette-g",el),{filter:"none"},11.35);
  sortie(tl,el,11.4);
  /* 5 Contraste */
  entree(tl,s(5),12.0);
  tl.to("#vernis-spec",{attr:{surfaceScale:3},duration:1.1,ease:"power2.out"},12.2);
  tl.to("#vernis-l",{attr:{azimuth:330},duration:2,ease:"sine.inOut"},12.3);
  sortie(tl,s(5),14.2);
  /* 6 Promesse */
  tl.fromTo("#a-eclat",{left:"-45%",opacity:1},{left:"120%",duration:.95,ease:"power2.inOut"},14.2);
  tl.set(s(6),{autoAlpha:1,filter:"none"},14.6)
    .to($$(".a-ligne > span",s(6)),{yPercent:0,duration:.85,ease:"expo.out",stagger:.12},14.6)
    .to($$(".a-liste span",s(6)),{opacity:1,y:0,duration:.5,ease:"power2.out",stagger:.06},15.2)
    .to($(".a-cta",s(6)),{opacity:1,y:0,duration:.5,ease:"power2.out"},15.7);
  /* relance automatique 8 s après la fin */
  tl.eventCallback("onComplete",function(){boucle=gsap.delayedCall(8,jouer)});
}
var boucle=null;
/* rien n'est affiché avant le départ : l'animation commence toujours par son début */
try{ajuster()}catch(e){}
var vu=false;
function depart(){if(vu) return; vu=true; jouer();}
if(calme){jouer();}
else{var sc=$("#a-scene");var verif=function(){var r=sc.getBoundingClientRect(),h=innerHeight;if(scrollY>60&&r.top<h*.6&&r.bottom>h*.4){removeEventListener("scroll",verif);(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(depart);}};addEventListener("scroll",verif,{passive:true});verif();}
});
