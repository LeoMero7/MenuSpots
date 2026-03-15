import { useState, useRef, useEffect, useMemo } from "react";

const INITIAL_RESTAURANTS = [];

const INITIAL_DELIVERIES = [
  { id:5, name:"شركة البرق",      phone:"+201092784020" },
  { id:6, name:"طلباتك أوامر 1", phone:"+201010644921" },
  { id:7, name:"طلباتك أوامر 2", phone:"+201030705361" },
];

const CATEGORIES = ["All","Crispy","Syrian","Koshari","Crepes","Grills","Juices","Cafe","Sea Food","Dessert","Sandwiches"];
const ICONS = {All:"🍽️",Crispy:"🍗",Syrian:"🧆",Koshari:"🍚",Crepes:"🥞",Grills:"🔥",Juices:"🥤",Cafe:"☕","Sea Food":"🦞",Dessert:"🍰",Sandwiches:"🥪"};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}

/* ── INTRO LOADER ── */
.intro-screen{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;transition:opacity .5s ease,visibility .5s ease;animation:introFadeIn .5s ease;}
.intro-screen.hide{opacity:0;visibility:hidden;pointer-events:none;}
@keyframes introFadeIn{from{opacity:0;}to{opacity:1;}}
.intro-logo-img{width:180px;height:auto;object-fit:contain;margin-bottom:40px;}
@media(min-width:480px){.intro-logo-img{width:220px;}}
@media(min-width:768px){.intro-logo-img{width:270px;margin-bottom:48px;}}
@media(min-width:1024px){.intro-logo-img{width:320px;margin-bottom:56px;}}
.loader{width:70px;aspect-ratio:1;border-radius:50%;background:radial-gradient(farthest-side,#ffa516 94%,#0000) top/11px 11px no-repeat,conic-gradient(#0000 30%,#ffa516);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 11px),#000 0);animation:l13 1s infinite linear;margin-top:12px;}
@keyframes l13{100%{transform:rotate(1turn)}}
:root{
  --bg:#FAF6F0;--bg2:#F2EBE0;--bg3:#EDE3D6;
  --br:#2C1A0E;--br2:#4A2C17;
  --gd:#D4A853;--gd2:#E8C47A;
  --tx:#1A0F07;--mt:#8B6F5C;
  --sh:rgba(44,26,14,0.13);
  --card-bg:#FFFFFF;
  --topbar-bg:rgba(250,246,240,0.97);
  --bnav-bg:rgba(250,246,240,0.97);
  --sw:252px;
}
html,body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;overflow-x:hidden;}

/* ── Global theme transition: every element fades together ── */
*,*::before,*::after{
  transition:
    background-color .45s ease,
    background .45s ease,
    color .45s ease,
    border-color .45s ease,
    fill .45s ease,
    stroke .45s ease,
    box-shadow .45s ease !important;
}
/* ── Override: restore correct transitions for motion elements ── */
.detail{transition:transform .4s cubic-bezier(.4,0,.2,1) !important;}
.dlv-panel,.calc-panel,.asheet{transition:transform .38s cubic-bezier(.4,0,.2,1) !important;}
.dlv-mask,.calc-mask,.spin-mask,.pin-mask,.amask{transition:opacity .3s, background-color .45s ease, background .45s ease !important;}
.lbox{transition:opacity .3s !important;}
.lbox-img{transition:transform .3s ease !important;}
.sb-knob{transition:transform .35s cubic-bezier(.34,1.56,.64,1) !important;}
.search-bar{transition:max-height .35s ease,padding .3s ease,background .45s ease,background-color .45s ease !important;}
.rc,.gc,.uc{transition:transform .32s cubic-bezier(.34,1.56,.64,1),box-shadow .45s ease !important;}
.mlc{transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .45s ease !important;}
.pill{transition:transform .22s cubic-bezier(.34,1.56,.64,1),background .45s ease,background-color .45s ease,color .45s ease,border-color .45s ease,box-shadow .22s !important;}
.tb-icon-btn{transition:transform .25s,background .45s ease,background-color .45s ease,border-color .45s ease,color .45s ease !important;}
.cfb{transition:opacity .2s,transform .2s !important;}
.mi{transition:opacity .4s,transform .4s !important;}
.toast{transition:opacity .3s,transform .3s !important;}
.photo-card{transition:transform .25s cubic-bezier(.34,1.56,.64,1) !important;}
.spin-btn{transition:transform .2s,box-shadow .2s !important;}
.lbox-close,.lbox-nav,.lbox-zoom{transition:background .2s !important;}
img{transition:transform .4s !important;}
.spin-result{animation:popIn .4s cubic-bezier(.34,1.56,.64,1);}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:var(--gd);border-radius:4px;}

/* LAYOUT */
.shell{display:flex;height:100vh;overflow:hidden;background:var(--bg);}
.main{flex:1;min-width:0;display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--bg);}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;background:var(--bg);}
.pages{background:var(--bg);}
.page{display:none;}
.page.on{display:block;}
.page.off-r{display:none;}
.pi{padding:22px 20px 32px;background:var(--bg);}

/* SIDEBAR */
.sidebar{width:var(--sw);min-width:var(--sw);background:#2C1A0E;display:none;flex-direction:column;height:100vh;overflow-y:auto;padding:0 0 24px;z-index:10;}
.sb-brand{padding:28px 22px 20px;border-bottom:1px solid rgba(255,255,255,.07);}
.sb-hello{font-size:11px;color:rgba(232,196,122,.5);letter-spacing:1.2px;text-transform:uppercase;}
.sb-name{font-family:'Playfair Display',serif;font-size:23px;font-weight:900;color:#fff;line-height:1;}
.sb-nav{padding:16px 10px;display:flex;flex-direction:column;gap:2px;flex:1;}
.sb-btn{display:flex;align-items:center;gap:11px;padding:10px 13px;border:none;background:transparent;cursor:pointer;border-radius:12px;color:rgba(255,255,255,.5);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;transition:all .2s;text-align:left;width:100%;}
.sb-btn:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.9);}
.sb-btn.on{background:var(--gd);color:#2C1A0E;font-weight:700;}
.sb-btn .ico{font-size:15px;width:20px;text-align:center;}
.sb-sep{height:1px;background:rgba(255,255,255,.06);margin:8px 14px;}
.sb-lbl{font-size:10px;color:rgba(232,196,122,.38);text-transform:uppercase;letter-spacing:1.2px;padding:5px 14px 3px;font-weight:600;}
.sb-foot{padding:12px 10px 0;border-top:1px solid rgba(255,255,255,.07);}
.sb-admin-btn{display:flex;align-items:center;gap:9px;width:100%;padding:11px 13px;background:rgba(212,168,83,.12);border:1px solid rgba(212,168,83,.22);border-radius:12px;cursor:pointer;color:var(--gd2);font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;transition:all .2s;}
.sb-admin-btn:hover{background:rgba(212,168,83,.24);}
.sb-search{padding:14px 10px 6px;}
.sb-search-inner{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:0 12px;}
.sb-search-inner:focus-within{border-color:var(--gd);}
.sb-search-inner svg{color:rgba(255,255,255,.4);flex-shrink:0;}
.sb-search-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;color:#fff;padding:9px 0;outline:none;}
.sb-search-inp::placeholder{color:rgba(255,255,255,.3);}
.sb-theme-row{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);cursor:pointer;margin-bottom:8px;transition:background .2s;}
.sb-theme-row:hover{background:rgba(255,255,255,.1);}
.sb-theme-label{flex:1;font-size:13px;font-weight:600;color:rgba(255,255,255,.65);font-family:'DM Sans',sans-serif;}
.sb-toggle{width:38px;height:21px;background:rgba(255,255,255,.15);border-radius:20px;position:relative;transition:background .3s;flex-shrink:0;}
.sb-toggle.on{background:var(--gd);}
.sb-knob{position:absolute;top:2.5px;left:2.5px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 4px rgba(0,0,0,.25);}
.sb-toggle.on .sb-knob{transform:translateX(17px);}
/* Sidebar delivery btn */
.sb-dlv-btn{display:flex;align-items:center;gap:9px;width:100%;padding:10px 13px;background:rgba(22,163,74,.12);border:1px solid rgba(22,163,74,.22);border-radius:12px;cursor:pointer;color:#4ade80;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;transition:all .2s;margin-bottom:8px;}
.sb-dlv-btn:hover{background:rgba(22,163,74,.22);}

/* TOPBAR */
.topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:var(--topbar-bg);backdrop-filter:blur(16px);border-bottom:1px solid rgba(128,100,60,.12);flex-shrink:0;z-index:20;gap:10px;}
.tb-left .tb-hello{font-size:11px;font-weight:300;color:var(--mt);}
.tb-left .tb-name{font-family:'Playfair Display',serif;font-size:19px;font-weight:900;color:var(--tx);line-height:1;}
.tb-right{display:flex;gap:8px;align-items:center;flex-shrink:0;}
.tb-icon-btn{width:38px;height:38px;background:var(--bg2);border:1.5px solid var(--bg3);border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tx);transition:all .25s;position:relative;overflow:hidden;flex-shrink:0;}
.tb-icon-btn:hover{background:var(--bg3);transform:scale(1.07);}
.tb-admin-btn{width:38px;height:38px;background:var(--gd);border:none;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#2C1A0E;transition:transform .2s;box-shadow:0 3px 10px var(--sh);flex-shrink:0;}
.tb-admin-btn:hover{transform:scale(1.1) rotate(15deg);}

.t-icon{position:absolute;transition:transform .38s cubic-bezier(.34,1.56,.64,1),opacity .28s;}
.t-icon.sun{transform:translateY(0) rotate(0deg);opacity:1;}
.t-icon.sun.gone{transform:translateY(-30px) rotate(80deg);opacity:0;}
.t-icon.moon{transform:translateY(30px) rotate(-80deg);opacity:0;}
.t-icon.moon.here{transform:translateY(0) rotate(0deg);opacity:1;}
/* green dot on delivery btn */
.dlv-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;background:#16A34A;border-radius:50%;border:1.5px solid var(--bg2);}

/* SEARCH BAR */
.search-bar{overflow:hidden;max-height:0;background:var(--topbar-bg);border-bottom:1px solid rgba(128,100,60,.1);flex-shrink:0;transition:max-height .35s,padding .3s;}
.search-bar.open{max-height:72px;padding:10px 18px;}
.search-inner{display:flex;align-items:center;gap:10px;background:var(--card-bg);border:1.5px solid var(--bg3);border-radius:13px;padding:0 14px;transition:border-color .2s;box-shadow:0 2px 8px var(--sh);}
.search-inner:focus-within{border-color:var(--gd);}
.search-inner svg{color:var(--mt);flex-shrink:0;}
.search-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--tx);padding:11px 0;outline:none;}
.search-inp::placeholder{color:var(--mt);}
.search-clear{background:none;border:none;cursor:pointer;color:var(--mt);font-size:18px;padding:2px;}

/* BOTTOM NAV */
.bnav{display:flex;background:var(--bnav-bg);backdrop-filter:blur(18px);border-top:1px solid rgba(128,100,60,.12);padding:8px 10px max(14px,env(safe-area-inset-bottom));gap:4px;flex-shrink:0;}
.nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 4px;border:none;background:transparent;cursor:pointer;border-radius:12px;transition:all .22s;}
.nb.on{background:var(--gd);}
.nb-lbl{font-size:11px;font-weight:600;color:var(--mt);}
.nb.on .nb-lbl,.nb.on svg{color:#2C1A0E;}
.nb svg{color:var(--mt);}

/* SECTION TITLE */
.stitle{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--tx);margin:0 0 13px;display:flex;align-items:baseline;gap:8px;transition:color .35s;}
.stitle small{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:var(--mt);}
.sec-div{height:1px;background:var(--bg3);margin:24px 0 18px;}

/* MENUS PAGE TABS */
.menus-tabs{display:flex;align-items:center;gap:8px;margin-bottom:18px;}
.menus-tabs-left{display:flex;gap:8px;flex:1;}
.mtab{flex:1;padding:10px 14px;border-radius:13px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--mt);transition:all .22s;display:flex;align-items:center;justify-content:center;gap:7px;}
.mtab:hover{background:var(--bg2);color:var(--tx);}
.mtab.on{background:var(--gd);color:#2C1A0E;border-color:var(--gd);box-shadow:0 4px 14px var(--sh);}
.fav-count{background:#E53E3E;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;min-width:20px;text-align:center;}
.mtab.on .fav-count{background:rgba(44,26,14,.3);color:#2C1A0E;}
.sort-wrap{position:relative;}
.sort-btn{width:38px;height:38px;border-radius:12px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;color:var(--mt);display:flex;align-items:center;justify-content:center;transition:all .22s;flex-shrink:0;}
.sort-btn:hover,.sort-btn.active{background:var(--bg2);color:var(--tx);border-color:var(--gd);}
.sort-dropdown{position:absolute;right:0;top:44px;background:var(--card);border:1.5px solid var(--bg3);border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);min-width:160px;z-index:200;overflow:hidden;}
.sort-opt{display:flex;align-items:center;gap:9px;padding:11px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--tx);cursor:pointer;transition:background .15s;}
.sort-opt:hover{background:var(--bg2);}
.sort-opt.chosen{color:var(--gd);font-weight:700;}
.sort-opt .sochk{width:16px;height:16px;border-radius:50%;border:2px solid var(--bg3);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sort-opt.chosen .sochk{background:var(--gd);border-color:var(--gd);}


/* RECENT STRIP */
.rstrip{display:flex;gap:13px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:6px;}
.rstrip::-webkit-scrollbar{height:0;}
.rstrip-wrap{position:relative;}
.rstrip-arrow{display:none;}
@media(min-width:640px){
  .rstrip-arrow{display:flex;position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--card-bg);border:1.5px solid var(--bg3);color:var(--tx);font-size:18px;align-items:center;justify-content:center;cursor:pointer;z-index:2;box-shadow:0 2px 10px var(--sh);transition:background .18s,box-shadow .18s;}
  .rstrip-arrow:hover{background:var(--gd);color:#fff;box-shadow:0 4px 16px rgba(212,168,83,.35);}
  .rstrip-arrow:disabled{opacity:.3;cursor:default;pointer-events:none;}
  .rstrip-arrow.left{left:-16px;}
  .rstrip-arrow.right{right:-16px;}
}
.rc{flex:0 0 clamp(135px,21vw,192px);height:clamp(162px,25vw,220px);border-radius:18px;overflow:hidden;position:relative;cursor:pointer;scroll-snap-align:start;box-shadow:0 5px 20px var(--sh);transition:transform .32s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;}
.rc:hover{transform:translateY(-6px) scale(1.025);box-shadow:0 16px 36px var(--sh);}
.rc img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
.rc:hover img{transform:scale(1.07);}
.rc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,5,.92) 0%,transparent 55%);display:flex;flex-direction:column;justify-content:flex-end;padding:11px;}
.rc-name{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:#fff;line-height:1.2;}
.rc-tags{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;}
.rc-tag{font-size:9px;color:var(--gd2);background:rgba(212,168,83,.22);border-radius:6px;padding:1px 5px;font-weight:600;}
.rc-star{position:absolute;top:9px;right:9px;background:rgba(20,10,5,.72);backdrop-filter:blur(6px);border-radius:20px;padding:3px 8px;font-size:11px;color:var(--gd2);font-weight:700;}

/* FAVORITE OVERLAY ELEMENTS */
@keyframes pop{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
.fav-badge{position:absolute;top:9px;left:9px;width:28px;height:28px;background:rgba(229,62,62,.88);backdrop-filter:blur(6px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(229,62,62,.4);animation:pop .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none;}
.cw{position:relative;}
.cfb{position:absolute;top:9px;left:9px;width:28px;height:28px;background:rgba(255,255,255,.18);backdrop-filter:blur(6px);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;opacity:0;transition:opacity .2s,transform .2s,background .2s;z-index:3;}
.cw:hover .cfb{opacity:1;}
.cfb.cfb-on{opacity:1;background:rgba(229,62,62,.88);}
.cfb:hover{transform:scale(1.15);}

/* CAT PILLS */
.pills{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px;}
.pill{padding:7px 14px;border-radius:50px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--tx);transition:all .22s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;}
.pill:hover{background:var(--bg2);transform:translateY(-2px);}
.pill.on{background:var(--gd);color:#2C1A0E;border-color:var(--gd);box-shadow:0 4px 14px var(--sh);transform:translateY(-2px);}

/* GRIDS */
.grid-cards{display:grid;gap:13px;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));}
.grid-upd{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));}
.grid-cats{display:grid;gap:13px;grid-template-columns:repeat(auto-fill,minmax(162px,1fr));}
.grid-menus{display:grid;gap:13px;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));}
.grid-mgallery{display:grid;gap:13px;grid-template-columns:repeat(auto-fill,minmax(196px,1fr));}

