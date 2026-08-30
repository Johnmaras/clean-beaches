/*!
 * Clean Beaches Map — Χάρτης Καθαριότητας Παραλιών Αττικής
 * Copyright (C) 2026 Johnmaras
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details: <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Source: https://github.com/Johnmaras/clean-beaches
 */

document.getElementById('date').textContent = SURVEY_DATE;

const map = L.map('map', { zoomControl: true }).setView([37.83, 23.78], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors | Δεδομένα: ΠΑΚΟΕ',
  maxZoom: 19
}).addTo(map);

const color = b => b.verdict === 'K' ? '#2ecc71' : '#e74c3c';
const radius = b => 8 + Math.min(12, Math.sqrt(b.ecoli) / 2);

const markers = {};
const layer = L.layerGroup().addTo(map);

function popupHtml(b) {
  const eOver = b.ecoli > LIMITS.ecoli, nOver = b.ent > LIMITS.ent;
  return `<div class="pop">
    <h3>${b.name}</h3>
    <div class="a">${b.area}</div>
    <span class="pill ${b.verdict}">${b.verdict === 'K' ? 'ΚΑΤΑΛΛΗΛΗ ΓΙΑ ΚΟΛΥΜΒΗΣΗ' : 'ΑΚΑΤΑΛΛΗΛΗ ΓΙΑ ΚΟΛΥΜΒΗΣΗ'}</span>
    <table>
      <tr><td>E. coli (cfu/100ml)</td><td class="${eOver ? 'over' : ''}">${b.ecoli} / ${LIMITS.ecoli}</td></tr>
      <tr><td>Εντερόκοκκοι (cfu/100ml)</td><td class="${nOver ? 'over' : ''}">${b.ent} / ${LIMITS.ent}</td></tr>
      <tr><td>Περιοχή</td><td>${b.region}</td></tr>
      <tr><td>Ώρα δειγματοληψίας</td><td>${b.time}</td></tr>
      <tr><td>Συντεταγμένες</td><td>${b.lat.toFixed(5)}, ${b.lon.toFixed(5)}</td></tr>
    </table>
  </div>`;
}

BEACH_DATA.forEach(b => {
  const m = L.circleMarker([b.lat, b.lon], {
    radius: radius(b), color: '#fff', weight: 1.5,
    fillColor: color(b), fillOpacity: .85
  }).bindPopup(popupHtml(b)).bindTooltip(b.name, { direction: 'top' });
  markers[b.id] = m;
  layer.addLayer(m);
});

map.fitBounds(L.latLngBounds(BEACH_DATA.map(b => [b.lat, b.lon])).pad(0.12));

// ---- list ----
const listEl = document.getElementById('list');
let filter = 'all', query = '', region = 'all';

// region filter buttons
const regionsEl = document.getElementById('regions');
regionsEl.innerHTML = ['all', ...REGIONS].map(r =>
  `<button class="f r ${r === 'all' ? 'active' : ''}" data-r="${r}">${r === 'all' ? 'Όλες οι περιοχές' : r}</button>`
).join('');
regionsEl.querySelectorAll('.r').forEach(btn => {
  btn.onclick = () => {
    regionsEl.querySelectorAll('.r').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    region = btn.dataset.r;
    render();
  };
});

