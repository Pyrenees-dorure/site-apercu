(function(){
  var $=function(q){return document.querySelector(q)}, $$=function(q){return Array.prototype.slice.call(document.querySelectorAll(q))};
  /* Menu mobile */
  var bg=$("#burger"), mm=$("#menu-mobile");
  function menu(o){bg.setAttribute("aria-expanded",o?"true":"false");bg.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu");mm.classList.toggle("ouvert",o);document.body.style.overflow=o?"hidden":""}
  bg.addEventListener("click",function(){menu(bg.getAttribute("aria-expanded")!=="true")});
  mm.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){menu(false)})});
  document.addEventListener("keydown",function(e){if(e.key==="Escape") menu(false)});
  /* Visionneuse */
  var dlg=$("#visionneuse");

  $("#fermer").addEventListener("click",function(){dlg.close()}); dlg.addEventListener("click",function(e){if(e.target===dlg) dlg.close()});
  if(!window.gsap) return;
  /* Curseur doré */
  var c=$("#curseur");
  if(window.matchMedia&&window.matchMedia("(pointer:fine)").matches){
    document.documentElement.classList.add("curseur-or");
    window.addEventListener("mousemove",function(e){c.style.opacity=1;c.style.transform="translate3d("+e.clientX+"px,"+e.clientY+"px,0)"});
    document.addEventListener("mouseleave",function(){c.style.opacity=0});
    document.addEventListener("mouseover",function(e){c.classList.toggle("survol",!!(e.target.closest&&e.target.closest("a,button,summary,.cartes-v li")))});
  }
  /* Découpe : tracé puis pièce qui se détache */
  (function(){
    var coupe=document.querySelector(".coupe"), tete=document.querySelector(".tete-coupe"), piece=$("#piece"), sc=$("#scene-decoupe");
    var L=coupe.getTotalLength(), tl=null, boucle=null;
    function jouer(){
      if(tl) tl.kill(); if(boucle) boucle.kill();
      var p={v:0};
      gsap.set(piece,{x:0,y:0,rotation:0,filter:"none"});
      gsap.set(coupe,{strokeDasharray:L,strokeDashoffset:L,opacity:1}); gsap.set(tete,{opacity:1});
      tl=gsap.timeline();
      tl.to(p,{v:1,duration:1.8,ease:"none",onUpdate:function(){coupe.style.strokeDashoffset=L*(1-p.v);var pt=coupe.getPointAtLength(L*p.v);tete.setAttribute("cx",pt.x);tete.setAttribute("cy",pt.y)}})
        .to([coupe,tete],{opacity:0,duration:.4})
        .set(piece,{filter:"url(#f-ombre)"})
        .to(piece,{y:-12,x:-38,rotation:-7,duration:1.4,ease:"power3.out"},"-=.1");
      /* relance automatique toutes les 8 s */
      boucle=gsap.delayedCall(8,jouer);
    }
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){gsap.set(coupe,{opacity:0});gsap.set(tete,{opacity:0});gsap.set(piece,{y:-12,x:-38,rotation:-7,filter:"url(#f-ombre)"});}
    else{gsap.set(tete,{opacity:0});gsap.set(coupe,{strokeDasharray:L,strokeDashoffset:L});
      /* rejoue à chaque fois que la scène revient au centre de l'écran */
      if(window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.create({trigger:sc,start:"top 70%",end:"bottom 30%",onEnter:jouer,onEnterBack:jouer});}
      else jouer();}
  })();
  /* Défilement : variante Graphite */
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-p h1",{x:-60,opacity:0,duration:1.1,ease:"expo.out"});
  gsap.from(".hero-p .chapo,.hero-p .actions",{x:40,opacity:0,duration:1.1,stagger:.1,ease:"expo.out",delay:.15});
  gsap.from(".chiffres div",{y:20,opacity:0,duration:.8,stagger:.08,ease:"power2.out",delay:.4});
  gsap.fromTo(".hero-p figure",{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:1.4,ease:"expo.inOut",delay:.1});
  $$("section:not(.hero-p) [data-r=titre]").forEach(function(t){gsap.from(t,{x:-90,opacity:0,duration:1.1,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 86%"}})});
  $$("section:not(.hero-p) [data-r=texte]").forEach(function(t){gsap.from(t,{x:60,opacity:0,duration:1.1,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 90%"}})});
  
  /* Ce que nous réalisons : comme les cartes de l'accueil (glissement latéral, photos balayées) */
  gsap.from(".cartes-v li",{x:140,opacity:0,duration:1.2,stagger:.1,ease:"expo.out",scrollTrigger:{trigger:".cartes-v",start:"top 82%"}});
  $$(".cartes-v .img").forEach(function(c){gsap.fromTo(c,{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:1.2,ease:"expo.inOut",scrollTrigger:{trigger:c,start:"top 90%"}})});
  gsap.from(".fiche dt,.fiche dd",{x:40,opacity:0,duration:.8,stagger:.05,ease:"power3.out",scrollTrigger:{trigger:".fiche dl",start:"top 88%"}});
  gsap.from(".questions details",{x:60,opacity:0,duration:.9,stagger:.08,ease:"expo.out",scrollTrigger:{trigger:".questions",start:"top 88%"}});

  /* Tous les autres blocs : apparition au défilement */
  $$(".groupe-t,.teintes,.indice,.intro .actions,.intro > .bouton,.questions h3,.appel .assoc,.appel .actions").forEach(function(e){gsap.from(e,{y:28,opacity:0,duration:.9,ease:"power3.out",scrollTrigger:{trigger:e,start:"top 88%"}})});
  $$(".bandeau").forEach(function(e){gsap.from(e,{x:120,opacity:0,duration:1.3,ease:"expo.out",scrollTrigger:{trigger:e,start:"top 88%"}})});
  $$(".apercu,.scene-relief").forEach(function(e){gsap.fromTo(e,{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:1.3,ease:"expo.inOut",scrollTrigger:{trigger:e,start:"top 88%"}})});
  gsap.from(".fil",{opacity:0,duration:.8,delay:.2});
})();