/* GENERIC CARD */
.gc{border-radius:17px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 5px 18px var(--sh);transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;aspect-ratio:4/3;}
.gc:hover{transform:translateY(-5px);box-shadow:0 14px 32px var(--sh);}
.gc img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
.gc:hover img{transform:scale(1.06);}
.gc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,5,.9) 0%,transparent 58%);display:flex;flex-direction:column;justify-content:flex-end;padding:11px;}
.gc-name{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:#fff;line-height:1.2;}
.gc-tags{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;}
.gc-tag{font-size:9px;color:var(--gd2);background:rgba(212,168,83,.22);border-radius:6px;padding:1px 5px;font-weight:600;}
.gc-star{position:absolute;top:9px;right:9px;background:rgba(20,10,5,.72);backdrop-filter:blur(6px);border-radius:20px;padding:3px 8px;font-size:11px;color:var(--gd2);font-weight:700;}

/* UPDATED CARD */
.uc{border-radius:14px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 4px 14px var(--sh);transition:transform .3s cubic-bezier(.34,1.56,.64,1);aspect-ratio:1;}
.uc:hover{transform:scale(1.06);}
.uc img{width:100%;height:100%;object-fit:cover;}
.uc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,5,.85) 0%,transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:6px;}
.uc-name{font-size:9px;font-weight:700;color:#fff;line-height:1.2;}
.uc-badge{position:absolute;top:5px;right:5px;background:var(--gd);border-radius:7px;padding:2px 6px;font-size:8px;font-weight:700;color:#2C1A0E;}

/* MENU LIST CARD */
.mlc{background:var(--card-bg);border-radius:16px;overflow:hidden;box-shadow:0 4px 14px var(--sh);cursor:pointer;transition:transform .3s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;position:relative;}
.mlc:hover{transform:translateY(-3px);}
.mlc-img{width:84px;height:84px;object-fit:cover;flex-shrink:0;}
.mlc-info{padding:11px 12px;flex:1;min-width:0;}
.mlc-name{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mlc-upd{font-size:11px;color:var(--mt);margin-top:2px;}
.mlc-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;}
.mlc-tag{background:var(--bg2);color:var(--tx);font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;}
.mlc-arr{padding:0 13px;color:var(--gd);font-size:22px;}
.mlc-fav{width:30px;height:30px;border:none;background:rgba(229,62,62,.08);border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s;flex-shrink:0;margin-right:2px;}
.mlc-fav:hover{background:rgba(229,62,62,.18);transform:scale(1.15);}
.mlc-fav.mlc-fav-on{background:rgba(229,62,62,.15);}

/* EMPTY FAVORITES */
.fav-empty{text-align:center;padding:56px 24px;color:var(--mt);}
.fav-empty .fei{font-size:54px;margin-bottom:14px;opacity:.55;}

/* CAT SECTION HEADER */
.csec-hdr{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--tx);margin:22px 0 11px;padding-bottom:8px;border-bottom:2px solid var(--bg3);display:flex;align-items:center;gap:7px;}
.csec-hdr span{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:var(--mt);}
.search-empty{text-align:center;padding:48px 20px;color:var(--mt);}
.search-empty .sei{font-size:40px;margin-bottom:10px;}

/* DELIVERY PANEL */
.dlv-mask{position:fixed;inset:0;z-index:550;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .3s;display:flex;justify-content:flex-end;}
.dlv-mask.open{opacity:1;pointer-events:all;}
.dlv-panel{width:min(360px,100vw);height:100%;background:var(--bg);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .38s cubic-bezier(.4,0,.2,1);box-shadow:-8px 0 40px rgba(0,0,0,.25);}
.dlv-mask.open .dlv-panel{transform:translateX(0);}
.dlv-hdr{padding:20px 18px 16px;border-bottom:1px solid var(--bg3);display:flex;align-items:center;gap:12px;flex-shrink:0;transition:border-color .35s;}
.dlv-icon{width:40px;height:40px;background:linear-gradient(135deg,#16A34A,#4ade80);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.dlv-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--tx);flex:1;}
.dlv-sub{font-size:11px;color:var(--mt);}
.dlv-close{width:32px;height:32px;background:var(--bg2);border:none;border-radius:9px;cursor:pointer;font-size:16px;color:var(--tx);display:flex;align-items:center;justify-content:center;transition:transform .2s;}
.dlv-close:hover{transform:rotate(90deg);}
.dlv-body{flex:1;overflow-y:auto;padding:14px 18px 24px;}
.dlv-card{background:var(--card-bg);border-radius:15px;padding:13px 14px;margin-bottom:10px;box-shadow:0 3px 12px var(--sh);display:flex;align-items:center;gap:12px,box-shadow .2s,transform .2s;}
.dlv-card:hover{box-shadow:0 6px 20px var(--sh);transform:translateY(-2px);}
.dlv-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#16A34A,#4ade80);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;font-weight:700;color:#fff;}
.dlv-info{flex:1;min-width:0;}
.dlv-name{font-weight:700;font-size:14px;color:var(--tx);}
.dlv-phone{font-size:12px;color:var(--mt);margin-top:2px;}
.dlv-call-btn{padding:8px 14px;background:#16A34A;color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap;text-decoration:none;transition:all .2s;flex-shrink:0;font-family:'DM Sans',sans-serif;}
.dlv-call-btn:hover{background:#15803D;transform:translateY(-1px);}
.dlv-empty{text-align:center;padding:48px 20px;color:var(--mt);}
.dlv-empty .dei{font-size:48px;margin-bottom:12px;}

/* DETAIL PANEL */
.detail{position:fixed;inset:0;z-index:500;background:var(--bg);transform:translateX(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);overflow-y:auto;}
.detail.open{transform:translateX(0);}
.dh{position:relative;height:clamp(220px,32vw,400px);}
.dh img{width:100%;height:100%;object-fit:cover;}
.dh-fade{position:absolute;inset:0;background:linear-gradient(to top,var(--bg) 8%,transparent 55%);}
.back{position:absolute;top:max(18px,env(safe-area-inset-top,18px));left:18px;width:42px;height:42px;background:rgba(20,10,5,.65);backdrop-filter:blur(10px);border:none;border-radius:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:all .2s;}
.back:hover{background:rgba(20,10,5,.9);transform:scale(1.08);}
.dh-fav{position:absolute;top:max(18px,env(safe-area-inset-top,18px));right:18px;width:42px;height:42px;background:rgba(20,10,5,.65);backdrop-filter:blur(10px);border:none;border-radius:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .2s;}
.dh-fav:hover{transform:scale(1.1);}
.dh-fav.dh-fav-on{background:rgba(229,62,62,.75);}
.db{padding:0 clamp(20px,5vw,64px) 60px;margin-top:-14px;position:relative;max-width:960px;margin-left:auto;margin-right:auto;}
.d-name{font-family:'Playfair Display',serif;font-size:clamp(24px,4vw,36px);font-weight:900;color:var(--tx);transition:color .35s;}
.d-meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 6px;}
.d-cat{background:var(--gd);color:#2C1A0E;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
.d-rat{color:var(--gd);font-weight:700;font-size:14px;}
.d-upd{font-size:12px;color:var(--mt);}
.d-desc{color:var(--mt);font-size:15px;line-height:1.75;margin:12px 0 22px;max-width:580px;}

/* ACTION BUTTONS */
.action-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px;}
.see-btn{flex:1;min-width:160px;padding:14px 24px;background:var(--gd);color:#2C1A0E;border:none;border-radius:15px;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 6px 22px var(--sh);display:flex;align-items:center;justify-content:center;gap:8px;}
.see-btn:hover{transform:translateY(-3px);box-shadow:0 12px 30px var(--sh);filter:brightness(1.08);}
.call-btn{flex:1;min-width:140px;padding:14px 24px;background:#16A34A;color:#fff;border:none;border-radius:15px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 6px 22px rgba(22,163,74,.3);display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;}
.call-btn:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(22,163,74,.4);background:#15803D;}
.call-btn svg{animation:ring 2.5s ease-in-out infinite;}
@keyframes ring{0%,100%{transform:rotate(0);}10%{transform:rotate(-14deg);}20%{transform:rotate(12deg);}30%{transform:rotate(-10deg);}40%{transform:rotate(8deg);}50%{transform:rotate(0);}}
.mgal-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--tx);margin:26px 0 13px;}
.mi{border-radius:14px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 4px 14px var(--sh);opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s,box-shadow .3s;}
.mi.vis{opacity:1;transform:translateY(0);}
.mi:hover{box-shadow:0 10px 26px var(--sh);transform:translateY(-4px) !important;}
.mi img{width:100%;height:100%;object-fit:cover;}

/* ADMIN MODAL */
.amask{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:600;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}
.amask.open{opacity:1;pointer-events:all;}
.asheet{background:var(--bg);border-radius:22px 22px 0 0;width:100%;max-width:700px;max-height:90vh;overflow-y:auto;transform:translateY(100%);transition:transform .38s cubic-bezier(.4,0,.2,1);padding-bottom:32px;}
.amask.open .asheet{transform:translateY(0);}
.ahdr{display:flex;justify-content:space-between;align-items:center;padding:20px 22px 14px;position:sticky;top:0;background:var(--bg);z-index:1;border-bottom:1px solid var(--bg3);}
.atitle{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--tx);}
.xbtn{width:32px;height:32px;background:var(--bg2);border:none;border-radius:9px;cursor:pointer;font-size:16px;color:var(--tx);display:flex;align-items:center;justify-content:center;transition:transform .2s;}
.xbtn:hover{transform:rotate(90deg) scale(1.1);}
.atabs{display:flex;gap:6px;padding:12px 22px;border-bottom:1px solid var(--bg3);overflow-x:auto;}
.atab{flex-shrink:0;padding:7px 13px;border-radius:10px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;font-size:12px;font-weight:600;color:var(--tx);transition:all .2s;white-space:nowrap;}
.atab.on{background:var(--gd);color:#2C1A0E;border-color:var(--gd);}
.abody{padding:16px 22px;}
.frow{display:grid;gap:11px;grid-template-columns:repeat(auto-fill,minmax(196px,1fr));}
.fg{margin-bottom:12px;}
.fl{font-size:11px;font-weight:700;color:var(--mt);text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px;display:block;}
.fi{width:100%;padding:10px 12px;border:1.5px solid var(--bg3);border-radius:10px;background:var(--card-bg);font-family:'DM Sans',sans-serif;font-size:14px;color:var(--tx);outline:none;transition:border-color .2s,color .35s;}
.fi:focus{border-color:var(--gd);}
.cat-checks{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px;}
.cat-check{display:flex;align-items:center;gap:5px;cursor:pointer;}
.cat-check input{width:15px;height:15px;accent-color:var(--gd);}
.cat-check span{font-size:13px;font-weight:500;color:var(--tx);}
.asub{width:100%;padding:12px;background:var(--gd);color:#2C1A0E;border:none;border-radius:12px;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;margin-top:6px;}
.asub:hover{filter:brightness(1.1);transform:translateY(-2px);}
.ari{display:flex;align-items:center;gap:11px;padding:11px;background:var(--card-bg);border-radius:12px;margin-bottom:9px;box-shadow:0 2px 8px var(--sh);}
.ari-img{width:50px;height:50px;border-radius:9px;object-fit:cover;flex-shrink:0;}
.ari-info{flex:1;min-width:0;}
.ari-name{font-weight:700;font-size:14px;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ari-cat{font-size:11px;color:var(--mt);}
.ebtn{padding:6px 11px;background:var(--bg2);color:var(--tx);border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;flex-shrink:0;}
.ebtn:hover{background:var(--gd);color:#2C1A0E;}
.dbtn{padding:6px 11px;background:#FEE2E2;color:#DC2626;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;flex-shrink:0;}
.dbtn:hover{background:#DC2626;color:#fff;}
.ith{position:relative;width:64px;height:64px;border-radius:9px;overflow:hidden;flex-shrink:0;}
.ith img{width:100%;height:100%;object-fit:cover;}
.ith-del{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(220,38,38,.9);border:none;border-radius:50%;color:#fff;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.iths{display:flex;flex-wrap:wrap;gap:7px;margin:7px 0;}
.iarow{display:flex;gap:7px;margin-top:5px;}
.iainp{flex:1;padding:8px 11px;border:1.5px solid var(--bg3);border-radius:9px;background:var(--card-bg);font-family:'DM Sans',sans-serif;font-size:13px;color:var(--tx);outline:none;transition:border-color .2s;}
.iainp:focus{border-color:var(--gd);}
.iabtn{padding:8px 14px;background:var(--gd);color:#2C1A0E;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:15px;}
.asec{margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--bg3);}
.asec:last-child{border-bottom:none;}
.ebanner{background:#FEF3C7;border-radius:9px;padding:9px 13px;margin-bottom:13px;font-size:13px;color:#92400E;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
.canceledit{background:none;border:none;cursor:pointer;color:#92400E;text-decoration:underline;font-size:13px;}
/* Delivery admin rows */
.dlv-arow{display:flex;align-items:center;gap:9px;padding:11px;background:var(--card-bg);border-radius:12px;margin-bottom:9px;box-shadow:0 2px 8px var(--sh);}
.dlv-arow input{flex:1;min-width:0;padding:7px 10px;border:1.5px solid var(--bg3);border-radius:8px;background:var(--bg2);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
.dlv-arow input:focus{border-color:var(--gd);}
.empty-s{text-align:center;padding:44px 20px;color:var(--mt);}
.empty-s .ei{font-size:40px;margin-bottom:10px;}

/* IMAGE EDIT OVERLAYS */
.img-edit-wrap{position:relative;display:block;}
.img-edit-wrap:hover .img-edit-btn,.img-edit-wrap:hover .cover-edit-btn{opacity:1;}
.img-edit-btn{position:absolute;bottom:7px;right:7px;background:rgba(20,10,5,.75);backdrop-filter:blur(6px);border:none;border-radius:9px;color:#fff;font-size:11px;font-weight:700;padding:5px 9px;cursor:pointer;display:flex;align-items:center;gap:5px;opacity:0;transition:opacity .2s,transform .2s;z-index:4;white-space:nowrap;}
.img-edit-btn:hover{transform:scale(1.07);background:var(--gd);color:#2C1A0E;}
.cover-edit-btn{position:absolute;bottom:20px;right:20px;background:rgba(20,10,5,.72);backdrop-filter:blur(10px);border:none;border-radius:12px;color:#fff;font-size:13px;font-weight:700;padding:9px 16px;cursor:pointer;display:flex;align-items:center;gap:7px;opacity:0;transition:opacity .25s,transform .2s;z-index:4;}
.cover-edit-btn:hover{transform:translateY(-2px);background:var(--gd);color:#2C1A0E;}
/* make .mi position:relative for overlay to work */
.mi{position:relative;}
/* ith replace btn in admin */
.ith-replace{position:absolute;bottom:2px;left:2px;width:20px;height:20px;background:rgba(212,168,83,.9);border:none;border-radius:50%;color:#2C1A0E;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;}
.ith-replace:hover{background:var(--gd);}

.rate-editor{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;}
.rate-stars{display:flex;gap:3px;}
.rate-star{font-size:22px;cursor:pointer;transition:transform .15s;line-height:1;background:none;border:none;padding:2px;}
.rate-star:hover{transform:scale(1.25);}
.rate-inp{width:64px;padding:7px 10px;border:1.5px solid var(--bg3);border-radius:9px;background:var(--card-bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;outline:none;text-align:center;transition:border-color .2s;}
.rate-inp:focus{border-color:var(--gd);}
.rate-save{padding:7px 16px;background:var(--gd);color:#2C1A0E;border:none;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer;transition:all .2s;white-space:nowrap;}
.rate-save:hover{filter:brightness(1.1);}

/* PHOTOS SECTION in detail */
.photos-section{margin-top:32px;}
.photos-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px;}
.photos-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--tx);display:flex;align-items:baseline;gap:8px;}
.photos-count{font-size:12px;color:var(--mt);font-family:'DM Sans',sans-serif;font-weight:400;}
.photo-upload-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--gd);color:#2C1A0E;border:none;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 3px 12px var(--sh);}
.photo-upload-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
.grid-photos{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));}
.photo-card{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:1;cursor:pointer;box-shadow:0 3px 12px var(--sh);transition:transform .25s cubic-bezier(.34,1.56,.64,1);}
.photo-card:hover{transform:scale(1.04);}
.photo-card img{width:100%;height:100%;object-fit:cover;}
.photo-card-del{position:absolute;top:5px;right:5px;width:22px;height:22px;background:rgba(220,38,38,.85);border:none;border-radius:50%;color:#fff;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;}
.photo-card:hover .photo-card-del{opacity:1;}
.photo-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:36px 20px;background:var(--bg2);border-radius:16px;border:2px dashed var(--bg3);cursor:pointer;text-align:center;transition:all .2s;}
.photo-empty:hover{border-color:var(--gd);background:var(--bg3);}
.photo-empty-ico{font-size:38px;}
.photo-empty p{font-size:13px;color:var(--mt);}
.photo-empty b{font-size:13px;color:var(--tx);font-weight:600;}

/* LIGHTBOX */
.lbox{position:fixed;inset:0;z-index:900;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;overflow:hidden;}
.lbox.open{opacity:1;pointer-events:all;}
.lbox-img-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;}
.lbox-img{max-width:92vw;max-height:86vh;border-radius:12px;object-fit:contain;user-select:none;-webkit-user-drag:none;}
.lbox-img.zoomed{max-width:none;max-height:none;width:auto;height:auto;}
.lbox-close{position:absolute;top:18px;right:18px;width:40px;height:40px;background:rgba(255,255,255,.12);border:none;border-radius:50%;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2;}
.lbox-close:hover{background:rgba(255,255,255,.28);}
.lbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;background:rgba(255,255,255,.12);border:none;border-radius:50%;color:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2;}
.lbox-nav:hover{background:rgba(255,255,255,.24);}
.lbox-prev{left:16px;} .lbox-next{right:16px;}
.lbox-info{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.55);color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;white-space:nowrap;z-index:2;}
.lbox-zoom{width:40px;height:40px;background:rgba(255,255,255,.12);border:none;border-radius:50%;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;}
.lbox-zoom:hover:not(:disabled){background:rgba(255,255,255,.28);}
.lbox-zoom:disabled{opacity:.35;cursor:default;}
.lbox-zoom-group{position:absolute;top:18px;left:18px;display:flex;gap:7px;z-index:2;}
.lbox-drag-hint{position:absolute;bottom:52px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.5);color:rgba(255,255,255,.7);padding:4px 14px;border-radius:20px;font-size:11px;white-space:nowrap;z-index:2;pointer-events:none;animation:fadeHint 2.5s ease forwards;}
@keyframes fadeHint{0%{opacity:0;} 20%{opacity:1;} 70%{opacity:1;} 100%{opacity:0;}}
/* Image protection — disable right-click save and drag */
img{-webkit-user-drag:none;user-drag:none;-webkit-touch-callout:none;}
.mi img,.photo-card img,.uc img,.rc img,.mlc-img,.dh img,.ith img{pointer-events:none;}

/* CALCULATOR PANEL */
.calc-mask{position:fixed;inset:0;z-index:560;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .3s;display:flex;justify-content:flex-end;}
.calc-mask.open{opacity:1;pointer-events:all;}
.calc-panel{width:min(420px,100vw);height:100%;background:var(--bg);display:flex;flex-direction:column);transform:translateX(100%);transition:transform .38s cubic-bezier(.4,0,.2,1);box-shadow:-8px 0 40px rgba(0,0,0,.22);}
.calc-mask.open .calc-panel{transform:translateX(0);}
.calc-hdr{padding:18px 18px 14px;border-bottom:1px solid var(--bg3);display:flex;align-items:center;gap:10px;flex-shrink:0;transition:border-color .35s;}
.calc-icon-wrap{width:40px;height:40px;background:linear-gradient(135deg,#7C3AED,#A78BFA);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.calc-hdr-text{flex:1;}
.calc-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:800;color:var(--tx);}
.calc-sub{font-size:11px;color:var(--mt);margin-top:1px;}
.calc-close{width:32px;height:32px;background:var(--bg2);border:none;border-radius:9px;cursor:pointer;font-size:16px;color:var(--tx);display:flex;align-items:center;justify-content:center;transition:transform .2s;}
.calc-close:hover{transform:rotate(90deg);}
/* Currency row */
.calc-currency-row{padding:10px 18px;border-bottom:1px solid var(--bg3);display:flex;align-items:center;gap:8px;flex-shrink:0;}
.calc-currency-lbl{font-size:12px;font-weight:600;color:var(--mt);flex:1;}
.calc-currency-btns{display:flex;gap:5px;}
.calc-curr-btn{padding:5px 12px;border-radius:8px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;font-size:12px;font-weight:700;color:var(--mt);transition:all .18s;}
.calc-curr-btn.on{background:var(--gd);color:#2C1A0E;border-color:var(--gd);}
/* Body */
.calc-body{flex:1;overflow-y:auto;padding:14px 18px;}
/* Person card */
.calc-person{background:var(--card-bg);border-radius:16px;padding:14px 15px;margin-bottom:11px;box-shadow:0 3px 14px var(--sh),box-shadow .2s;}
.calc-person:hover{box-shadow:0 6px 22px var(--sh);}
.calc-person-top{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.calc-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#A78BFA);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;}
.calc-name-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;color:var(--tx);outline:none;border-bottom:1.5px solid transparent;transition:border-color .2s;padding:2px 0;}
.calc-name-inp:focus{border-color:var(--gd);}
.calc-name-inp::placeholder{color:var(--mt);}
.calc-del-person{width:28px;height:28px;background:#FEE2E2;border:none;border-radius:8px;cursor:pointer;color:#DC2626;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .18s;flex-shrink:0;}
.calc-del-person:hover{background:#DC2626;color:#fff;transform:scale(1.1);}
/* Meals row */
.calc-rows{display:flex;flex-direction:column;gap:8px;}
.calc-row{display:flex;align-items:center;gap:8px;}
.calc-row-lbl{font-size:12px;color:var(--mt);font-weight:600;width:52px;flex-shrink:0;}
.calc-num-ctrl{display:flex;align-items:center;gap:0;background:var(--bg2);border-radius:10px;overflow:hidden;border:1.5px solid var(--bg3);}
.calc-num-btn{width:32px;height:32px;border:none;background:transparent;cursor:pointer;font-size:18px;font-weight:700;color:var(--tx);display:flex;align-items:center;justify-content:center;transition:background .15s;}
.calc-num-btn:hover{background:var(--gd);color:#2C1A0E;}
.calc-num-val{min-width:36px;text-align:center;font-size:14px;font-weight:700;color:var(--tx);}
.calc-price-inp{flex:1;padding:7px 10px;border:1.5px solid var(--bg3);border-radius:10px;background:var(--card-bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;outline:none;transition:border-color .2s;text-align:right;}
.calc-price-inp:focus{border-color:var(--gd);}
.calc-row-total{min-width:72px;text-align:right;font-size:14px;font-weight:700;color:var(--gd);flex-shrink:0;}
/* Add person btn */
.calc-add-btn{width:100%;padding:11px;border:2px dashed var(--bg3);border-radius:14px;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:var(--mt);display:flex;align-items:center;justify-content:center;gap:7px;transition:all .2s;margin-top:4px;}
.calc-add-btn:hover{border-color:var(--gd);color:var(--tx);background:var(--bg2);}
/* Footer totals */
.calc-footer{padding:16px 18px;border-top:1px solid var(--bg3);flex-shrink:0;background:var(--bg),border-color .35s;}
.calc-totals{background:var(--bg2);border-radius:14px;padding:14px 16px;margin-bottom:12px;}
.calc-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.calc-total-row:last-child{margin-bottom:0;}
.calc-total-lbl{font-size:12px;color:var(--mt);font-weight:500;}
.calc-total-val{font-size:13px;font-weight:700;color:var(--tx);}
.calc-grand{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:linear-gradient(135deg,#7C3AED,#6D28D9);border-radius:14px;}
.calc-grand-lbl{font-size:14px;font-weight:700;color:rgba(255,255,255,.8);}
.calc-grand-val{font-size:22px;font-weight:900;color:#fff;font-family:'Playfair Display',serif;}
/* Meal picker */
.mpicker-mask{position:fixed;inset:0;z-index:700;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;}
.mpicker-sheet{width:min(480px,100vw);max-height:80vh;background:var(--bg);border-radius:22px 22px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,.3);}
.mpicker-hdr{padding:16px 18px 12px;border-bottom:1px solid var(--bg3);display:flex;align-items:center;gap:10px;flex-shrink:0;}
.mpicker-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:800;color:var(--tx);flex:1;}
.mpicker-close{width:30px;height:30px;background:var(--bg2);border:none;border-radius:8px;cursor:pointer;color:var(--tx);font-size:15px;display:flex;align-items:center;justify-content:center;}
.mpicker-rest-row{padding:10px 18px;border-bottom:1px solid var(--bg3);display:flex;gap:8px;flex-shrink:0;overflow-x:auto;}
.mpicker-rest-chip{padding:6px 14px;border-radius:20px;border:1.5px solid var(--bg3);background:transparent;cursor:pointer;font-size:12px;font-weight:700;color:var(--mt);white-space:nowrap;transition:all .18s;flex-shrink:0;}
.mpicker-rest-chip.on{background:var(--gd);color:#2C1A0E;border-color:var(--gd);}
.mpicker-body{flex:1;overflow-y:auto;padding:10px 18px 20px;}
.mpicker-cat{margin-bottom:14px;}
.mpicker-cat-title{font-size:11px;font-weight:800;color:var(--mt);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px;padding-right:2px;}
.mpicker-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:11px;cursor:pointer;transition:background .15s;gap:10px;}
.mpicker-item:hover{background:var(--bg2);}
.mpicker-item-name{font-size:13px;font-weight:600;color:var(--tx);direction:rtl;text-align:right;flex:1;}
.mpicker-item-price{font-size:13px;font-weight:800;color:var(--gd);white-space:nowrap;flex-shrink:0;}

/* Reset */
.calc-reset{width:100%;margin-top:10px;padding:10px;background:var(--bg3);border:none;border-radius:11px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:var(--mt);transition:all .2s;}
.calc-reset:hover{background:#FEE2E2;color:#DC2626;}
@media(min-width:1024px){.calc-panel{margin-left:var(--sw);}}

/* PIN DIALOG */
.pin-mask{position:fixed;inset:0;z-index:700;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s;}
.pin-mask.open{opacity:1;pointer-events:all;}
.pin-box{background:var(--bg);border-radius:22px;padding:32px 28px 28px;width:min(320px,92vw);box-shadow:0 24px 60px rgba(0,0,0,.35);text-align:center;}
.pin-icon{font-size:36px;margin-bottom:8px;}
.pin-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:var(--tx);margin-bottom:4px;}
.pin-sub{font-size:13px;color:var(--mt);margin-bottom:22px;}
.pin-dots{display:flex;justify-content:center;gap:14px;margin-bottom:20px;}
.pin-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--bg3);background:transparent;transition:all .2s;}
.pin-dot.filled{background:var(--gd);border-color:var(--gd);transform:scale(1.15);}
.pin-dot.err{background:#E53E3E;border-color:#E53E3E;animation:shake .35s ease;}
@keyframes shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-5px);}40%{transform:translateX(5px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);}}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;}
.pin-key{height:52px;border-radius:13px;border:1.5px solid var(--bg3);background:var(--card-bg);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:18px;font-weight:700;color:var(--tx);transition:all .15s;display:flex;align-items:center;justify-content:center;}
.pin-key:hover{background:var(--bg2);border-color:var(--gd);}
.pin-key:active{transform:scale(.93);background:var(--gd);color:#2C1A0E;}
.pin-key.pin-del{font-size:20px;color:var(--mt);}
.pin-cancel{width:100%;padding:11px;background:transparent;border:1.5px solid var(--bg3);border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--mt);transition:all .2s;}
.pin-cancel:hover{background:var(--bg2);color:var(--tx);}

/* SPIN WHEEL */
.spin-mask{position:fixed;inset:0;z-index:650;background:rgba(0,0,0,.65);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;padding:16px;}
.spin-mask.open{opacity:1;pointer-events:all;}
.spin-box{background:var(--bg);border-radius:26px;width:min(480px,100%);max-height:92vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.4);}
.spin-hdr{padding:20px 22px 14px;border-bottom:1px solid var(--bg3);display:flex;align-items:center;gap:11px;transition:border-color .35s;}
.spin-hdr-ico{width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#F59E0B,#EF4444);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.spin-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:var(--tx);flex:1;}
.spin-close{width:32px;height:32px;background:var(--bg2);border:none;border-radius:9px;cursor:pointer;font-size:15px;color:var(--tx);display:flex;align-items:center;justify-content:center;transition:transform .2s;}
.spin-close:hover{transform:rotate(90deg);}
/* Selector */
.spin-select-area{padding:16px 22px 0;}
.spin-select-lbl{font-size:11px;font-weight:700;color:var(--mt);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px;}
.spin-slots{display:flex;flex-direction:column;gap:8px;}
.spin-slot{display:flex;align-items:center;gap:9px;}
.spin-slot-num{width:22px;height:22px;border-radius:50%;background:var(--gd);color:#2C1A0E;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.spin-slot-select{flex:1;padding:9px 12px;border:1.5px solid var(--bg3);border-radius:11px;background:var(--card-bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;outline:none;cursor:pointer;transition:border-color .2s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%238B6F5C' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;}
.spin-slot-select:focus{border-color:var(--gd);}
/* Wheel canvas area */
.spin-wheel-area{padding:20px 22px;display:flex;flex-direction:column;align-items:center;gap:20px;}
.spin-wheel-wrap{
  position:relative;
  width:min(290px,74vw);height:min(290px,74vw);
}
.spin-wheel-stage{
  width:100%;height:100%;
  border-radius:50%;
  box-shadow:0 6px 32px rgba(0,0,0,.28), 0 2px 8px rgba(0,0,0,.18);
}
.spin-wheel-canvas{border-radius:50%;display:block;width:100%;height:100%;}
.spin-wheel-wrap::after{display:none;}
.spin-btn{padding:13px 40px;background:linear-gradient(135deg,#F59E0B,#EF4444);border:none;border-radius:14px;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(239,68,68,.35);transition:all .2s;letter-spacing:.3px;}
.spin-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(239,68,68,.4);}
.spin-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
/* Result */
.spin-result{margin:0 22px 20px;padding:18px;background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(239,68,68,.1));border:1.5px solid rgba(245,158,11,.3);border-radius:16px;text-align:center;animation:popIn .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes popIn{from{transform:scale(.7);opacity:0;}to{transform:scale(1);opacity:1;}}
.spin-result-lbl{font-size:11px;color:var(--mt);font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;}
.spin-result-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:var(--tx);}
.spin-result-open{margin-top:10px;padding:9px 22px;background:var(--gd);color:#2C1A0E;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:filter .2s;}
.spin-result-open:hover{filter:brightness(1.1);}

/* TOAST */
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(14px);background:var(--gd);color:#2C1A0E;padding:10px 22px;border-radius:50px;font-size:13px;font-weight:700;opacity:0;transition:all .3s;z-index:700;pointer-events:none;white-space:nowrap;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

/* STAGGER */
@keyframes fu{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.fu{opacity:0;animation:fu .42s ease forwards;}
.fu:nth-child(1){animation-delay:.04s}.fu:nth-child(2){animation-delay:.08s}
.fu:nth-child(3){animation-delay:.13s}.fu:nth-child(4){animation-delay:.18s}
.fu:nth-child(5){animation-delay:.23s}.fu:nth-child(6){animation-delay:.28s}
.fu:nth-child(7){animation-delay:.33s}.fu:nth-child(8){animation-delay:.38s}
.fu:nth-child(9){animation-delay:.43s}.fu:nth-child(10){animation-delay:.48s}

@media(min-width:640px){
  .topbar{padding:14px 26px;} .search-bar.open{padding:10px 26px;}
  .pi{padding:24px 26px 100px;}
  .grid-cards{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
  .grid-upd{grid-template-columns:repeat(auto-fill,minmax(115px,1fr));}
  .bnav{padding:9px 26px max(14px,env(safe-area-inset-bottom));}
}
@media(min-width:1024px){
  .sidebar{display:flex;} .topbar{display:none;} .search-bar{display:none!important;} .bnav{display:none;}
  .pi{padding:34px 42px 40px;}
  .grid-cards{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));}
  .grid-upd{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));}
  .grid-cats{grid-template-columns:repeat(auto-fill,minmax(205px,1fr));}
  .grid-menus{grid-template-columns:repeat(auto-fill,minmax(290px,1fr));}
  .grid-mgallery{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));}
  .detail{left:var(--sw);} .dlv-panel{margin-left:var(--sw);}
  .spin-mask{left:var(--sw);}
  .amask{align-items:center;}
  .asheet{border-radius:20px;transform:scale(.94);}
  .amask.open .asheet{transform:scale(1);}
  .stitle{font-size:20px;}
}
@media(min-width:1440px){
  :root{--sw:264px;}
  .pi{padding:38px 58px 56px;}
  .grid-cards{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
  .grid-mgallery{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));}
  .rc{flex:0 0 210px;height:240px;} .dh{height:430px;}
}
`;

// SVGs
const GearSVG = ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const SearchSVG = ()=><svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const PhoneSVG  = ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.07 6.07l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.76 2.01z"/></svg>;
const TruckSVG  = ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const CalcSVG   = ()=><svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>;
const SpinSVG   = ()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="16.24" y2="7.76"/><line x1="7.76" y1="16.24" x2="4.93" y2="19.07"/></svg>;

export default function App(){
  const [intro,setIntro] = useState(true);
  const [introHide,setIntroHide] = useState(false);
  useEffect(()=>{
    const t1=setTimeout(()=>setIntroHide(true),5500);
    const t2=setTimeout(()=>setIntro(false),6050);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  const [rests,setRests]           = useState(()=>{try{const s=localStorage.getItem("ms_rests");return s?JSON.parse(s):INITIAL_RESTAURANTS;}catch{return INITIAL_RESTAURANTS;}});
  const [menuSort,setMenuSort]     = useState(()=>{try{const s=localStorage.getItem("ms_sort");return s&&s!=="featured"?s:"rating";}catch{return "rating";}});
  const [sortOpen,setSortOpen]     = useState(false);
  const [page,setPage]             = useState("home");
  // persist rests (lastSeen etc) and sort preference
  useEffect(()=>{try{localStorage.setItem("ms_rests",JSON.stringify(rests));}catch{}},[rests]);
  useEffect(()=>{try{localStorage.setItem("ms_sort",menuSort);}catch{}},[menuSort]);
  useEffect(()=>{
    if(!sortOpen) return;
    const handler=e=>{if(!e.target.closest(".sort-wrap"))setSortOpen(false);};
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[sortOpen]);
  const [catFilter,setCatFilter]   = useState("All");
  const [sel,setSel]               = useState(null);
  const [detailOpen,setDetailOpen] = useState(false);
  const [menuVis,setMenuVis]       = useState(false);
  const [adminOpen,setAdminOpen]   = useState(false);
  const [aTab,setATab]             = useState("add");
  const [toastMsg,setToastMsg]     = useState("");
  const [toastShow,setToastShow]   = useState(false);
  const [editR,setEditR]           = useState(null);
  const [imgInput,setImgInput]     = useState({});
  const [searchOpen,setSearchOpen] = useState(false);
  const [searchQ,setSearchQ]       = useState("");
  const [sbSearch,setSbSearch]     = useState("");
  const [dark,setDark]             = useState(false);
  const [favorites,setFavorites]   = useState(new Set());
  const [menusTab,setMenusTab]     = useState("all");
  const [deliveries,setDeliveries] = useState(INITIAL_DELIVERIES);
  const [dlvOpen,setDlvOpen]       = useState(false);
  const [dlvForm,setDlvForm]       = useState({name:"",phone:""});
  const [editDlv,setEditDlv]       = useState(null);
  const [form,setForm]             = useState({name:"",categories:["Crispy"],phone:"",description:"",coverImage:"",menuImages:""});
  const searchRef = useRef(null);
  const photoInputRef = useRef(null);
  const recentRef = useRef(null);
  const [lbox,setLbox]             = useState({open:false,imgs:[],idx:0,zoom:0,x:0,y:0,dragging:false,startX:0,startY:0,lastX:0,lastY:0});
  const [ratingEdit,setRatingEdit] = useState({}); // {id: tempRating}
  const [calcOpen,setCalcOpen]     = useState(false);
  const [calcCurrency] = useState("ج.م");
  const [spinOpen,setSpinOpen]   = useState(false);
  const [spinSlots,setSpinSlots] = useState(["","","",""]);
  const [spinResult,setSpinResult] = useState(null);
  const [spinning,setSpinning]   = useState(false);
  const [spinAngle,setSpinAngle] = useState(0);
  const spinCanvasRef = useRef(null);
  const [pinOpen,setPinOpen]   = useState(false);
  const [pinVal,setPinVal]     = useState("");
  const [pinErr,setPinErr]     = useState(false);
  const PIN_CODE = "0512";
  const [calcPeople,setCalcPeople] = useState([
    {id:1, name:"شخص 1", meals:[]},
  ]);
  const [mealPickerOpen,setMealPickerOpen] = useState(null); // personId
  const [mealPickerRest,setMealPickerRest] = useState(null); // restaurant id or null

  const RESTAURANT_MENUS = {
    "كشري السلطان": [
      {cat:"كشرى السلطان",  items:[{name:"كشرى لوكس",price:20},{name:"كشرى الشيخ",price:25},{name:"كشرى سوبر",price:30},{name:"كشرى ميجا",price:35},{name:"كشرى السلطان",price:40},{name:"كشرى عائلى",price:45},{name:"كشرى جامبو",price:50}]},
      {cat:"الاضافات",       items:[{name:"أضافة فراخ",price:20},{name:"أضافة لحمة",price:15},{name:"أضافة كبدة",price:15},{name:"أضافة سجق",price:15},{name:"بصل",price:10},{name:"سلطة",price:10},{name:"مخلل",price:10},{name:"حمص",price:10},{name:"عدس",price:10},{name:"عيش توست",price:7},{name:"صلصة",price:10},{name:"شطة زيت",price:5}]},
      {cat:"مكرونات السلطان",items:[{name:"مكرونة سادة",price:25},{name:"مكرونة بالكبدة",price:30},{name:"مكرونة لحمة",price:30},{name:"مكرونة سجق",price:30},{name:"مكرونة فراخ",price:40}]},
      {cat:"حواوشى السلطان",items:[{name:"حواوشى أسكندرانى",price:30},{name:"حواوشى أسكندرانى كبير",price:40},{name:"حواوشى وش بيتزا (صغير)",price:60},{name:"حواوشى وش بيتزا (كبير)",price:80}]},
      {cat:"سندوتشات",       items:[{name:"سجق",price:17},{name:"كبدة",price:17}]},
      {cat:"ميكسات السلطان", items:[{name:"مكس سادة (كشرى&طاجن)",price:40},{name:"مكس لحمة (كشرى&طاجن)",price:50},{name:"مكس سجق (كشرى&طاجن)",price:50},{name:"مكس كبدة (كشرى&طاجن)",price:50},{name:"مكس فراخ (كشرى&طاجن)",price:60},{name:"طاجن موزريلا سادة",price:40},{name:"طاجن موزريلا لحمة",price:50},{name:"طاجن موزريلا كبدة",price:50},{name:"طاجن موزريلا فراخ",price:55}]},
      {cat:"حلو السلطان",    items:[{name:"أرز بلن عادى",price:12},{name:"أرز بلبن فرن",price:15}]},
      {cat:"تلاجة السلطان",  items:[{name:"كانز",price:15},{name:"ماكس أكشن",price:10},{name:"مياة",price:6}]},
    ],
    "بلودان": [
      {cat:"ركن الغربي",      items:[{name:"ساندوتش كرسبي ص",price:55},{name:"ساندوتش كرسبي ك",price:80},{name:"ساندوتش زنجر ص",price:55},{name:"ساندوتش زنجر ك",price:80},{name:"ساندوتش اسكالوب ص",price:55},{name:"ساندوتش اسكالوب ك",price:80},{name:"ساندوتش فاهيتا ص",price:65},{name:"ساندوتش فاهيتا ك",price:80},{name:"ساندوتش كرنشي ص",price:65},{name:"ساندوتش كرنشي ك",price:80},{name:"ساندوتش شيش ص",price:60},{name:"ساندوتش شيش ك",price:85},{name:"ساندوتش ملك الموت",price:110}]},
      {cat:"وجبات غربي",      items:[{name:"وجبه مكساتو 4 ق",price:150},{name:"وجبه فاهيتا 4 ق",price:150},{name:"وجبه شيش 6 ق",price:150},{name:"وجبه شريحات مولعه بالحمض",price:150},{name:"وجبه كرسبي 3 ق",price:120},{name:"وجبه كرسبي 4 ق",price:150},{name:"وجبه زنجر 3 ق",price:120},{name:"وجبه زنجر 4 ق",price:150},{name:"وجبه اسكالوب 3 ق",price:120},{name:"وجبه اسكالوب 4 ق",price:150},{name:"وجبه كرانش 3 ق",price:130},{name:"وجبه كرانش 4 ق",price:160}]},
      {cat:"وجبه اللمه",      items:[{name:"وجبه كرستيانو",price:170},{name:"وجبه ميسي",price:170},{name:"وجبه ابوتريكه",price:190},{name:"وجبه شيكابالا",price:190},{name:"وجبه موصلاح",price:250}]},
      {cat:"ركن بلودان",      items:[{name:"ماريا شاورما",price:90},{name:"ماريا كرسبي",price:100},{name:"ماريا فاهيتا",price:110},{name:"ماريا بلودان",price:120}]},
      {cat:"الفطور",           items:[{name:"ساندوتش كيدز",price:15},{name:"ساندوتش صيامي",price:25},{name:"ساندوتش عادي",price:30},{name:"ساندوتش موزريلا",price:35},{name:"ساندوتش شيدر",price:40},{name:"ساندوتش ميكس جبن",price:45},{name:"ساندوتش الترا بولودان",price:70}]},
      {cat:"شاورما",           items:[{name:"ساندوتش شاورما صاج",price:50},{name:"ساندوتش شاورما وسط",price:70},{name:"ساندوتش نار وبخار",price:60},{name:"ساندوتش شاورما اكستره",price:85},{name:"وجبه عربي سنجل",price:85},{name:"وجبه عربي دبل",price:140},{name:"وجبه عربي عائلي",price:300},{name:"وجبه شاورما كبير 200 جرام",price:175},{name:"وجبه نص كيلو شاورما",price:260},{name:"وجبه كيلو شاورما",price:495}]},
      {cat:"الفته",            items:[{name:"فته شاورما صغيره",price:90},{name:"فته شاورما كبيره",price:110},{name:"فته كرسبي ص",price:100},{name:"فته كرسبي ك",price:120},{name:"فته فاهيتا ص",price:100},{name:"فته فاهيتا ك",price:120},{name:"فته قنبله ص",price:150}]},
      {cat:"ركن مشويات ع الفحم",items:[{name:"ربع فرخه ساده",price:90},{name:"ربع فرخه ورك",price:100},{name:"ربع فرخه صدر",price:110},{name:"نص فرخه",price:200},{name:"فرخه كامله",price:400},{name:"فرخه كامله ساده",price:320},{name:"نص فرخه ساده",price:160}]},
      {cat:"عروض السعاده",    items:[{name:"2 ق كرسبي+ساندوتش شاورما+بطاطس+توميه+عيش+رز",price:140},{name:"ماريا شاورما+كرسبي عربي (عرض الملك)",price:140},{name:"ماريا كرسبي+شاورما عربي (عرض الملكه)",price:140},{name:"1 ق كرسبي+سيخ شيش+شاورما عربي+بطاطس+ارز+توميه+عيش",price:140},{name:"1 ق كرسبي+1 ق اسكالوب+شاورما بطاطس+ارز+توميه+عيش (عرض السنجل)",price:130}]},
      {cat:"الاضافات",         items:[{name:"توميه صغير",price:10},{name:"توميه كبير",price:20},{name:"كلوسلو صغير",price:15},{name:"كلوسلو كبير",price:25},{name:"واحد عيش",price:3},{name:"ارز بسمتي",price:25}]},
      {cat:"وجبة بلودان",      items:[{name:"وجبة بلودان",price:300}]},
    ],
  };

  // dark mode
  useEffect(()=>{
    const r=document.documentElement;
    r.style.transition='background .5s ease,color .5s ease';
    if(dark){
      r.style.setProperty('--bg','#111217');r.style.setProperty('--bg2','#1C1E26');r.style.setProperty('--bg3','#252830');
      r.style.setProperty('--tx','#F0EBE3');r.style.setProperty('--mt','#7A8099');r.style.setProperty('--sh','rgba(0,0,0,0.4)');
      r.style.setProperty('--card-bg','#1C1E26');r.style.setProperty('--topbar-bg','rgba(14,15,20,0.97)');r.style.setProperty('--bnav-bg','rgba(14,15,20,0.97)');
      r.style.setProperty('--gd','#D4A853');r.style.setProperty('--gd2','#F0D080');
      document.body.style.background='#111217';document.body.style.color='#F0EBE3';
    }else{
      r.style.setProperty('--bg','#FAF6F0');r.style.setProperty('--bg2','#F2EBE0');r.style.setProperty('--bg3','#EDE3D6');
      r.style.setProperty('--tx','#1A0F07');r.style.setProperty('--mt','#8B6F5C');r.style.setProperty('--sh','rgba(44,26,14,0.13)');
      r.style.setProperty('--card-bg','#FFFFFF');r.style.setProperty('--topbar-bg','rgba(250,246,240,0.97)');r.style.setProperty('--bnav-bg','rgba(250,246,240,0.97)');
      r.style.setProperty('--gd','#D4A853');r.style.setProperty('--gd2','#E8C47A');
      document.body.style.background='#FAF6F0';document.body.style.color='#1A0F07';
    }
  },[dark]);

  // keyboard PIN entry (desktop only)
  useEffect(()=>{
    const handler = (e)=>{
      if(!pinOpen) return;
      if(e.key>='0'&&e.key<='9') pinPress(e.key);
      if(e.key==='Backspace') pinDel();
      if(e.key==='Escape'){setPinOpen(false);setPinVal('');}
    };
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  },[pinOpen, pinVal, pinErr]);

  // sync detail panel when rests changes (photos, rating updates)
  useEffect(()=>{
    if(sel) setSel(prev=>rests.find(r=>r.id===prev?.id)||prev);
  },[rests]);

  const toast = m=>{setToastMsg(m);setToastShow(true);setTimeout(()=>setToastShow(false),2600);};
  const go    = p=>{setPage(p);setSearchQ("");};
  const pc    = p=>p===page?"page on":"page off-r";

  // PIN logic
  const openAdminGate = ()=>{setPinVal("");setPinErr(false);setPinOpen(true);};
  const pinPress = (d)=>{
    if(pinErr){setPinErr(false);setPinVal("");}
    const next = (pinVal+d).slice(0,4);
    setPinVal(next);
    if(next.length===4){
      if(next===PIN_CODE){setPinOpen(false);setAdminOpen(true);setPinVal("");}
      else{setPinErr(true);setTimeout(()=>{setPinErr(false);setPinVal("");},700);}
    }
  };
  const pinDel = ()=>setPinVal(v=>v.slice(0,-1));

  const toggleFav=(id,e)=>{
    if(e)e.stopPropagation();
    setFavorites(prev=>{
      const n=new Set(prev);
      if(n.has(id)){n.delete(id);toast("Removed from favorites");}
      else{n.add(id);toast("Added to favorites ❤️");}
      return n;
    });
  };

  const openR  = r=>{
    const now = new Date();
    const seenStr = now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) + ' · ' + now.toLocaleDateString([],{month:'short',day:'numeric'});
    setRests(p=>p.map(x=>x.id===r.id?{...x,lastSeen:seenStr,lastSeenTs:now.getTime()}:x));
    setSel({...r,lastSeen:seenStr,lastSeenTs:now.getTime()});
    setMenuVis(false);
    setTimeout(()=>setDetailOpen(true),10);
  };
  const closeR = ()=>{setDetailOpen(false);setTimeout(()=>setSel(null),420);};
  const showMenu=()=>{
    setMenuVis(true);
    setTimeout(()=>{document.querySelectorAll('.mi').forEach((el,i)=>setTimeout(()=>el.classList.add('vis'),i*85));},60);
  };
  const toggleSearch=()=>{setSearchOpen(v=>!v);if(!searchOpen)setTimeout(()=>searchRef.current?.focus(),350);};

  const matchesCat   =(r,c)=>c==="All"||r.categories.includes(c);
  const matchesSearch=(r,q)=>!q||r.name.toLowerCase().includes(q.toLowerCase())||r.categories.some(c=>c.toLowerCase().includes(q.toLowerCase()))||r.description.toLowerCase().includes(q.toLowerCase());
  const st      = searchQ.trim()||sbSearch.trim();
  const filtered= rests.filter(r=>matchesCat(r,catFilter)&&matchesSearch(r,st));
  const [suggestionBase] = useState(()=>[...INITIAL_RESTAURANTS].sort(()=>Math.random()-.5).map(r=>r.id));
  const suggestions = useMemo(()=>{
    const newOnes = rests.filter(r=>!INITIAL_RESTAURANTS.find(x=>x.id===r.id));
    const baseOrdered = suggestionBase.map(id=>rests.find(r=>r.id===id)).filter(Boolean);
    return [...newOnes, ...baseOrdered].slice(0,7);
  },[rests,suggestionBase]);
  const lastUpd = rests.filter(r=>r.lastSeen).sort((a,b)=>b.lastSeenTs-a.lastSeenTs);
  const favRests= rests.filter(r=>favorites.has(r.id));
  const _menuBase = rests.filter(r=>matchesSearch(r,st));
  const sortedMenuRests = menuSort==="az"
    ? [..._menuBase].sort((a,b)=>a.name.localeCompare(b.name))
    : menuSort==="za"
    ? [..._menuBase].sort((a,b)=>b.name.localeCompare(a.name))
    : [..._menuBase].sort((a,b)=>(b.rating||0)-(a.rating||0));
  const grouped = CATEGORIES.filter(c=>c!=="All").reduce((a,c)=>{a[c]=rests.filter(r=>r.categories.includes(c)&&matchesSearch(r,st));return a;},{});


  // restaurant admin
  const toggleFormCat=cat=>setForm(f=>({...f,categories:f.categories.includes(cat)?f.categories.filter(c=>c!==cat):[...f.categories,cat]}));
  const submit=()=>{
    if(!form.name.trim()||!form.coverImage.trim()){toast("Name & cover image required!");return;}
    if(!form.categories.length){toast("Select at least one category!");return;}
    const imgs=form.menuImages?form.menuImages.split(",").map(s=>s.trim()).filter(Boolean):[];
    const obj={id:editR?editR.id:Date.now(),name:form.name,categories:form.categories,phone:form.phone||"+1 555-0000",description:form.description||"Delicious food awaits.",coverImage:form.coverImage,menuImages:imgs,photos:editR?editR.photos||[]:[],lastSeen:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · '+new Date().toLocaleDateString([],{month:'short',day:'numeric'}),dateAdded:new Date().toISOString().slice(0,10),rating:editR?editR.rating:4.5};
    if(editR){setRests(p=>p.map(r=>r.id===editR.id?obj:r));toast("Updated ✓");setEditR(null);}
    else{setRests(p=>[obj,...p]);toast("Added ✓");}
    setForm({name:"",categories:["Crispy"],phone:"",description:"",coverImage:"",menuImages:""});
  };
  const startEdit=r=>{setEditR(r);setForm({name:r.name,categories:r.categories||[r.category],phone:r.phone||"",description:r.description,coverImage:r.coverImage,menuImages:r.menuImages.join(", ")});setATab("add");};
  const del    =id=>{setRests(p=>p.filter(r=>r.id!==id));toast("Removed ✓");};
  const addImg =id=>{if(!imgInput[id]?.trim())return;setRests(p=>p.map(r=>r.id===id?{...r,menuImages:[...r.menuImages,imgInput[id].trim()]}:r));setImgInput(m=>({...m,[id]:""}));toast("Image added ✓");};
  const rmImg  =(id,i)=>setRests(p=>p.map(r=>r.id===id?{...r,menuImages:r.menuImages.filter((_,j)=>j!==i)}:r));

  // delivery admin
  const addDelivery=()=>{if(!dlvForm.name.trim()||!dlvForm.phone.trim()){toast("Name & phone required!");return;}setDeliveries(p=>[...p,{id:Date.now(),...dlvForm}]);setDlvForm({name:"",phone:""});toast("Delivery person added ✓");};
  const delDelivery=id=>{setDeliveries(p=>p.filter(d=>d.id!==id));toast("Removed ✓");};
  const saveEditDlv=id=>{setDeliveries(p=>p.map(d=>d.id===id?{...d,...editDlv}:d));setEditDlv(null);toast("Updated ✓");};

  // photos from device
  const handlePhotoUpload=(id,files)=>{
    if(!files||!files.length)return;
    Array.from(files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=e=>{
        setRests(p=>p.map(r=>r.id===id?{...r,photos:[...(r.photos||[]),{src:e.target.result,name:file.name,ts:Date.now()}]}:r));
      };
      reader.readAsDataURL(file);
    });
    toast(`${files.length} photo${files.length>1?"s":""} added ✓`);
  };
  const removePhoto=(rid,ts)=>setRests(p=>p.map(r=>r.id===rid?{...r,photos:(r.photos||[]).filter(ph=>ph.ts!==ts)}:r));

  // universal: read one file as base64 data URL
  const fileToDataURL=(file)=>new Promise(res=>{const rd=new FileReader();rd.onload=e=>res(e.target.result);rd.readAsDataURL(file);});

  // replace cover image from device
  const replaceCover=async(id,file)=>{
    if(!file)return;
    const src=await fileToDataURL(file);
    setRests(p=>p.map(r=>r.id===id?{...r,coverImage:src,lastSeen:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · '+new Date().toLocaleDateString([],{month:'short',day:'numeric'})}:r));
    toast("Cover image updated ✓");
  };

  // replace a single menu image from device
  const replaceMenuImg=async(id,idx,file)=>{
    if(!file)return;
    const src=await fileToDataURL(file);
    setRests(p=>p.map(r=>{
      if(r.id!==id)return r;
      const imgs=[...r.menuImages];imgs[idx]=src;
      return {...r,menuImages:imgs,lastSeen:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · '+new Date().toLocaleDateString([],{month:'short',day:'numeric'})};
    }));
    toast("Menu image replaced ✓");
  };

  // add menu image from device (used in admin images tab)
  const addMenuImgFromFile=async(id,file)=>{
    if(!file)return;
    const src=await fileToDataURL(file);
    setRests(p=>p.map(r=>r.id===id?{...r,menuImages:[...r.menuImages,src],lastSeen:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · '+new Date().toLocaleDateString([],{month:'short',day:'numeric'})}:r));
    toast("Image added ✓");
  };

  // lightbox
  const openLbox=(imgs,idx)=>setLbox({open:true,imgs,idx,zoom:0,x:0,y:0,dragging:false,startX:0,startY:0,lastX:0,lastY:0});
  const closeLbox=()=>setLbox(l=>({...l,open:false,zoom:0,x:0,y:0}));
  const lboxPrev=()=>setLbox(l=>({...l,idx:(l.idx-1+l.imgs.length)%l.imgs.length,zoom:0,x:0,y:0}));
  const lboxNext=()=>setLbox(l=>({...l,idx:(l.idx+1)%l.imgs.length,zoom:0,x:0,y:0}));
  const lboxZoomIn =()=>setLbox(l=>l.zoom<3?{...l,zoom:l.zoom+1,x:0,y:0}:l);
  const lboxZoomOut=()=>setLbox(l=>l.zoom>0?{...l,zoom:l.zoom-1,x:0,y:0}:l);

  // Mouse drag handlers
  const lboxMouseDown=(e)=>{
    if(!lbox.zoom) return;
    e.preventDefault();
    setLbox(l=>({...l,dragging:true,startX:e.clientX-l.x,startY:e.clientY-l.y}));
  };
  const lboxMouseMove=(e)=>{
    if(!lbox.dragging) return;
    e.preventDefault();
    setLbox(l=>({...l,x:e.clientX-l.startX,y:e.clientY-l.startY}));
  };
  const lboxMouseUp=()=>setLbox(l=>({...l,dragging:false}));

  // Touch drag handlers
  const lboxTouchStart=(e)=>{
    if(!lbox.zoom||e.touches.length!==1) return;
    const t=e.touches[0];
    setLbox(l=>({...l,dragging:true,startX:t.clientX-l.x,startY:t.clientY-l.y}));
  };
  const lboxTouchMove=(e)=>{
    if(!lbox.dragging||e.touches.length!==1) return;
    e.preventDefault();
    const t=e.touches[0];
    setLbox(l=>({...l,x:t.clientX-l.startX,y:t.clientY-l.startY}));
  };
  const lboxTouchEnd=()=>setLbox(l=>({...l,dragging:false}));

  // calculator helpers
  const calcPersonTotal = p => p.meals.reduce((s,m) => s + (parseFloat(m.price)||0), 0);
  const calcTotal = () => calcPeople.reduce((s,p) => s + calcPersonTotal(p), 0);

  const addCalcPerson = () => {
    setCalcPeople(p => [...p, {id:Date.now(), name:`Person ${p.length+1}`, meals:[{id:Date.now()+1, name:"Meal", price:""}]}]);
  };
  const removeCalcPerson = id => setCalcPeople(p => p.filter(x => x.id !== id));
  const updateCalcPersonName = (id, name) => setCalcPeople(p => p.map(x => x.id===id ? {...x, name} : x));

  // meal-level helpers
  const addMeal = (personId) => setCalcPeople(p => p.map(x =>
    x.id===personId ? {...x, meals:[...x.meals, {id:Date.now(), name:"", price:""}]} : x
  ));
  const selectMeal = (personId, mealName, mealPrice) => {
    setCalcPeople(p => p.map(x =>
      x.id===personId ? {...x, meals:[...x.meals, {id:Date.now(), name:mealName, price:mealPrice}]} : x
    ));
    setMealPickerOpen(null);
    setMealPickerRest(null);
  };
  const removeMeal = (personId, mealId) => setCalcPeople(p => p.map(x =>
    x.id===personId ? {...x, meals:x.meals.filter(m => m.id!==mealId)} : x
  ));
  const updateMeal = (personId, mealId, field, val) => setCalcPeople(p => p.map(x =>
    x.id===personId ? {...x, meals:x.meals.map(m => m.id===mealId ? {...m,[field]:val} : m)} : x
  ));

  const resetCalc = () => setCalcPeople([{id:Date.now(), name:"شخص 1", meals:[]}]);

  // ── SPIN WHEEL ──
  const spinColors = [
    "#E8471A", // red-orange
    "#F5A623", // amber
    "#1B9E5A", // teal green
    "#1A3A6B", // navy
    "#F5A623", // amber
    "#E8471A", // red-orange
    "#1B9E5A", // teal green
    "#1A3A6B", // navy
  ];
  const getSpinItems = ()=>spinSlots.map(id=>rests.find(r=>r.id===Number(id))).filter(Boolean);

  const drawWheel = (angleRad)=>{
    const canvas = spinCanvasRef.current;
    if(!canvas) return;
    const items = getSpinItems();
    if(items.length<1) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx=size/2, cy=size/2;
    const outerR = size/2-2;
    const innerR = outerR-12; // main wheel radius (inside the navy ring)
    const slice = (2*Math.PI)/items.length;
    ctx.clearRect(0,0,size,size);

    // ── Navy outer border ring ──
    ctx.beginPath();ctx.arc(cx,cy,outerR,0,2*Math.PI);
    ctx.fillStyle='#0F2348';ctx.fill();

    // ── White inner separator ──
    ctx.beginPath();ctx.arc(cx,cy,innerR+2,0,2*Math.PI);
    ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();

    // ── Slices ──
    items.forEach((item,i)=>{
      const start=angleRad+i*slice, end=start+slice;
      const mid=start+slice/2;
      const col=spinColors[i%spinColors.length];

      // Fill slice
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,innerR,start,end);ctx.closePath();
      ctx.fillStyle=col;ctx.fill();

      // Dark divider lines from center to rim
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(start)*innerR, cy+Math.sin(start)*innerR);
      ctx.strokeStyle='rgba(10,20,50,.7)';ctx.lineWidth=3;ctx.stroke();

      // Subtle inner lighter edge
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,innerR,start,end);ctx.closePath();
      const edgeGrad=ctx.createRadialGradient(cx,cy,innerR*0.5,cx,cy,innerR);
      edgeGrad.addColorStop(0,'rgba(255,255,255,.10)');
      edgeGrad.addColorStop(1,'rgba(0,0,0,.12)');
      ctx.fillStyle=edgeGrad;ctx.fill();

      // Label — bold, rotated, yellow for dark slices / dark for light slices
      ctx.save();
      ctx.translate(cx,cy);ctx.rotate(mid);
      const fontSize=Math.max(9,Math.min(14,145/items.length));
      ctx.font=`800 ${fontSize}px DM Sans,sans-serif`;
      ctx.textAlign='center';
      const isDark=col==='#1A3A6B'||col==='#1B9E5A';
      ctx.fillStyle=isDark?'#F5C842':'#fff';
      ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=3;
      const label=item.name.length>11?item.name.slice(0,10)+'…':item.name;
      // Position text at ~65% of radius
      const tx=(innerR*0.62);
      ctx.translate(tx,0);
      ctx.rotate(Math.PI/2); // rotate text to read outward
      ctx.fillText(label,0,0);
      ctx.restore();
    });

    // ── Outer navy ring stroke ──
    ctx.beginPath();ctx.arc(cx,cy,outerR,0,2*Math.PI);
    ctx.strokeStyle='#0A1C3E';ctx.lineWidth=3;ctx.stroke();

    // ── Inner rim line ──
    ctx.beginPath();ctx.arc(cx,cy,innerR,0,2*Math.PI);
    ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1.5;ctx.stroke();

    // ── Center hub: white circle ──
    const hubR=22;
    ctx.beginPath();ctx.arc(cx,cy,hubR,0,2*Math.PI);
    ctx.fillStyle='#fff';ctx.fill();
    ctx.strokeStyle='rgba(10,20,50,.25)';ctx.lineWidth=2;ctx.stroke();

    // Hub inner dot
    ctx.beginPath();ctx.arc(cx,cy,9,0,2*Math.PI);
    ctx.fillStyle='#E8E8E8';ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,5,0,2*Math.PI);
    ctx.fillStyle='#bbb';ctx.fill();
  };

  useEffect(()=>{ drawWheel(spinAngle*(Math.PI/180)); },[spinSlots,spinAngle,spinOpen,rests]);

  const doSpin = ()=>{
    const items = getSpinItems();
    if(items.length<2){toast("Pick at least 2 restaurants!");return;}
    setSpinResult(null);setSpinning(true);
    const winnerIdx = Math.floor(Math.random()*items.length);
    const slice = 360/items.length;
    // pointer is at right (0° = 3 o'clock in canvas). Land winner slice center at 0°.
    const landAngle = 360-(winnerIdx*slice+slice/2);
    const totalRotation = 1440+landAngle;
    const startAngle = spinAngle;
    const duration = 5000;
    const startTime = performance.now();
    const easeOut = t=>1-Math.pow(1-t,4);
    const animate = (now)=>{
      const elapsed=now-startTime;
      const progress=Math.min(elapsed/duration,1);
      const current=startAngle+totalRotation*easeOut(progress);
      const rad=(current%360)*(Math.PI/180);
      setSpinAngle(current%360);
      drawWheel(rad);
      if(progress<1){requestAnimationFrame(animate);}
      else{setSpinning(false);setSpinResult(items[winnerIdx]);}
    };
    requestAnimationFrame(animate);
  };
  const saveRating=(id)=>{
    const v=parseFloat(ratingEdit[id]);
    if(isNaN(v)||v<0||v>5){toast("Rating must be 0.0 – 5.0");return;}
    const rounded=Math.round(v*10)/10;
    setRests(p=>p.map(r=>r.id===id?{...r,rating:rounded}:r));
    setRatingEdit(m=>{const n={...m};delete n[id];return n;});
    toast("Rating updated ✓");
  };

  // card fav button component
  const CFB=({id})=>(
    <button className={`cfb${favorites.has(id)?" cfb-on":""}`} onClick={e=>toggleFav(id,e)}>
      {favorites.has(id)?"❤️":"🤍"}
    </button>
  );

  // reusable card render
  const GCard=({r,cls="gc"})=>(
    <div className={`cw ${cls} fu`} onClick={()=>openR(r)}>
      <img src={r.coverImage} alt={r.name}/>
      {favorites.has(r.id)&&<div className="fav-badge">❤️</div>}
      <CFB id={r.id}/>
      <div className="gc-star">★ {r.rating}</div>
      <div className="gc-ov">
        <div className="gc-name">{r.name}</div>
        <div className="gc-tags">{r.categories.map(c=><span key={c} className="gc-tag">{ICONS[c]} {c}</span>)}</div>
      </div>
    </div>
  );

  const navItems=[{id:"categories",lbl:"Categories"},{id:"home",lbl:"Home"},{id:"menus",lbl:"Menus"}];

  return (
    <>
      <style>{CSS}</style>

      {/* ── INTRO SCREEN ── */}
      {intro&&<div className={`intro-screen${introHide?" hide":""}`}>
        <img className="intro-logo-img" src="https://i.ibb.co/JWsKSTNv/14eadbfd-2244-4d70-b977-f31e8fdb6b36.png" alt="Logo" draggable={false} onContextMenu={e=>e.preventDefault()}/>
        <div className="loader"/>
      </div>}

      <div className={`shell${dark?" dark":""}`}>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-brand"><div className="sb-hello">Hello!</div><div className="sb-name">Marwan!</div></div>
          <div className="sb-search">
            <div className="sb-search-inner">
              <SearchSVG/>
              <input className="sb-search-inp" placeholder="Search…" value={sbSearch} onChange={e=>setSbSearch(e.target.value)}/>
              {sbSearch&&<button style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:16}} onClick={()=>setSbSearch("")}>✕</button>}
            </div>
          </div>
          <div className="sb-nav">
            <div className="sb-lbl">Navigation</div>
            {[{id:"home",ico:"🏠",lbl:"Home"},{id:"categories",ico:"🗂️",lbl:"Categories"},{id:"menus",ico:"📋",lbl:"Menus"}].map(n=>(
              <button key={n.id} className={`sb-btn${page===n.id&&!sbSearch?" on":""}`} onClick={()=>{go(n.id);setSbSearch("");}}>
                <span className="ico">{n.ico}</span>{n.lbl}
                {n.id==="menus"&&favorites.size>0&&<span style={{marginLeft:"auto",background:"#E53E3E",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20}}>{favorites.size}</span>}
              </button>
            ))}
            <div className="sb-sep"/>
            <div className="sb-lbl">Categories</div>
            {CATEGORIES.map(c=>(
              <button key={c} className={`sb-btn${catFilter===c&&page==="home"&&!sbSearch?" on":""}`} onClick={()=>{setCatFilter(c);go("home");setSbSearch("");}}>
                <span className="ico">{ICONS[c]}</span>{c}
              </button>
            ))}
          </div>
          <div className="sb-foot">
            <button className="sb-dlv-btn" onClick={()=>setDlvOpen(true)}>🚴 <span style={{flex:1}}>Delivery Team</span><span style={{background:"rgba(22,163,74,.3)",color:"#4ade80",fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20}}>{deliveries.length}</span></button>
            <button className="sb-dlv-btn" style={{background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.25)",color:"#FCD34D"}} onClick={()=>{setSpinOpen(true);setSpinResult(null);}}>🎯 <span style={{flex:1}}>Restaurant Wheel</span></button>
            <button className="sb-dlv-btn" style={{background:"rgba(124,58,237,.12)",border:"1px solid rgba(124,58,237,.22)",color:"#C4B5FD"}} onClick={()=>setCalcOpen(true)}>🧮 <span style={{flex:1}}>Receipt Calculator</span><span style={{background:"rgba(124,58,237,.3)",color:"#C4B5FD",fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20}}>{calcPeople.length}</span></button>
            <button className="sb-theme-row" onClick={()=>setDark(d=>!d)}>
              <span style={{fontSize:16}}>{dark?"☀️":"🌙"}</span>
              <span className="sb-theme-label">{dark?"Light Mode":"Dark Mode"}</span>
              <div className={`sb-toggle${dark?" on":""}`}><div className="sb-knob"/></div>
            </button>
            <button className="sb-admin-btn" onClick={openAdminGate}><GearSVG/> Admin Panel</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div className="tb-left"><div className="tb-hello">Hello!</div><div className="tb-name">Marwan!</div></div>
            <div className="tb-right">
              <button className="tb-icon-btn" onClick={toggleSearch}><SearchSVG/></button>

              {/* DELIVERY BTN */}
              <button className="tb-icon-btn" onClick={()=>setDlvOpen(true)} title="Delivery Team">
                <TruckSVG/>
                <span className="dlv-dot"/>
              </button>

              {/* SPIN WHEEL BTN */}
              <button className="tb-icon-btn" onClick={()=>{setSpinOpen(true);setSpinResult(null);}} title="Restaurant Wheel">
                <SpinSVG/>
              </button>

              {/* CALCULATOR BTN */}
              <button className="tb-icon-btn" onClick={()=>setCalcOpen(true)} title="Receipt Calculator" style={{position:"relative"}}>
                <CalcSVG/>
                {calcPeople.length>0&&<span style={{position:"absolute",top:3,right:3,width:8,height:8,background:"#7C3AED",borderRadius:"50%"}}/>}
              </button>

              {/* DARK MODE BTN */}
              <button className="tb-icon-btn" onClick={()=>setDark(d=>!d)} title={dark?"Light Mode":"Dark Mode"}>
                <span className={`t-icon sun${dark?" gone":""}`}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </span>
                <span className={`t-icon moon${dark?" here":""}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </span>
              </button>

              <button className="tb-admin-btn" onClick={openAdminGate}><GearSVG/></button>
            </div>
          </header>

          <div className={`search-bar${searchOpen?" open":""}`}>
            <div className="search-inner">
              <SearchSVG/>
              <input ref={searchRef} className="search-inp" placeholder="Search restaurants, categories…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
              {searchQ&&<button className="search-clear" onClick={()=>setSearchQ("")}>✕</button>}
            </div>
          </div>

          <div className="scroll-area">
            <div className="pages">

              {/* HOME */}
              <div className={pc("home")}>
                <div className="pi">
                  {st?(
                    <>
                      <div className="stitle">🔍 Results <small>{filtered.length} for "{st}"</small></div>
                      {filtered.length===0?<div className="search-empty"><div className="sei">🍽️</div><p>No restaurants match.</p></div>:(
                        <div className="grid-cards">{filtered.map(r=><GCard key={r.id} r={r}/>)}</div>
                      )}
                    </>
                  ):(
                    <>
                      <div className="stitle">✨ Suggestions <small>{suggestions.length} for you</small></div>
                      <div className="rstrip-wrap" style={{marginBottom:26}}>
                        <button className="rstrip-arrow left" onClick={()=>recentRef.current.scrollBy({left:-280,behavior:'smooth'})}>‹</button>
                        <div className="rstrip" ref={recentRef}>
                          {suggestions.map(r=>(
                            <div key={r.id} className="rc cw fu" onClick={()=>openR(r)}>
                              <img src={r.coverImage} alt={r.name}/>
                              {favorites.has(r.id)&&<div className="fav-badge">❤️</div>}
                              <CFB id={r.id}/>
                              <div className="rc-star">★ {r.rating}</div>
                              <div className="rc-ov"><div className="rc-name">{r.name}</div><div className="rc-tags">{r.categories.map(c=><span key={c} className="rc-tag">{ICONS[c]} {c}</span>)}</div></div>
                            </div>
                          ))}
                        </div>
                        <button className="rstrip-arrow right" onClick={()=>recentRef.current.scrollBy({left:280,behavior:'smooth'})}>›</button>
                      </div>

                      <div className="stitle">🗂️ Categories</div>
                      <div className="pills">
                        {CATEGORIES.map(c=><button key={c} className={`pill${catFilter===c?" on":""}`} onClick={()=>setCatFilter(c)}>{ICONS[c]} {c}</button>)}
                      </div>

                      {catFilter!=="All"&&(
                        <>
                          <div className="stitle" style={{marginTop:4}}>{ICONS[catFilter]} {catFilter} <small>{filtered.length} places</small></div>
                          <div className="grid-cards" style={{marginBottom:26}}>{filtered.map(r=><GCard key={r.id} r={r}/>)}</div>
                        </>
                      )}

                      {lastUpd.length>0&&(
                        <>
                          <div className="sec-div"/>
                          <div className="stitle">👁 Last Seen <small>{lastUpd.length} visited</small></div>
                          <div className="grid-upd">
                            {lastUpd.slice(0, window.innerWidth>=1024?14:6).map(r=>(
                              <div key={r.id} className="uc cw fu" onClick={()=>openR(r)}>
                                <img src={r.coverImage} alt={r.name}/>
                                {favorites.has(r.id)&&<div style={{position:"absolute",top:5,left:5,fontSize:13,filter:"drop-shadow(0 1px 2px rgba(0,0,0,.5))"}}>❤️</div>}
                                <div className="uc-badge">{r.lastSeen}</div>
                                <div className="uc-ov"><div className="uc-name">{r.name}</div></div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className={pc("categories")}>
                <div className="pi">
                  <div className="stitle">🗂️ All Categories {st&&<small>"{st}"</small>}</div>
                  {Object.keys(grouped).length===0&&<div className="search-empty"><div className="sei">🗂️</div><p>No results.</p></div>}
                  {Object.entries(grouped).map(([cat,items])=>(
                    <div key={cat}>
                      <div className="csec-hdr">{ICONS[cat]} {cat} <span>({items.length})</span></div>
                      {items.length>0
                        ? <div className="grid-cats" style={{marginBottom:8}}>{items.map(r=><GCard key={r.id} r={r} cls="gc"/>)}</div>
                        : <div style={{padding:"14px 4px 20px",color:"var(--mt)",fontSize:13,fontStyle:"italic"}}>No restaurants in this category yet.</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* MENUS */}
              <div className={pc("menus")}>
                <div className="pi">
                  <div className="menus-tabs">
                    <div className="menus-tabs-left">
                      <button className={`mtab${menusTab==="all"?" on":""}`} onClick={()=>setMenusTab("all")}>
                        📋 All Menus
                      </button>
                      <button className={`mtab${menusTab==="favorites"?" on":""}`} onClick={()=>setMenusTab("favorites")}>
                        ❤️ Favorites {favorites.size>0&&<span className="fav-count">{favorites.size}</span>}
                      </button>
                    </div>
                    <div className="sort-wrap">
                      <button className={`sort-btn${sortOpen?" active":""}`} title="Sort" onClick={()=>setSortOpen(o=>!o)}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
                        </svg>
                      </button>
                      {sortOpen&&(
                        <div className="sort-dropdown">
                          {[["rating","⭐ Most Rated"],["az","A → Z"],["za","Z → A"]].map(([val,label])=>(
                            <div key={val} className={`sort-opt${menuSort===val?" chosen":""}`} onClick={()=>{setMenuSort(val);setSortOpen(false);}}>
                              <div className="sochk">{menuSort===val&&<svg width="9" height="9" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.5" fill="#2C1A0E"/></svg>}</div>
                              {label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {menusTab==="all"&&(
                    <div className="grid-menus">
                      {sortedMenuRests.map(r=>(
                        <div key={r.id} className="mlc fu" onClick={()=>openR(r)}>
                          <img className="mlc-img" src={r.coverImage} alt={r.name}/>
                          <div className="mlc-info">
                            <div className="mlc-name">{r.name}</div>
                            <div className="mlc-upd">Seen {r.lastSeen||"Never"}</div>
                            <div className="mlc-tags">{r.categories.map(c=><span key={c} className="mlc-tag">{ICONS[c]} {c}</span>)}</div>
                          </div>
                          <button className={`mlc-fav${favorites.has(r.id)?" mlc-fav-on":""}`} onClick={e=>toggleFav(r.id,e)}>
                            {favorites.has(r.id)?"❤️":"🤍"}
                          </button>
                          <div className="mlc-arr">›</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {menusTab==="favorites"&&(
                    favRests.length===0?(
                      <div className="fav-empty">
                        <div className="fei">🤍</div>
                        <p style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"var(--tx)",marginBottom:8}}>No Favorites Yet</p>
                        <p style={{fontSize:13}}>Tap the ❤️ on any restaurant card to save it here.</p>
                      </div>
                    ):(
                      <div className="grid-menus">
                        {favRests.map(r=>(
                          <div key={r.id} className="mlc fu" onClick={()=>openR(r)}>
                            <img className="mlc-img" src={r.coverImage} alt={r.name}/>
                            <div className="mlc-info">
                              <div className="mlc-name">{r.name}</div>
                              <div className="mlc-upd">Seen {r.lastSeen||"Never"}</div>
                              <div className="mlc-tags">{r.categories.map(c=><span key={c} className="mlc-tag">{ICONS[c]} {c}</span>)}</div>
                            </div>
                            <button className="mlc-fav mlc-fav-on" onClick={e=>toggleFav(r.id,e)}>❤️</button>
                            <div className="mlc-arr">›</div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

            </div>
          </div>

          <nav className="bnav">
            {navItems.map(n=>(
              <button key={n.id} className={`nb${page===n.id?" on":""}`} onClick={()=>go(n.id)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {n.id==="home"&&<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                  {n.id==="categories"&&<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>}
                  {n.id==="menus"&&<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}
                </svg>
                <span className="nb-lbl">{n.lbl}</span>
                {n.id==="menus"&&favorites.size>0&&<span style={{position:"absolute",top:4,right:"calc(50% - 18px)",width:8,height:8,background:"#E53E3E",borderRadius:"50%"}}/>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* DELIVERY PANEL */}
      <div className={`dlv-mask${dlvOpen?" open":""}`} onClick={e=>e.target===e.currentTarget&&setDlvOpen(false)}>
        <div className={`dlv-panel${dark?" dark":""}`}>
          <div className="dlv-hdr">
            <div className="dlv-icon">🚴</div>
            <div>
              <div className="dlv-title">Delivery Team</div>
              <div className="dlv-sub">{deliveries.length} available</div>
            </div>
            <button className="dlv-close" onClick={()=>setDlvOpen(false)}>✕</button>
          </div>
          <div className="dlv-body">
            {deliveries.length===0&&(
              <div className="dlv-empty"><div className="dei">🚴</div><p>No delivery persons yet.<br/>Add them in the Admin Panel.</p></div>
            )}
            {deliveries.map(d=>(
              <div key={d.id} className="dlv-card">
                <div className="dlv-avatar">{d.name.charAt(0)}</div>
                <div className="dlv-info">
                  <div className="dlv-name">{d.name}</div>
                  <div className="dlv-phone">{d.phone}</div>
                </div>
                <a href={`tel:${d.phone}`} className="dlv-call-btn">
                  <PhoneSVG/> Call
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL PANEL */}
      <div className={`detail${dark?" dark":""}${detailOpen?" open":""}`}>
        {sel&&(
          <>
            <div className="dh">
              <img src={sel.coverImage} alt={sel.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onContextMenu={e=>e.preventDefault()} draggable={false}/>
              <div className="dh-fade"/>
              <button className="back" onClick={closeR}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className={`dh-fav${favorites.has(sel.id)?" dh-fav-on":""}`} onClick={e=>toggleFav(sel.id,e)}>
                {favorites.has(sel.id)?"❤️":"🤍"}
              </button>
              {/* COVER REPLACE BUTTON */}
              <label className="cover-edit-btn" title="Replace cover photo">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Replace Cover
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&replaceCover(sel.id,e.target.files[0])}/>
              </label>
            </div>
            <div className="db">
              <div className="d-name">{sel.name}</div>
              <div className="d-meta">
                {sel.categories.map(c=><span key={c} className="d-cat">{ICONS[c]} {c}</span>)}
                <span className="d-rat">★ {sel.rating}</span>
                <span className="d-upd">Seen {sel.lastSeen||"Not yet opened"}</span>
              </div>
              <p className="d-desc">{sel.description}</p>
              <div className="action-row">
                {!menuVis
                  ?<button className="see-btn" onClick={showMenu}>🍽️ &nbsp; See Full Menu</button>
                  :<button className="see-btn" style={{background:"var(--bg3)",color:"var(--tx)"}} onClick={()=>setMenuVis(false)}>✕ Close Menu</button>
                }
                <a href={`tel:${sel.phone}`} className="call-btn"><PhoneSVG/> Call Now</a>
              </div>
              {menuVis&&(
                <>
                  <div className="mgal-title">Menu Gallery</div>
                  {sel.menuImages.length===0
                    ?<div className="empty-s"><div className="ei">📷</div><p>No menu images yet.</p></div>
                    :<div className="grid-mgallery">{sel.menuImages.map((img,i)=>(
                      <div key={i} className="mi" onClick={()=>openLbox(sel.menuImages,i)}>
                        <img src={img} alt={`Menu ${i+1}`}/>
                      </div>
                    ))}</div>
                  }
                </>
              )}

              {/* ── RESTAURANT PHOTOS FOLDER ── */}
              <div className="photos-section">
                <div className="photos-hdr">
                  <div className="photos-title">
                    📁 Photos Folder
                    <span className="photos-count">{(sel.photos||[]).length} photo{(sel.photos||[]).length!==1?"s":""}</span>
                  </div>
                  <label className="photo-upload-btn">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Add Photos
                    <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handlePhotoUpload(sel.id,e.target.files)}/>
                  </label>
                </div>
                {(sel.photos||[]).length===0?(
                  <label className="photo-empty">
                    <div className="photo-empty-ico">🖼️</div>
                    <b>Upload photos from your device</b>
                    <p>Tap to choose images — supports JPG, PNG, WEBP</p>
                    <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handlePhotoUpload(sel.id,e.target.files)}/>
                  </label>
                ):(
                  <div className="grid-photos">
                    {(sel.photos||[]).map((ph,i)=>(
                      <div key={ph.ts} className="photo-card" onClick={()=>openLbox((sel.photos||[]).map(p=>p.src),i)}>
                        <img src={ph.src} alt={ph.name||`Photo ${i+1}`}/>
                        <button className="photo-card-del" onClick={e=>{e.stopPropagation();removePhoto(sel.id,ph.ts);}}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ADMIN MODAL */}
      <div className={`amask${dark?" dark":""}${adminOpen?" open":""}`} onClick={e=>e.target===e.currentTarget&&setAdminOpen(false)}>
        <div className="asheet">
          <div className="ahdr">
            <div className="atitle">⚙️ Admin Panel</div>
            <button className="xbtn" onClick={()=>setAdminOpen(false)}>✕</button>
          </div>
          <div className="atabs">
            {["add","manage","images","delivery"].map(t=>(
              <button key={t} className={`atab${aTab===t?" on":""}`} onClick={()=>setATab(t)}>
                {t==="add"?(editR?"✏️ Edit":"➕ Add"):t==="manage"?"🗑️ Manage":t==="images"?"🖼️ Images":"🚴 Delivery"}
              </button>
            ))}
          </div>
          <div className="abody">

            {aTab==="add"&&(
              <>
                {editR&&<div className="ebanner">Editing: {editR.name}<button className="canceledit" onClick={()=>{setEditR(null);setForm({name:"",categories:["Crispy"],phone:"",description:"",coverImage:"",menuImages:""});}}>Cancel</button></div>}
                <div className="frow">
                  <div className="fg"><label className="fl">Name</label><input className="fi" placeholder="Restaurant name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="fg"><label className="fl">Phone</label><input className="fi" placeholder="+1 555-0000" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
                </div>
                <div className="fg"><label className="fl">Categories</label><div className="cat-checks">{CATEGORIES.filter(c=>c!=="All").map(c=><label key={c} className="cat-check"><input type="checkbox" checked={form.categories.includes(c)} onChange={()=>toggleFormCat(c)}/><span>{ICONS[c]} {c}</span></label>)}</div></div>
                <div className="fg"><label className="fl">Description</label><textarea className="fi" rows="2" placeholder="Short description…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{resize:"none"}}/></div>
                <div className="fg">
                  <label className="fl">Cover Image</label>
                  <div style={{display:"flex",gap:7,alignItems:"stretch"}}>
                    <input className="fi" style={{flex:1}} placeholder="https://images.unsplash.com/…" value={form.coverImage.startsWith("data:")?"[Image from device]":form.coverImage} onChange={e=>setForm(f=>({...f,coverImage:e.target.value}))}/>
                    <label style={{padding:"0 13px",background:"var(--bg3)",border:"1.5px solid var(--bg3)",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .2s"}} title="Pick from gallery">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{if(e.target.files[0]){const s=await fileToDataURL(e.target.files[0]);setForm(f=>({...f,coverImage:s}));}}}/>
                    </label>
                  </div>
                  {form.coverImage.startsWith("data:")&&<div style={{marginTop:6,borderRadius:9,overflow:"hidden",maxHeight:90}}><img src={form.coverImage} alt="preview" style={{width:"100%",objectFit:"cover",maxHeight:90}}/></div>}
                </div>
                <div className="fg"><label className="fl">Menu Image URLs (comma separated)</label><textarea className="fi" rows="2" placeholder="https://img1.jpg, https://img2.jpg" value={form.menuImages} onChange={e=>setForm(f=>({...f,menuImages:e.target.value}))} style={{resize:"none"}}/></div>
                <button className="asub" onClick={submit}>{editR?"Update Restaurant":"Add Restaurant"}</button>
              </>
            )}

            {aTab==="manage"&&(
              <>
                {rests.length===0&&<div className="empty-s"><div className="ei">🍽️</div><p>No restaurants yet.</p></div>}
                {rests.map(r=>(
                  <div key={r.id} className="ari" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <img className="ari-img" src={r.coverImage} alt={r.name}/>
                      <div className="ari-info"><div className="ari-name">{r.name}</div><div className="ari-cat">{r.categories.map(c=>`${ICONS[c]} ${c}`).join(" · ")} · {r.menuImages.length} imgs</div></div>
                      <button className="ebtn" onClick={()=>startEdit(r)}>Edit</button>
                      <button className="dbtn" onClick={()=>del(r.id)}>Delete</button>
                    </div>
                    {/* RATING EDITOR */}
                    <div style={{paddingLeft:2}}>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--mt)",textTransform:"uppercase",letterSpacing:".6px",marginBottom:6}}>⭐ Rating</div>
                      <div className="rate-editor">
                        <div className="rate-stars">
                          {[1,2,3,4,5].map(n=>(
                            <button key={n} className="rate-star" onClick={()=>setRatingEdit(m=>({...m,[r.id]:n}))}>
                              {(ratingEdit[r.id]!==undefined?ratingEdit[r.id]:r.rating)>=n?"⭐":"☆"}
                            </button>
                          ))}
                        </div>
                        <input
                          className="rate-inp"
                          type="number" min="0" max="5" step="0.1"
                          value={ratingEdit[r.id]!==undefined?ratingEdit[r.id]:r.rating}
                          onFocus={()=>initRateEdit(r)}
                          onChange={e=>setRatingEdit(m=>({...m,[r.id]:e.target.value}))}
                        />
                        {ratingEdit[r.id]!==undefined&&(
                          <button className="rate-save" onClick={()=>saveRating(r.id)}>Save Rating</button>
                        )}
                        {ratingEdit[r.id]===undefined&&<span style={{fontSize:13,color:"var(--mt)"}}>Current: {r.rating}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {aTab==="images"&&(
              rests.map(r=>(
                <div key={r.id} className="asec">
                  <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                    {r.categories.map(c=>ICONS[c]).join("")} {r.name}
                    <span style={{fontWeight:400,fontSize:11,color:"var(--mt)",marginLeft:"auto"}}>{r.menuImages.length} image{r.menuImages.length!==1?"s":""}</span>
                  </div>

                  {/* Thumbnails with replace + delete */}
                  <div className="iths">
                    {r.menuImages.map((img,i)=>(
                      <div key={i} className="ith">
                        <img src={img} alt=""/>
                        <label className="ith-replace" title="Replace from gallery">
                          <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                          <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&replaceMenuImg(r.id,i,e.target.files[0])}/>
                        </label>
                        <button className="ith-del" onClick={()=>rmImg(r.id,i)}>✕</button>
                      </div>
                    ))}
                    {r.menuImages.length===0&&<span style={{fontSize:12,color:"var(--mt)"}}>No images yet</span>}
                  </div>

                  {/* Add from gallery — multi-select prominent button */}
                  <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"11px 14px",marginBottom:8,background:"linear-gradient(135deg,var(--gd),var(--gd2))",borderRadius:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:"#2C1A0E",boxShadow:"0 3px 12px var(--sh)",transition:"filter .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.08)"}
                    onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    📁 Add Photos from Gallery
                    <input type="file" accept="image/*" multiple style={{display:"none"}}
                      onChange={e=>{Array.from(e.target.files).forEach(f=>addMenuImgFromFile(r.id,f));e.target.value="";}}/>
                  </label>

                  {/* Add from URL */}
                  <div className="iarow">
                    <input className="iainp" placeholder="Or paste image URL…" value={imgInput[r.id]||""} onChange={e=>setImgInput(m=>({...m,[r.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addImg(r.id)}/>
                    <button className="iabtn" onClick={()=>addImg(r.id)} title="Add from URL">+</button>
                  </div>
                </div>
              ))
            )}

            {aTab==="delivery"&&(
              <>
                {/* Add form */}
                <div className="asec">
                  <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:10}}>➕ Add Delivery Person</div>
                  <div className="frow">
                    <div className="fg"><label className="fl">Full Name</label><input className="fi" placeholder="e.g. Ahmed Hassan" value={dlvForm.name} onChange={e=>setDlvForm(f=>({...f,name:e.target.value}))}/></div>
                    <div className="fg"><label className="fl">Phone Number</label><input className="fi" placeholder="+20 100-000-0000" value={dlvForm.phone} onChange={e=>setDlvForm(f=>({...f,phone:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addDelivery()}/></div>
                  </div>
                  <button className="asub" onClick={addDelivery}>Add to Team</button>
                </div>
                {/* List */}
                <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:10}}>👥 Current Team ({deliveries.length})</div>
                {deliveries.length===0&&<div className="empty-s"><div className="ei">🚴</div><p>No delivery persons yet.</p></div>}
                {deliveries.map(d=>(
                  <div key={d.id} className="dlv-arow">
                    <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#16A34A,#4ade80)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:14,flexShrink:0}}>{d.name.charAt(0)}</div>
                    {editDlv?.id===d.id?(
                      <>
                        <input value={editDlv.name} onChange={e=>setEditDlv(v=>({...v,name:e.target.value}))} placeholder="Name"/>
                        <input value={editDlv.phone} onChange={e=>setEditDlv(v=>({...v,phone:e.target.value}))} placeholder="Phone"/>
                        <button className="ebtn" onClick={()=>saveEditDlv(d.id)}>Save</button>
                        <button className="dbtn" style={{background:"var(--bg2)",color:"var(--tx)"}} onClick={()=>setEditDlv(null)}>✕</button>
                      </>
                    ):(
                      <>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:13,color:"var(--tx)"}}>{d.name}</div>
                          <div style={{fontSize:11,color:"var(--mt)"}}>{d.phone}</div>
                        </div>
                        <button className="ebtn" onClick={()=>setEditDlv({id:d.id,name:d.name,phone:d.phone})}>Edit</button>
                        <button className="dbtn" onClick={()=>delDelivery(d.id)}>Delete</button>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}

          </div>
        </div>
      </div>

      {/* ══ SPIN WHEEL ══ */}
      <div className={`spin-mask${spinOpen?" open":""}`} onClick={e=>e.target===e.currentTarget&&setSpinOpen(false)}>
        <div className="spin-box">
          {/* Header */}
          <div className="spin-hdr">
            <div className="spin-hdr-ico">🎯</div>
            <div className="spin-title">Restaurant Wheel</div>
            <button className="spin-close" onClick={()=>setSpinOpen(false)}>✕</button>
          </div>

          {/* Slot selectors */}
          <div className="spin-select-area">
            <div className="spin-select-lbl">Choose up to 4 Restaurants</div>
            <div className="spin-slots">
              {[0,1,2,3].map(i=>(
                <div key={i} className="spin-slot">
                  <div className="spin-slot-num" style={{background:spinColors[i]}}>{i+1}</div>
                  <select
                    className="spin-slot-select"
                    value={spinSlots[i]}
                    onChange={e=>{const s=[...spinSlots];s[i]=e.target.value;setSpinSlots(s);setSpinResult(null);}}
                  >
                    <option value="">— Pick a restaurant —</option>
                    {rests.map(r=>(
                      <option key={r.id} value={r.id} disabled={spinSlots.includes(String(r.id))&&spinSlots[i]!==String(r.id)}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Wheel */}
          <div className="spin-wheel-area">
            <div className="spin-wheel-wrap">
              <div className="spin-wheel-stage">
                <canvas
                  ref={spinCanvasRef}
                  className="spin-wheel-canvas"
                  width={300} height={300}
                />
              </div>
            </div>
            <button className="spin-btn" onClick={doSpin} disabled={spinning||getSpinItems().length<2}>
              {spinning?"Spinning…":"🎰 Spin!"}
            </button>
          </div>

          {/* Result */}
          {spinResult&&(
            <div className="spin-result">
              <div className="spin-result-lbl">🎉 Tonight you're eating at…</div>
              <div className="spin-result-name">{spinResult.name}</div>
              <div style={{fontSize:12,color:"var(--mt)",marginTop:4}}>{spinResult.description}</div>
              <button className="spin-result-open" onClick={()=>{setSpinOpen(false);openR(spinResult);}}>
                View Restaurant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══ RECEIPT CALCULATOR ══ */}
      <div className={`calc-mask${calcOpen?" open":""}`} onClick={e=>e.target===e.currentTarget&&setCalcOpen(false)}>
        <div className={`calc-panel${dark?" dark":""}`} style={{display:"flex",flexDirection:"column"}}>

          {/* Header */}
          <div className="calc-hdr">
            <div className="calc-icon-wrap">🧮</div>
            <div className="calc-hdr-text">
              <div className="calc-title">Receipt Calculator</div>
              <div className="calc-sub">{calcPeople.length} person{calcPeople.length!==1?"s":""} · Total: {calcCurrency} {calcTotal().toLocaleString()}</div>
            </div>
            <button className="calc-close" onClick={()=>setCalcOpen(false)}>✕</button>
          </div>

          {/* People list */}
          <div className="calc-body">
            {calcPeople.map((person)=>(
              <div key={person.id} className="calc-person">

                {/* Person name row */}
                <div className="calc-person-top">
                  <div className="calc-avatar" style={{background:`hsl(${(person.id*67)%360},60%,52%)`}}>
                    {person.name.trim().charAt(0).toUpperCase()||"?"}
                  </div>
                  <input
                    className="calc-name-inp"
                    value={person.name}
                    placeholder="Person name"
                    onChange={e=>updateCalcPersonName(person.id,e.target.value)}
                  />
                  {calcPeople.length>1&&(
                    <button className="calc-del-person" onClick={()=>removeCalcPerson(person.id)} title="Remove person">✕</button>
                  )}
                </div>

                {/* Meals list — each with its own name + price */}
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                  {person.meals.map((meal,mi)=>(
                    <div key={meal.id} style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:11,color:"var(--mt)",fontWeight:700,width:18,textAlign:"center",flexShrink:0}}>{mi+1}</span>
                      <input
                        style={{flex:1,padding:"7px 9px",border:"1.5px solid var(--bg3)",borderRadius:9,background:"var(--bg2)",color:"var(--tx)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",minWidth:0,transition:"border-color .2s"}}
                        value={meal.name}
                        placeholder="Meal name"
                        onChange={e=>updateMeal(person.id,meal.id,"name",e.target.value)}
                        onFocus={e=>e.target.style.borderColor="var(--gd)"}
                        onBlur={e=>e.target.style.borderColor="var(--bg3)"}
                      />
                      <div style={{display:"flex",alignItems:"center",gap:3,background:"var(--card-bg)",border:"1.5px solid var(--bg3)",borderRadius:9,padding:"0 8px",flexShrink:0}}>
                        <span style={{fontSize:11,color:"var(--mt)",fontWeight:700,whiteSpace:"nowrap"}}>{calcCurrency}</span>
                        <input
                          type="number" min="0"
                          style={{width:68,padding:"7px 2px",border:"none",background:"transparent",color:"var(--tx)",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,outline:"none",textAlign:"right"}}
                          value={meal.price}
                          placeholder="0"
                          onChange={e=>updateMeal(person.id,meal.id,"price",e.target.value)}
                        />
                      </div>
                      {person.meals.length>1&&(
                        <button onClick={()=>removeMeal(person.id,meal.id)} style={{width:22,height:22,background:"#FEE2E2",border:"none",borderRadius:"50%",cursor:"pointer",color:"#DC2626",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .18s"}}
                          onMouseEnter={e=>{e.target.style.background="#DC2626";e.target.style.color="#fff";}}
                          onMouseLeave={e=>{e.target.style.background="#FEE2E2";e.target.style.color="#DC2626";}}>✕</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add meal buttons */}
                <div style={{display:"flex",gap:6,marginBottom:10}}>
                  <button
                    onClick={()=>addMeal(person.id)}
                    style={{flex:1,padding:"6px 10px",border:"1.5px dashed var(--bg3)",borderRadius:9,background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"var(--mt)",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gd)";e.currentTarget.style.color="var(--tx)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bg3)";e.currentTarget.style.color="var(--mt)";}}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Meal
                  </button>
                  <button
                    onClick={()=>{setMealPickerOpen(person.id);setMealPickerRest("كشري السلطان");}}
                    style={{flex:1,padding:"6px 10px",border:"1.5px solid var(--gd)",borderRadius:9,background:"rgba(212,168,83,.1)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,color:"var(--gd)",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,168,83,.2)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,168,83,.1)";}}>
                    🍽️ Select Meal
                  </button>
                </div>

                {/* Person subtotal */}
                <div style={{paddingTop:10,borderTop:"1px solid var(--bg3)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:"var(--mt)",fontWeight:600}}>
                    {person.name||"Person"} · {person.meals.length} meal{person.meals.length!==1?"s":""}
                  </span>
                  <span style={{fontSize:16,fontWeight:900,color:"var(--gd)",fontFamily:"'Playfair Display',serif"}}>
                    {calcCurrency} {calcPersonTotal(person).toLocaleString()}
                  </span>
                </div>

              </div>
            ))}

            {/* Add person */}
            <button className="calc-add-btn" onClick={addCalcPerson}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Add Person
            </button>
          </div>

          {/* Footer totals */}
          <div className="calc-footer">
            <div className="calc-totals">
              {calcPeople.map(p=>(
                <div key={p.id} className="calc-total-row">
                  <span className="calc-total-lbl">
                    {p.name||"Person"} <span style={{opacity:.6}}>({p.meals.length} meal{p.meals.length!==1?"s":""})</span>
                  </span>
                  <span className="calc-total-val">{calcCurrency} {calcPersonTotal(p).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="calc-grand">
              <span className="calc-grand-lbl">🧾 Grand Total</span>
              <span className="calc-grand-val">{calcCurrency} {calcTotal().toLocaleString()}</span>
            </div>
            <button className="calc-reset" onClick={resetCalc}>🔄 Reset Calculator</button>
          </div>

        </div>
      </div>

      {/* ══ MEAL PICKER ══ */}
      {mealPickerOpen!==null&&(
        <div className="mpicker-mask" onClick={e=>e.target===e.currentTarget&&(setMealPickerOpen(null),setMealPickerRest(null))}>
          <div className="mpicker-sheet">
            <div className="mpicker-hdr">
              <span className="mpicker-title">🍽️ اختر وجبة</span>
              <button className="mpicker-close" onClick={()=>{setMealPickerOpen(null);setMealPickerRest(null);}}>✕</button>
            </div>
            {/* Restaurant chips */}
            <div className="mpicker-rest-row">
              {Object.keys(RESTAURANT_MENUS).map(rName=>(
                <button key={rName} className={`mpicker-rest-chip${mealPickerRest===rName?" on":""}`} onClick={()=>setMealPickerRest(rName)}>{rName}</button>
              ))}
            </div>
            {/* Menu items */}
            <div className="mpicker-body">
              {mealPickerRest&&RESTAURANT_MENUS[mealPickerRest].map(section=>(
                <div key={section.cat} className="mpicker-cat">
                  <div className="mpicker-cat-title">{section.cat}</div>
                  {section.items.map((item,i)=>(
                    <div key={i} className="mpicker-item" onClick={()=>selectMeal(mealPickerOpen,item.name,item.price)}>
                      <span className="mpicker-item-name">{item.name}</span>
                      <span className="mpicker-item-price">{calcCurrency} {item.price}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ PIN DIALOG ══ */}
      <div className={`pin-mask${pinOpen?" open":""}`} onClick={e=>e.target===e.currentTarget&&(setPinOpen(false),setPinVal(""))}>
        <div className="pin-box">
          <div className="pin-icon">🔐</div>
          <div className="pin-title">Admin Panel</div>
          <div className="pin-sub">Enter 4-digit PIN to continue</div>

          {/* dots */}
          <div className="pin-dots">
            {[0,1,2,3].map(i=>(
              <div key={i} className={`pin-dot${i<pinVal.length?" filled":""}${pinErr?" err":""}`}/>
            ))}
          </div>

          {/* numpad */}
          <div className="pin-pad">
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} className="pin-key" onClick={()=>pinPress(String(n))}>{n}</button>
            ))}
            <div/>
            <button className="pin-key" onClick={()=>pinPress("0")}>0</button>
            <button className="pin-key pin-del" onClick={pinDel}>⌫</button>
          </div>

          <button className="pin-cancel" onClick={()=>{setPinOpen(false);setPinVal("");}}>Cancel</button>
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      <div
        className={`lbox${lbox.open?" open":""}`}
        onMouseMove={lboxMouseMove}
        onMouseUp={lboxMouseUp}
        onMouseLeave={lboxMouseUp}
        onTouchMove={lboxTouchMove}
        onTouchEnd={lboxTouchEnd}
        onClick={e=>{
          if(lbox.dragging) return;
          if(e.target.classList.contains('lbox')||e.target.classList.contains('lbox-img-wrap')) closeLbox();
        }}
      >
        {lbox.open&&lbox.imgs.length>0&&(
          <>
            {/* Drag layer — catches all mouse/touch events when zoomed */}
            <div
              className="lbox-img-wrap"
              style={{cursor:lbox.zoom>0?(lbox.dragging?"grabbing":"grab"):"default"}}
            >
              <img
                className={`lbox-img${lbox.zoom>0?" zoomed":""}`}
                src={lbox.imgs[lbox.idx]}
                alt={`Photo ${lbox.idx+1}`}
                style={{
                  transform: lbox.zoom===0 ? "scale(1)"
                    : lbox.zoom===1 ? `scale(1.15) translate(${lbox.x/1.15}px,${lbox.y/1.15}px)`
                    : lbox.zoom===2 ? `scale(1.25) translate(${lbox.x/1.25}px,${lbox.y/1.25}px)`
                    : `scale(1.40) translate(${lbox.x/1.40}px,${lbox.y/1.40}px)`,
                  transition: lbox.dragging ? "none" : "transform .3s ease",
                  cursor: lbox.zoom>0 ? (lbox.dragging?"grabbing":"grab") : "default",
                  userSelect:"none",
                }}
                onMouseDown={lboxMouseDown}
                onTouchStart={lboxTouchStart}
                onContextMenu={e=>e.preventDefault()}
                draggable={false}
              />
            </div>
            {lbox.zoom>0&&<div className="lbox-drag-hint" key={lbox.idx+"hint"}>✋ Drag to pan</div>}
            <button className="lbox-close" onClick={closeLbox}>✕</button>
            <div className="lbox-zoom-group">
              <button className="lbox-zoom" onClick={lboxZoomIn} disabled={lbox.zoom>=2} title="Zoom in">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              <button className="lbox-zoom" onClick={lboxZoomOut} disabled={lbox.zoom<=0} title="Zoom out">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
            </div>
            {lbox.imgs.length>1&&lbox.zoom===0&&<>
              <button className="lbox-nav lbox-prev" onClick={e=>{e.stopPropagation();lboxPrev();}}>‹</button>
              <button className="lbox-nav lbox-next" onClick={e=>{e.stopPropagation();lboxNext();}}>›</button>
              <div className="lbox-info">{lbox.idx+1} / {lbox.imgs.length}</div>
            </>}
          </>
        )}
      </div>

      <div className={`toast${toastShow?" show":""}`}>{toastMsg}</div>
    </>
  );
}