function render() {
  const q = query.trim().toLowerCase();
  const items = BEACH_DATA.filter(b =>
    (filter === 'all' || b.verdict === filter) &&
    (region === 'all' || b.region === region) &&
    (!q || (b.name + ' ' + b.area + ' ' + b.region).toLowerCase().includes(q)));

  // stats reflect the active region
  const scope = BEACH_DATA.filter(b => region === 'all' || b.region === region);
  const nOk = scope.filter(b => b.verdict === 'K').length;
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${scope.length}</b><span>Σημεία</span></div>
    <div class="stat good"><b>${nOk}</b><span>Κατάλληλες</span></div>
    <div class="stat bad"><b>${scope.length - nOk}</b><span>Ακατάλληλες</span></div>`;

  // map shows only the filtered points
  layer.clearLayers();
  items.forEach(b => layer.addLayer(markers[b.id]));

  listEl.innerHTML = items.map(b => {
    const eOver = b.ecoli > LIMITS.ecoli, nOver = b.ent > LIMITS.ent;
    return `<li class="${b.verdict}" data-id="${b.id}">
      <div class="n">${b.id}. ${b.name}</div>
      <div class="a">${b.area} &middot; <span class="reg">${b.region}</span></div>
      <div class="m">
        <span class="pill ${b.verdict}">${b.verdict === 'K' ? 'ΚΑΤΑΛΛΗΛΗ' : 'ΑΚΑΤΑΛΛΗΛΗ'}</span>
        <span class="v ${eOver ? 'over' : ''}">E. coli <b>${b.ecoli}</b></span>
        <span class="v ${nOver ? 'over' : ''}">Εντερ. <b>${b.ent}</b></span>
      </div>
    </li>`;
  }).join('') || '<li style="cursor:default;border-left-color:#20405f">Δεν βρέθηκαν παραλίες.</li>';

  listEl.querySelectorAll('li[data-id]').forEach(li => {
    li.onclick = () => {
      const b = BEACH_DATA.find(x => x.id === +li.dataset.id);
      map.flyTo([b.lat, b.lon], 15, { duration: .8 });
      markers[b.id].openPopup();
      listEl.querySelectorAll('li').forEach(x => x.classList.remove('sel'));
      li.classList.add('sel');
    };
  });
}

document.querySelectorAll('.filters:not(.regions) .f').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filters:not(.regions) .f').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.f;
    render();
  };
});
document.getElementById('search').oninput = e => { query = e.target.value; render(); };
render();

// ---- Γαλάζιες Σημαίες (ξεχωριστό επίπεδο) ----
const bfLayer = L.layerGroup();

// ομαδοποίηση εγγραφών που μοιράζονται το ίδιο σημείο ΠΑΚΟΕ
const bfGroups = {};
BLUE_FLAG_DATA.forEach(b => {
  const k = b.lat + ',' + b.lon;
  (bfGroups[k] = bfGroups[k] || []).push(b);
});

Object.values(bfGroups).forEach(group => {
  const g = group[0];
  const rows = group.map(b =>
    `<tr><td>${b.name}</td><td class="${b.verdict === 'K' ? '' : 'over'}">${b.verdict === 'K' ? 'Κατάλληλη' : 'Ακατάλληλη'}</td></tr>`).join('');
  const eOver = g.ecoli > LIMITS.ecoli, nOver = g.ent > LIMITS.ent;

  const icon = L.divIcon({
    className: 'bf-icon',
    html: '<div class="bf">⚑' + (group.length > 1 ? '<span class="cnt">' + group.length + '</span>' : '') + '</div>',
    iconSize: [26, 26], iconAnchor: [13, 13]
  });

  L.marker([g.lat, g.lon], { icon })
    .bindPopup(`<div class="pop">
      <h3>⚑ Γαλάζια Σημαία${group.length > 1 ? ' (' + group.length + ' ακτές)' : ''}</h3>
      <div class="a">${g.area}</div>
      <table>${rows}</table>
      <table>
        <tr><td>E. coli (cfu/100ml)</td><td class="${eOver ? 'over' : ''}">${g.ecoli} / ${LIMITS.ecoli}</td></tr>
        <tr><td>Εντερόκοκκοι (cfu/100ml)</td><td class="${nOver ? 'over' : ''}">${g.ent} / ${LIMITS.ent}</td></tr>
      </table>
      <p class="note">Μέτρηση στο <em>πλησιέστερο</em> σημείο δειγματοληψίας ΠΑΚΟΕ — όχι στην ίδια τη βραβευμένη ακτή.</p>
    </div>`)
    .bindTooltip(group.map(b => b.name).join(' / '), { direction: 'top' })
    .addTo(bfLayer);
});

document.getElementById('bfToggle').onchange = e => {
  if (e.target.checked) bfLayer.addTo(map); else map.removeLayer(bfLayer);
};

// ---- legend ----
const legend = L.control({ position: 'bottomright' });
legend.onAdd = () => {
  const d = L.DomUtil.create('div', 'legend');
  d.innerHTML = '<i style="background:#2ecc71"></i>Κατάλληλη για κολύμβηση<br>' +
                '<i style="background:#e74c3c"></i>Ακατάλληλη για κολύμβηση<br>' +
                '<span class="flag">⚑</span>Ακτή με Γαλάζια Σημαία<br>' +
                '<span style="color:#8fa9c0">Το μέγεθος = φορτίο E. coli</span>';
  return d;
};
legend.addTo(map);
