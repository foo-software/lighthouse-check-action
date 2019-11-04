function a(n) {
  return 'other';
}
function b(n) {
  return (n == 1) ? 'one' : 'other';
}

(function (root, plurals) {
  if (typeof define === 'function' && define.amd) {
    define(plurals);
  } else if (typeof exports === 'object') {
    if (Object.defineProperty) Object.defineProperty(plurals, '__esModule', { value: true });
    else plurals.__esModule = true;
    module.exports = plurals;
  } else {
    root.plurals = plurals;
  }
}(this, {
_in: a,

af: a,

am: a,

an: a,

ar: a,

as: function as(n) {
  return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

az: function az(n) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2), i1000 = i.slice(-3);
  return ((i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8) || (i100 == 20 || i100 == 50 || i100 == 70
          || i100 == 80)) ? 'one'
      : ((i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500
          || i1000 == 600 || i1000 == 700 || i1000 == 800
          || i1000 == 900)) ? 'few'
      : (i == 0 || i10 == 6 || (i100 == 40 || i100 == 60
          || i100 == 90)) ? 'many'
      : 'other';
},

be: function be(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return ((n10 == 2
          || n10 == 3) && n100 != 12 && n100 != 13) ? 'few' : 'other';
},

bg: a,

bn: function bn(n) {
  return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

bs: a,

ca: function ca(n) {
  return ((n == 1
          || n == 3)) ? 'one'
      : (n == 2) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
},

ce: a,

cs: a,

cy: function cy(n) {
  return ((n == 0 || n == 7 || n == 8
          || n == 9)) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((n == 3
          || n == 4)) ? 'few'
      : ((n == 5
          || n == 6)) ? 'many'
      : 'other';
},

da: a,

de: a,

dsb: a,

el: a,

en: function en(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
},

es: a,

et: a,

eu: a,

fa: a,

fi: a,

fil: b,

fr: b,

fy: a,

ga: b,

gd: function gd(n) {
  return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : ((n == 3
          || n == 13)) ? 'few'
      : 'other';
},

gl: a,

gsw: a,

gu: function gu(n) {
  return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

he: a,

hi: function hi(n) {
  return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

hr: a,

hsb: a,

hu: function hu(n) {
  return ((n == 1
          || n == 5)) ? 'one' : 'other';
},

hy: b,

ia: a,

id: a,

is: a,

it: function it(n) {
  return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
},

iw: a,

ja: a,

ka: function ka(n) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  return (i == 1) ? 'one'
      : (i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'many'
      : 'other';
},

kk: function kk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  return (n10 == 6 || n10 == 9
          || t0 && n10 == 0 && n != 0) ? 'many' : 'other';
},

km: a,

kn: a,

ko: a,

kw: function kw(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  return ((t0 && n >= 1 && n <= 4) || ((n100 >= 1 && n100 <= 4) || (n100 >= 21 && n100 <= 24)
          || (n100 >= 41 && n100 <= 44) || (n100 >= 61 && n100 <= 64)
          || (n100 >= 81 && n100 <= 84))) ? 'one'
      : (n == 5
          || n100 == 5) ? 'many'
      : 'other';
},

ky: a,

lo: b,

lt: a,

lv: a,

mk: function mk(n) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2);
  return (i10 == 1 && i100 != 11) ? 'one'
      : (i10 == 2 && i100 != 12) ? 'two'
      : ((i10 == 7
          || i10 == 8) && i100 != 17 && i100 != 18) ? 'many'
      : 'other';
},

ml: a,

mn: a,

mo: b,

mr: function mr(n) {
  return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
},

ms: b,

my: a,

nb: a,

ne: function ne(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  return ((t0 && n >= 1 && n <= 4)) ? 'one' : 'other';
},

nl: a,

or: function or(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  return ((n == 1 || n == 5
          || (t0 && n >= 7 && n <= 9))) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

pa: a,

pl: a,

prg: a,

ps: a,

pt: a,

ro: b,

root: a,

ru: a,

sc: function sc(n) {
  return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
},

scn: function scn(n) {
  return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
},

sd: a,

sh: a,

si: a,

sk: a,

sl: a,

sq: function sq(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return (n == 1) ? 'one'
      : (n10 == 4 && n100 != 14) ? 'many'
      : 'other';
},

sr: a,

sv: function sv(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return ((n10 == 1
          || n10 == 2) && n100 != 11 && n100 != 12) ? 'one' : 'other';
},

sw: a,

ta: a,

te: a,

th: a,

tk: function tk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  return ((n10 == 6 || n10 == 9)
          || n == 10) ? 'few' : 'other';
},

tl: b,

tr: a,

uk: function uk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return (n10 == 3 && n100 != 13) ? 'few' : 'other';
},

ur: a,

uz: a,

vi: b,

yue: a,

zh: a,

zu: a
}));
