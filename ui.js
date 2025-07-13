function setupSearchBox(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);

  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    results.innerHTML = '';

    if (term === '') {
      results.style.display = 'none';
      return;
    }

    const matches = people
      .map((p, i) => ({ name: p.name, index: i }))
      .filter(p => p.name.toLowerCase().includes(term));

    if (matches.length === 0) {
      results.style.display = 'none';
      return;
    }

    matches.forEach(match => {
      const div = document.createElement('div');
      div.textContent = match.name;
      div.onclick = () => {
        input.value = `${match.name} (id:${match.index})`;
        results.style.display = 'none';
      };
      results.appendChild(div);
    });

    results.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    setTimeout(() => results.style.display = 'none', 150);
  });
}

// Add Person
function openPopup() {
  document.getElementById('popup-bg').style.display = 'flex';
  setupSearchBox('parent1-input', 'parent1-results');
  setupSearchBox('parent2-input', 'parent2-results');
}
function closePopup() {
  document.getElementById('popup-bg').style.display = 'none';
}
document.getElementById('person-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value === 'true';
  const parent1Raw = document.getElementById('parent1-input').value;
  const parent2Raw = document.getElementById('parent2-input').value;
  const i1 = parent1Raw.match(/\(id:(\d+)\)/)?.[1];
  const i2 = parent2Raw.match(/\(id:(\d+)\)/)?.[1];

  let p;
  if (i1 !== undefined && i2 !== undefined) {
    p = makeKid(name, gender, people[i1], people[i2]);
  } else {
    p = new person(age, name, gender);
  }
  people.push(p);
  closePopup();
  draw();
});

// Marriage
function openMarryPopup() {
  document.getElementById('popup-marry').style.display = 'flex';
  setupSearchBox('marry1', 'marry1-results');
  setupSearchBox('marry2', 'marry2-results');
}
function closeMarryPopup() {
  document.getElementById('popup-marry').style.display = 'none';
}
function handleMarry() {
  const i1 = document.getElementById('marry1').value.match(/\(id:(\d+)\)/)?.[1];
  const i2 = document.getElementById('marry2').value.match(/\(id:(\d+)\)/)?.[1];
  if (i1 !== undefined && i2 !== undefined) {
    marry(people[i1], people[i2]);
    draw();
  }
  closeMarryPopup();
}

// Adoption
function openAdoptPopup() {
  document.getElementById('popup-adopt').style.display = 'flex';
  setupSearchBox('adopt-child', 'adopt-child-results');
  setupSearchBox('adopt-parent', 'adopt-parent-results');
}
function closeAdoptPopup() {
  document.getElementById('popup-adopt').style.display = 'none';
}
function handleAdopt() {
  const ci = document.getElementById('adopt-child').value.match(/\(id:(\d+)\)/)?.[1];
  const pi = document.getElementById('adopt-parent').value.match(/\(id:(\d+)\)/)?.[1];
  if (ci !== undefined && pi !== undefined) {
    const child = people[ci];
    const parent = people[pi];
    if (!child.parent1) child.parent1 = parent;
    else if (!child.parent2) child.parent2 = parent;
    parent.children.push(child);
    draw();
  }
  closeAdoptPopup();
}

// Divorce
function openDivorcePopup() {
  document.getElementById('popup-divorce').style.display = 'flex';
  setupSearchBox('divorce1', 'divorce1-results');
  setupSearchBox('divorce2', 'divorce2-results');
}
function closeDivorcePopup() {
  document.getElementById('popup-divorce').style.display = 'none';
}
function handleDivorce() {
  const i1 = document.getElementById('divorce1').value.match(/\(id:(\d+)\)/)?.[1];
  const i2 = document.getElementById('divorce2').value.match(/\(id:(\d+)\)/)?.[1];
  if (i1 !== undefined && i2 !== undefined) {
    divorce(people[i1], people[i2]);
    draw();
  }
  closeDivorcePopup();
}

// Disown
function openDisownPopup() {
  document.getElementById('popup-disown').style.display = 'flex';
  setupSearchBox('disown-parent', 'disown-parent-results');
  setupSearchBox('disown-child', 'disown-child-results');
}
function closeDisownPopup() {
  document.getElementById('popup-disown').style.display = 'none';
}
function handleDisown() {
  const pi = document.getElementById('disown-parent').value.match(/\(id:(\d+)\)/)?.[1];
  const ci = document.getElementById('disown-child').value.match(/\(id:(\d+)\)/)?.[1];
  if (pi !== undefined && ci !== undefined) {
    const parent = people[pi];
    const child = people[ci];
    parent.children = parent.children.filter(c => c !== child);
    if (child.parent1 === parent) child.parent1 = null;
    if (child.parent2 === parent) child.parent2 = null;
    draw();
  }
  closeDisownPopup();
}
