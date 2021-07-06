let _GRID = document.querySelector('.hex__grid'),
CELLS = [..._GRID.children].map(c => ({ _el: c })),
CLS = 'out',
N = CELLS.length;

let win_h,hex_h,dir = 1,y_prv,_hl;

function move(ini = 0) {
  let y_nxt = _GRID.getBoundingClientRect().top,
  inn,out,min;

  if (ini !== 1) /* not initial load */
    _GRID.style.setProperty('--dir', dir = Math.sign(y_prv - y_nxt));
  y_prv = y_nxt; /* set previous y offset of grid to new one */

  /* get current vertical position for every cell */
  CELLS.forEach(c => c.y_rel = c._el.offsetTop + y_nxt);

  /* get cells that have come into viewport */
  inn = CELLS.filter(c => c._el.classList.contains(CLS) &&
  c.y_rel < win_h && c.y_rel + hex_h > 0);
  /* get cells that have gone outside viewport */
  out = CELLS.filter(c => !c._el.classList.contains(CLS) && (
  c.y_rel + hex_h < 0 || c.y_rel > win_h));

  /* if there are any cells coming into view */
  if (inn.length) {
    /* get minimum index of these cells */
    min = inn.reduce((a, c) => Math.min(a, c.i), N);
    /* set minimum reference index and remove .out class */
    inn.forEach(c => {
      c._el.style.setProperty('--min', min);
      c._el.classList.remove(CLS);
    });
  }

  out.forEach(c => c._el.classList.add(CLS));
};

function size(ini = 0) {
  win_h = window.innerHeight; /* window height */
  hex_h = CELLS[0]._el.getBoundingClientRect().height; /* hexagon height */
  move(ini); /* make hex cells slide into place if necessary */
};

CELLS.forEach(c => {
  c._el.classList.add(CLS); /* get them all out of sight initially */
  c.i = +c._el.style.getPropertyValue('--idx'); /* get hex index */
});
size(1);

addEventListener('resize', size, false);
addEventListener('scroll', move, false);

/* what happens on click */
addEventListener('click', e => {
  const _t = e.target,
  _hl = CELLS.filter(c => +getComputedStyle(c._el).getPropertyValue('--hl') === 1);

  /* if an image was clicked, bring up overlay */
  if (_t.classList.contains('hex__img')) {
    const _p = _t.parentNode;

    if (_hl.length && _p !== _hl[0]) /* and remove it from other hex, if any */
      _hl.forEach(c => c._el.style.setProperty('--hl', 0));
    _p.style.setProperty('--hl', 1);
  }
  /* otherwise, if the click was outside hexagons and there's a hex with overlay
   * remove said overlay */else
    if (_hl.length && (_t === _GRID || !_t.className.match(/hex/gi))) {
      _hl.forEach(c => c._el.style.setProperty('--hl', 0));
    }
});
