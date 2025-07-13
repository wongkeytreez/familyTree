function draw(save = true) {
  if (save) saveToGitHub(people)
  const container = document.getElementById('tree');
  container.innerHTML = '';
  const drawn = new Set();

  function drawFamilyTree(person, parentContainer) {
    if (drawn.has(person)) return;
    drawn.add(person);

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-branch';

    const pair = document.createElement('div');
    pair.className = 'person-pair';

    const personDiv = document.createElement('div');
    personDiv.className = 'tree-node';
    personDiv.innerHTML = `${person.name}<br>(${person.gender ? '♂' : '♀'}, ${person.age})`;
    pair.appendChild(personDiv);

    if (person.spouse && !drawn.has(person.spouse)) {
      drawn.add(person.spouse);
      const spouseDiv = document.createElement('div');
      spouseDiv.className = 'tree-node';
      spouseDiv.innerHTML = `${person.spouse.name}<br>(${person.spouse.gender ? '♂' : '♀'}, ${person.spouse.age})`;
      pair.appendChild(spouseDiv);
    }

    wrapper.appendChild(pair);

    if (person.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'tree-children';

      person.children.forEach(child => {
        drawFamilyTree(child, childrenContainer);
      });

      wrapper.appendChild(childrenContainer);
    }

    parentContainer.appendChild(wrapper);
  }

  // Find root people (no parents)
  people.forEach(p => {
    if (!p.parent1 && !p.parent2 && !drawn.has(p)) {
      drawFamilyTree(p, container);
    }
  });
}

// --- Panning Logic ---
let isPanning = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

const treeEl = document.getElementById('tree');
const containerEl = document.getElementById('tree-container');

containerEl.addEventListener('mousedown', (e) => {
  isPanning = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
  containerEl.style.cursor = 'grabbing';
});

containerEl.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;
  treeEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

containerEl.addEventListener('mouseup', () => {
  isPanning = false;
  containerEl.style.cursor = 'grab';
});

containerEl.addEventListener('mouseleave', () => {
  isPanning = false;
  containerEl.style.cursor = 'grab';
});
(async () => {
 people=await loadFromGitHub();
  draw(false);
})();
setInterval(async() => {
  people=await loadFromGitHub();
  draw(false);
}, 10000)
