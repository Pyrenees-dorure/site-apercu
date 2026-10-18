/* Calage intelligent du défilement (ordinateur uniquement)
   - un bloc qui tient dans l'écran : la page se cale toujours sur son début ;
   - un bloc plus haut que l'écran : défilement libre jusqu'à sa fin, puis calage sur le bloc suivant.
   Désactivé sur écran tactile, fenêtre étroite ou si l'utilisateur limite les animations. */
(function(){
  var mq=window.matchMedia;
  if(!mq||!mq("(pointer:fine)").matches||mq("(prefers-reduced-motion: reduce)").matches) return;
  var anim=false, finAnim=0, dernierRoulement=0, sens=1, minuteur=null;
  function actif(){return innerWidth>=900}
  function entete(){var e=document.getElementById("entete");return e?e.offsetHeight:0}
  function blocs(){
    var l=[].slice.call(document.querySelectorAll("main > section"));
    var p=document.querySelector("footer"); if(p) l.push(p);
    var B=l.map(function(el){var r=el.getBoundingClientRect();return {top:r.top+scrollY,bas:r.bottom+scrollY,h:r.height}}).filter(function(b){return b.h>40});
    if(B.length){B[0].h+=B[0].top;B[0].top=0}   /* le haut de page appartient au premier bloc */
    return B;
  }
  function maxY(){return document.documentElement.scrollHeight-innerHeight}
  function aller(y){
    y=Math.max(0,Math.min(maxY(),Math.round(y)));
    var y0=scrollY,d=y-y0; if(Math.abs(d)<2) return;
    anim=true; var t0=performance.now(), T=Math.min(900,420+Math.abs(d)*.35);
    (function pas(t){var k=Math.min(1,(t-t0)/T),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
      scrollTo(0,y0+d*e); if(k<1) requestAnimationFrame(pas); else {anim=false;finAnim=performance.now()}})(t0);
  }
  function courant(B,H){var y=scrollY+H+1;for(var i=0;i<B.length;i++){if(y>=B[i].top&&y<B[i].bas)return i}return B.length-1}
  function cible(B,i,H){return i===0?0:B[i].top-H}
  addEventListener("wheel",function(e){
    if(!actif()||e.ctrlKey) return;
    if(e.target.closest&&e.target.closest("textarea,select,iframe,dialog,.menu-mobile")) return;
    var now=performance.now(), calme=now-dernierRoulement>140; dernierRoulement=now;
    if(anim||(now-finAnim<450&&!calme)){e.preventDefault();return}
    var dy=e.deltaY; if(Math.abs(dy)<2) return; sens=dy>0?1:-1;
    var H=entete(), B=blocs(); if(!B.length) return;
    var i=courant(B,H), b=B[i], vh=innerHeight-H, haut=scrollY+H, bas=scrollY+innerHeight;
    if(b.h<=vh+8){                       /* bloc qui tient dans l'écran */
      e.preventDefault();
      if(sens>0){ if(i+1<B.length) aller(cible(B,i+1,H)); else aller(maxY()); }
      else { if(haut>b.top+4) aller(cible(B,i,H)); else if(i>0) aller(B[i-1].h<=vh+8?cible(B,i-1,H):B[i-1].bas-innerHeight); }
      return;
    }
    /* bloc plus haut que l'écran : libre à l'intérieur, calage aux extrémités */
    if(sens>0&&bas>=b.bas-4&&i+1<B.length){e.preventDefault();aller(cible(B,i+1,H));return}
    if(sens<0&&haut<=b.top+4&&i>0){e.preventDefault();aller(B[i-1].h<=vh+8?cible(B,i-1,H):B[i-1].bas-innerHeight);return}
  },{passive:false});
  /* après un défilement libre (molette dans un grand bloc, clavier, barre de défilement) : ne jamais rester entre deux blocs */
  addEventListener("scroll",function(){
    if(anim||!actif()) return; clearTimeout(minuteur);
    minuteur=setTimeout(function(){
      if(anim) return;
      var H=entete(), B=blocs(); if(!B.length) return;
      var i=courant(B,H), b=B[i], vh=innerHeight-H, haut=scrollY+H, bas=scrollY+innerHeight;
      if(scrollY<=2||scrollY>=maxY()-2) return;
      if(b.h<=vh+8){ if(Math.abs(haut-b.top)>4){ if(sens>0&&i+1<B.length&&haut-b.top>b.h*.25) aller(cible(B,i+1,H)); else aller(cible(B,i,H)); } return; }
      if(bas>b.bas+4&&i+1<B.length){ if(sens>0) aller(cible(B,i+1,H)); else aller(b.bas-innerHeight); }
    },180);
  },{passive:true});
})();
