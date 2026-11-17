(function(){
  /* Photos : directement dans la page (src/srcset), plus de chargement par script */
  /* Les animations démarrent une fois la page affichée, pour ne pas ralentir le premier affichage */
  window.apresChargement=function(f){var go=function(){(window.requestIdleCallback||function(c){setTimeout(c,1)})(f,{timeout:1200})};if(document.readyState==="complete")setTimeout(go,0);else addEventListener("load",function(){setTimeout(go,0)})};
  window.apresChargement(function(){if(window.animerDefilement) window.animerDefilement("2")});

  /* En-tête opaque au défilement */
  var ent=document.getElementById("entete");
  function maj(){ent.classList.toggle("plein",window.scrollY>40)}
  window.addEventListener("scroll",maj,{passive:true}); maj();

  /* Loupe : le zoom suit la souris */
  document.querySelectorAll(".loupe").forEach(function(l){
    var img=l.querySelector("img");
    l.addEventListener("mousemove",function(e){var r=l.getBoundingClientRect();img.style.transformOrigin=((e.clientX-r.left)/r.width*100)+"% "+((e.clientY-r.top)/r.height*100)+"%"});
    l.addEventListener("mouseleave",function(){img.style.transformOrigin="50% 50%"});
  });

  /* Visionneuse des références */
  var dlg=document.getElementById("visionneuse"), vi=document.getElementById("v-img"), vl=document.getElementById("v-legende");
  document.querySelectorAll(".mosaique button").forEach(function(b){
    b.addEventListener("click",function(){
      var img=b.querySelector("img"); vi.src=img.src; vi.alt=img.alt;
      vl.textContent=b.parentNode.querySelector("figcaption").textContent;
      if(dlg.showModal) dlg.showModal();
    });
  });
  document.getElementById("fermer").addEventListener("click",function(){dlg.close()});
  dlg.addEventListener("click",function(e){if(e.target===dlg) dlg.close()});

  /* Demande de devis : une seule page, envoi vers devis.php */
  var f=document.getElementById("form-devis"), msg=document.getElementById("message"), bE=document.getElementById("envoyer");
  var depot=document.getElementById("depot"), inp=document.getElementById("d-fichier"), lf=document.getElementById("liste-fichiers");
  function lister(fs){lf.textContent=Array.prototype.map.call(fs,function(x){return x.name}).join(", ")}
  inp.addEventListener("change",function(){lister(inp.files)});
  ["dragenter","dragover"].forEach(function(t){depot.addEventListener(t,function(e){e.preventDefault();depot.classList.add("survol")})});
  ["dragleave","drop"].forEach(function(t){depot.addEventListener(t,function(e){e.preventDefault();depot.classList.remove("survol")})});
  depot.addEventListener("drop",function(e){if(e.dataTransfer&&e.dataTransfer.files.length){try{inp.files=e.dataTransfer.files}catch(x){} lister(e.dataTransfer.files)}});
  /* Captcha ALTCHA : calcul fait par le navigateur, sans cookie ni service extérieur.
     Le script n'est chargé qu'à l'approche du formulaire, pour alléger l'ouverture de la page. */
  var captcha=document.getElementById("altcha"), altchaPret=null;
  function chargerAltcha(){
    if(!altchaPret){var lk=document.createElement("link");lk.rel="stylesheet";lk.href="assets/altcha/altcha.css";document.head.appendChild(lk);var sc=document.createElement("script");sc.type="module";sc.src="assets/altcha/altcha.js";document.head.appendChild(sc);altchaPret=customElements.whenDefined("altcha-widget")}
    return altchaPret;
  }
  if("IntersectionObserver" in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();chargerAltcha()}},{rootMargin:"800px 0px"});io.observe(f)}else chargerAltcha();
  f.addEventListener("focusin",function(){chargerAltcha().then(function(){if(captcha.getState&&captcha.getState()==="unverified")captcha.verify()})});
  function jeton(){var c=f.querySelector('input[name="altcha"]');return c?c.value:""}
  function verifier(){
    return chargerAltcha().then(function(){
      if(jeton()&&captcha.getState()==="verified") return;
      return captcha.verify().then(function(){if(!jeton()) throw 0});
    });
  }
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var m=document.getElementById("d-mail").value.trim();
    /* Tous les champs sont obligatoires, sauf les fichiers */
    var regles=[["d-objet","Indiquez l'objet de votre demande."],["d-msg","Décrivez votre projet."],["d-societe","Indiquez le nom de votre société."],["d-nom","Indiquez votre nom."],["d-mail","Indiquez une adresse email valide pour recevoir le devis.",function(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)}],["d-tel","Indiquez un numéro de téléphone valide.",function(v){return v.replace(/\D/g,"").length>=9}]];
    f.querySelectorAll(".champ-erreur").forEach(function(x){x.classList.remove("champ-erreur")});
    for(var k=0;k<regles.length;k++){var el=document.getElementById(regles[k][0]),v=el.value.trim();
      if(!v||(regles[k][2]&&!regles[k][2](v))){el.classList.add("champ-erreur");el.focus();msg.textContent=regles[k][1];return}}
    var fs=inp.files||[], tot=0; for(var i=0;i<fs.length;i++) tot+=fs[i].size;
    if(fs.length>5){msg.textContent="Pas plus de 5 fichiers par demande.";return}
    if(tot>15*1024*1024){msg.textContent="Fichiers trop lourds (15 Mo maximum) : envoyez-les plutôt par WeTransfer à contact@pyrenees-dorure.com.";return}
    var d=new FormData();
    [["objet","d-objet"],["projet","d-msg"],["societe","d-societe"],["nom","d-nom"],["email","d-mail"],["telephone","d-tel"],["site_web","d-site"]].forEach(function(c){var el=document.getElementById(c[1]);d.append(c[0],el?el.value:"")});
    for(var j=0;j<fs.length;j++) d.append("fichiers[]",fs[j]);
    bE.disabled=true; msg.textContent="Envoi en cours…";
    var echec=function(t){bE.disabled=false;msg.innerHTML=(t||"L'envoi n'a pas abouti.")+' Vous pouvez aussi écrire à <a href="mailto:contact@pyrenees-dorure.com">contact@pyrenees-dorure.com</a> ou appeler le 05 59 14 92 35.'};
    if(/github\.io$|claude|^$/.test(location.hostname)){echec("Ceci est un aperçu : la demande n'est pas envoyée.");return}
    msg.textContent="Vérification anti-robot…";
    verifier().then(function(){
      d.append("altcha",jeton()); msg.textContent="Envoi en cours…";
      return fetch("devis.php",{method:"POST",body:d});
    },function(){throw {captcha:1}}).then(function(r){return r.json().catch(function(){return {ok:false}})}).then(function(r){
      if(r&&r.ok){f.innerHTML='<div class="merci" role="status"><h3>Merci, votre demande est envoyée.</h3><p>Un accusé de réception vient de partir vers '+m.replace(/[<>&"]/g,"")+'. Nous revenons vers vous avec un devis.</p></div>'}
      else echec(r&&r.erreur);
    }).catch(function(x){echec(x&&x.captcha?"La vérification anti-robot n'a pas abouti : rechargez la page.":"")});
  });

  /* Nuancier */
  var ech=document.getElementById("echantillon"), nom=document.getElementById("nom-film");
  document.querySelectorAll(".teintes button").forEach(function(b){b.addEventListener("click",function(){
    document.querySelectorAll(".teintes button").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
    ech.style.setProperty("--film",b.style.getPropertyValue("--film")); nom.textContent=b.dataset.nom;
    document.getElementById("apercu").style.setProperty("--fond-apercu",b.dataset.fond);
    if(window.gsap) gsap.fromTo(ech,{backgroundPosition:"100% 0",scale:.96},{backgroundPosition:"0% 0",scale:1,duration:1.1,ease:"power2.out"});
  })});

  /* Menu mobile */
  var bg=document.getElementById("burger"), mm=document.getElementById("menu-mobile");
  function menu(o){bg.setAttribute("aria-expanded",o?"true":"false");bg.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu");mm.classList.toggle("ouvert",o);document.body.style.overflow=o?"hidden":""}
  bg.addEventListener("click",function(){menu(bg.getAttribute("aria-expanded")!=="true")});
  mm.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){menu(false)})});
  document.addEventListener("keydown",function(e){if(e.key==="Escape") menu(false)});
})();
