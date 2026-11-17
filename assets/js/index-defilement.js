/* Animations au défilement : une variante par proposition */
(function(){
  if(!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var calme=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx=null, q=function(s){return gsap.utils.toArray(s)};
  function lettres(el){
    if(!el.dataset.txt) el.dataset.txt=el.textContent;
    el.innerHTML=el.dataset.txt.split(" ").map(function(w){return '<span class="m">'+w.split("").map(function(c){return '<span class="l">'+c+'</span>'}).join("")+'</span>'}).join(" ");
    el.dataset.split="1"; return el.querySelectorAll(".l");
  }
  function restaurer(){q("[data-split]").forEach(function(el){el.textContent=el.dataset.txt;el.removeAttribute("data-split")})}
  window.animerDefilement=function(v){
    if(ctx) ctx.revert(); restaurer();
    if(calme) return;
    ctx=gsap.context(function(){
      /* Ouverture : entrée au chargement et léger parallaxe */
      gsap.from(".ouverture .bloc > *",{y:30,opacity:0,duration:1,stagger:.12,ease:"power3.out",delay:.1});
      gsap.from(".ouverture .reperes > div",{y:20,opacity:0,duration:.8,stagger:.1,ease:"power2.out",delay:.6});
      gsap.to(".ouverture > img",{yPercent:10,ease:"none",scrollTrigger:{trigger:".ouverture",start:"top top",end:"bottom top",scrub:true}});
      var titres=q("[data-r=titre]"), textes=q("[data-r=texte]").concat(q(".atelier p, .atelier .bouton, .composer .intro p, .composer .coord, #form-devis > *"));
      var cartes=q(".finition"), cadres=q(".loupe, .univers .cadre-img"), imgAt=document.getElementById("photo-atelier");
      if(v==="1"){
        /* Gravure : montée douce, photos dévoilées comme un rideau */
        titres.forEach(function(t){gsap.from(t,{y:40,opacity:0,clipPath:"inset(0 0 100% 0)",duration:1.2,ease:"power3.out",scrollTrigger:{trigger:t,start:"top 86%"}})});
        textes.forEach(function(t){gsap.from(t,{y:26,opacity:0,duration:.9,ease:"power2.out",scrollTrigger:{trigger:t,start:"top 90%"}})});
        gsap.from(cartes,{y:60,opacity:0,duration:1,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:".finitions",start:"top 82%"}});
        cadres.forEach(function(c){gsap.fromTo(c,{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(0% 0 0 0)",duration:1.3,ease:"power3.inOut",scrollTrigger:{trigger:c,start:"top 90%"}})});
        if(imgAt) gsap.fromTo(imgAt,{yPercent:-5,scale:1.08},{yPercent:5,scale:1.08,ease:"none",scrollTrigger:{trigger:".atelier",start:"top bottom",end:"bottom top",scrub:true}});
      }else if(v==="2"){
        /* Graphite : glissements latéraux, photos balayées */
        titres.forEach(function(t){gsap.from(t,{x:-90,opacity:0,duration:1.1,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 86%"}})});
        textes.forEach(function(t){gsap.from(t,{x:60,opacity:0,duration:1.1,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 90%"}})});
        gsap.from(cartes,{x:140,opacity:0,duration:1.2,stagger:.1,ease:"expo.out",scrollTrigger:{trigger:".finitions",start:"top 82%"}});
        cadres.forEach(function(c){gsap.fromTo(c,{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:1.2,ease:"expo.inOut",scrollTrigger:{trigger:c,start:"top 90%"}})});
        gsap.from(".univers figcaption",{x:-40,opacity:0,duration:.9,stagger:.08,ease:"power3.out",scrollTrigger:{trigger:".univers",start:"top 72%"}});
        if(imgAt) gsap.fromTo(imgAt,{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:1.5,ease:"expo.inOut",scrollTrigger:{trigger:imgAt,start:"top 82%"}});
      }else{
        /* Atelier : titres lettre à lettre avec un éclat doré, photos qui s'allument */
        titres.forEach(function(t){var c=getComputedStyle(t).color,L=lettres(t);
          gsap.fromTo(L,{yPercent:90,opacity:0,color:"#ffd36a"},{yPercent:0,opacity:1,color:c,duration:.9,stagger:.025,ease:"power3.out",scrollTrigger:{trigger:t,start:"top 86%"}})});
        textes.forEach(function(t){gsap.from(t,{y:30,opacity:0,filter:"blur(6px)",duration:1,ease:"power2.out",scrollTrigger:{trigger:t,start:"top 90%"}})});
        gsap.from(cartes,{y:90,opacity:0,rotation:function(i){return i%2?3:-3},duration:1.1,stagger:.1,ease:"back.out(1.4)",scrollTrigger:{trigger:".finitions",start:"top 82%"}});
        cadres.forEach(function(c){gsap.fromTo(c,{filter:"grayscale(1) brightness(.45)"},{filter:"grayscale(0) brightness(1)",duration:1.6,ease:"power2.out",scrollTrigger:{trigger:c,start:"top 85%"}})});
        gsap.from(".univers li",{scale:.86,opacity:0,duration:1,stagger:{each:.08,from:"center"},ease:"power3.out",scrollTrigger:{trigger:".univers",start:"top 80%"}});
        if(imgAt) gsap.fromTo(imgAt,{yPercent:-10,scale:1.15,filter:"brightness(.5)"},{yPercent:10,scale:1.15,filter:"brightness(1.05)",ease:"none",scrollTrigger:{trigger:".atelier",start:"top bottom",end:"bottom top",scrub:true}});
      }
    },document.body);
    ScrollTrigger.refresh();
  };
})();
/* Curseur : rond doré qui suit la souris */
(function(){
  var c=document.getElementById("curseur");
  if(!c||!window.gsap||!(window.matchMedia&&window.matchMedia("(pointer:fine)").matches)) return;
  document.documentElement.classList.add("curseur-or");
  window.addEventListener("mousemove",function(e){c.style.opacity=1;c.style.transform="translate3d("+e.clientX+"px,"+e.clientY+"px,0)"});
  document.addEventListener("mouseleave",function(){c.style.opacity=0});
  document.addEventListener("mouseover",function(e){c.classList.toggle("survol",!!(e.target.closest&&e.target.closest("a,button,label,input,select,textarea,.loupe,.univers li")))});
})();
