function a(n) {
  return 'other';
}
function b(n) {
  return n == 1 ? 'one' : 'other';
}

export const _in = a;
export const af = a;
export const am = a;
export const an = a;
export const ar = a;
export function as(n) {
  return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
}
export function az(n) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2), i1000 = i.slice(-3);
  return (i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8) || (i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80) ? 'one'
    : (i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900) ? 'few'
    : i == 0 || i10 == 6 || (i100 == 40 || i100 == 60 || i100 == 90) ? 'many'
    : 'other';
}
export function be(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? 'few' : 'other';
}
export const bg = a;
export function bn(n) {
  return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
}
export const bs = a;
export function ca(n) {
  return (n == 1 || n == 3) ? 'one'
    : n == 2 ? 'two'
    : n == 4 ? 'few'
    : 'other';
}
export const ce = a;
export const cs = a;
export function cy(n) {
  return (n == 0 || n == 7 || n == 8 || n == 9) ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n == 3 || n == 4) ? 'few'
    : (n == 5 || n == 6) ? 'many'
    : 'other';
}
export const da = a;
export const de = a;
export const dsb = a;
export const el = a;
export function en(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return n10 == 1 && n100 != 11 ? 'one'
    : n10 == 2 && n100 != 12 ? 'two'
    : n10 == 3 && n100 != 13 ? 'few'
    : 'other';
}
export const es = a;
export const et = a;
export const eu = a;
export const fa = a;
export const fi = a;
export const fil = b;
export const fr = b;
export const fy = a;
export const ga = b;
export function gd(n) {
  return (n == 1 || n == 11) ? 'one'
    : (n == 2 || n == 12) ? 'two'
    : (n == 3 || n == 13) ? 'few'
    : 'other';
}
export const gl = a;
export const gsw = a;
export function gu(n) {
  return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
}
export const he = a;
export function hi(n) {
  return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
}
export const hr = a;
export const hsb = a;
export function hu(n) {
  return (n == 1 || n == 5) ? 'one' : 'other';
}
export const hy = b;
export const ia = a;
export const id = a;
export const is = a;
export function it(n) {
  return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
}
export const iw = a;
export const ja = a;
export function ka(n) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  return i == 1 ? 'one'
    : i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60 || i100 == 80) ? 'many'
    : 'other';
}
export function kk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? 'many' : 'other';
}
export const km = a;
export const kn = a;
export const ko = a;
export function kw(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  return (t0 && n >= 1 && n <= 4) || ((n100 >= 1 && n100 <= 4) || (n100 >= 21 && n100 <= 24) || (n100 >= 41 && n100 <= 44) || (n100 >= 61 && n100 <= 64) || (n100 >= 81 && n100 <= 84)) ? 'one'
    : n == 5 || n100 == 5 ? 'many'
    : 'other';
}
export const ky = a;
export const lo = b;
export const lt = a;
export const lv = a;
export function mk(n) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2);
  return i10 == 1 && i100 != 11 ? 'one'
    : i10 == 2 && i100 != 12 ? 'two'
    : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? 'many'
    : 'other';
}
export const ml = a;
export const mn = a;
export const mo = b;
export function mr(n) {
  return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : 'other';
}
export const ms = b;
export const my = a;
export const nb = a;
export function ne(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  return (t0 && n >= 1 && n <= 4) ? 'one' : 'other';
}
export const nl = a;
export function or(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  return (n == 1 || n == 5 || (t0 && n >= 7 && n <= 9)) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
}
export const pa = a;
export const pl = a;
export const prg = a;
export const ps = a;
export const pt = a;
export const ro = b;
export const root = a;
export const ru = a;
export function sc(n) {
  return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
}
export function scn(n) {
  return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
}
export const sd = a;
export const sh = a;
export const si = a;
export const sk = a;
export const sl = a;
export function sq(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return n == 1 ? 'one'
    : n10 == 4 && n100 != 14 ? 'many'
    : 'other';
}
export const sr = a;
export function sv(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? 'one' : 'other';
}
export const sw = a;
export const ta = a;
export const te = a;
export const th = a;
export function tk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  return (n10 == 6 || n10 == 9) || n == 10 ? 'few' : 'other';
}
export const tl = b;
export const tr = a;
export function uk(n) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  return n10 == 3 && n100 != 13 ? 'few' : 'other';
}
export const ur = a;
export const uz = a;
export const vi = b;
export const yue = a;
export const zh = a;
export const zu = a;
