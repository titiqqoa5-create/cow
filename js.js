const categoryLabels = { infantry: "歩兵", artillery: "軍需品", tank: "戦車", rocket: "秘密" };

const weapons = {
  infantry: {
    "歩兵": {
      attack: [{u:4,l:2,h:1.5},{u:4,l:2,h:1.5},{u:5.5,l:2.7,h:2},{u:7,l:4,h:3},{u:9,l:5,h:4},{u:12,l:7,h:5.3}],
      defense: [{u:6,l:3,h:2.3},{u:6,l:3,h:2.3},{u:8.3,l:4.1,h:3},{u:10.5,l:6,h:4.5},{u:13.5,l:7.5,h:6},{u:18,l:10.5,h:8}]
    }
  },
  artillery: {
    "砲兵": {
      attack: [{u:1.5,l:2.7,h:2},{u:2,l:4,h:3},{u:2.8,l:5.5,h:4},{u:3.8,l:0.9,h:7.5},{u:5,l:10.3,h:7.5}],
      defense: [{u:0.4,l:0.7,h:0.5},{u:0.5,l:1,h:0.8},{u:0.7,l:1.4,h:1},{u:0.9,l:1.9,h:1.4},{u:1.3,l:2.6,h:1.9}]
    }
  },
  tank: {
    "駆逐戦車": {
      attack: [{u:0.7,l:4,h:6},{u:1,l:5.3,h:8},{u:1.5,l:7,h:11},{u:2.3,l:9.3,h:5},{u:3.5,l:12,h:20}],
      defense: [{u:1.1,l:6,h:9},{u:1.5,l:7.9,h:12},{u:2.3,l:10.5,h:16.5},{u:3.5,l:13.9,h:22.5},{u:5.3,l:18,h:30}]
    }
  },
  rocket: {
    "ロケット砲": {
      attack: [{u:3.5,l:2.2,h:1.5},{u:6.6,l:4.5,h:2.5},{u:10.3,l:7,h:4.5}],
      defense: [{u:0.9,l:0.6,h:0.4},{u:1.5,l:1.1,h:0.6},{u:2.6,l:1.7,h:1.1}]
    }
  }
};

function updateSubType() {
  const cat = document.getElementById('category').value;
  const sub = document.getElementById('subType');
  sub.innerHTML = '';
  if (weapons[cat]) {
    Object.keys(weapons[cat]).forEach(w => {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = w;
      sub.appendChild(opt);
    });
    updateLevelOptions();
  }
}

function updateLevelOptions() {
  const cat = document.getElementById('category').value;
  const weapon = document.getElementById('subType').value;
  const levelSelect = document.getElementById('inputLevel');
  levelSelect.innerHTML = '';
  if (weapons[cat] && weapons[cat][weapon]) {
    const maxLevel = weapons[cat][weapon].attack.length;
    for (let i = 1; i <= maxLevel; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      levelSelect.appendChild(opt);
    }
  }
}

updateSubType();

function addWeaponRow() {
  const cat = document.getElementById('category').value;
  const weapon = document.getElementById('subType').value;
  const level = document.getElementById('inputLevel').value;
  const count = document.getElementById('inputCount').value;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td data-cat="${cat}">${categoryLabels[cat]}</td>
    <td data-weapon="${weapon}">${weapon}</td>
    <td data-level="${level}">${level}</td>
    <td data-count="${count}">${count}</td>
    <td><button onclick="this.closest('tr').remove()">×</button></td>
  `;

  document.getElementById('weaponTable').appendChild(tr);
}

function calculate() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  let total = {u:0,l:0,h:0};

  document.querySelectorAll('#weaponTable tr').forEach(row => {
    const cat = row.children[0].dataset.cat;
    const weapon = row.children[1].dataset.weapon;
    const level = parseInt(row.children[2].dataset.level, 10) - 1;
    const count = parseInt(row.children[3].dataset.count, 10);

    if (weapons[cat] && weapons[cat][weapon]) {
      const data = weapons[cat][weapon][mode][level];
      total.u += data.u * count;
      total.l += data.l * count;
      total.h += data.h * count;
    }
  });

  document.getElementById('resultLabel').textContent = mode === 'attack' ? '合計攻撃値' : '合計防御値';
  document.getElementById('res-unarmored').textContent = total.u.toFixed(2);
  document.getElementById('res-light').textContent = total.l.toFixed(2);
  document.getElementById('res-heavy').textContent = total.h.toFixed(2);
}
