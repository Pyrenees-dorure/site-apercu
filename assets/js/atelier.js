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
  /* Parcours : la feuille traverse les quatre étapes et revient dorée */
  (function(){
    var piste=$(".piste-p"), f=$(".feuille-p"), lis=$$(".etapes4 li"), or=$(".ligne-or"), tl=null, boucle=null;
    var vertical=function(){return window.matchMedia("(max-width:760px)").matches};
    function pos(i){var p=lis[i].querySelector(".pt").getBoundingClientRect(),r=piste.getBoundingClientRect();return vertical()?{x:0,y:p.top-r.top+p.height/2-20}:{x:p.left-r.left+p.width/2,y:0}}
    function jouer(){
      if(tl) tl.kill(); if(boucle) boucle.kill(); lis.forEach(function(l){l.classList.remove("fait")});
      var v=vertical(), p0=pos(0);
      gsap.set(f,{x:p0.x,y:p0.y,rotation:0,opacity:1,"--dore":0}); gsap.set(or,v?{scaleY:0,scaleX:1}:{scaleX:0,scaleY:1});
      tl=gsap.timeline();
      lis.forEach(function(l,i){
        var p=pos(i);
        if(i>0){tl.to(f,{x:p.x,y:p.y,duration:.9,ease:"power2.inOut"});tl.to(or,v?{scaleY:i/3,duration:.9,ease:"power2.inOut"}:{scaleX:i/3,duration:.9,ease:"power2.inOut"},"<");}
        tl.add(function(){l.classList.add("fait")});
        if(i===2){tl.to(f,{rotation:-8,duration:.25,yoyo:true,repeat:1}).to(f,{"--dore":1,duration:.5},"<");}
        tl.to({},{duration:.35});
      });
      /* relance automatique toutes les 8 s */
      boucle=gsap.delayedCall(8,jouer);
    }
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){lis.forEach(function(l){l.classList.add("fait")});gsap.set(f,{opacity:0});gsap.set(or,{scaleX:1,scaleY:1});}
    else{gsap.set(f,{opacity:0});
      if(window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.create({trigger:piste,start:"top 70%",end:"bottom 25%",onEnter:jouer,onEnterBack:jouer});} else jouer();}
  })();
  /* Plan Google : chargé seulement à la demande */
  (function(){var b=$("#afficher-plan");if(!b)return;b.addEventListener("click",function(){
    var f=document.createElement("iframe");f.title="Plan d'accès à Pyrénées Dorure Découpe";f.loading="lazy";f.referrerPolicy="no-referrer-when-downgrade";
    f.src="https://www.google.com/maps?q=ZI+Berlanne+13+rue+des+Landes+64160+Morlaas&z=14&output=embed";
    var c=$("#carte");c.insertBefore(f,c.querySelector(".etiquette-c"));c.querySelector(".repli").remove();});})();
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

  /* Tous les autres blocs : apparition au défilement */
  $$(".groupe-t,.teintes,.indice,.intro .actions,.intro > .bouton,.questions h3,.appel .assoc,.appel .actions,.etapes4 li").forEach(function(e){gsap.from(e,{y:28,opacity:0,duration:.9,ease:"power3.out",scrollTrigger:{trigger:e,start:"top 88%"}})});
  $$(".bandeau").forEach(function(e){gsap.from(e,{x:120,opacity:0,duration:1.3,ease:"expo.out",scrollTrigger:{trigger:e,start:"top 88%"}})});
  $$(".apercu,.scene-relief").forEach(function(e){gsap.fromTo(e,{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:1.3,ease:"expo.inOut",scrollTrigger:{trigger:e,start:"top 88%"}})});
  gsap.from(".fil",{opacity:0,duration:.8,delay:.2});
})();
