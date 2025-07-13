function person(age, name, gender) {
  this.age = age;
  this.name = name;
  this.children = [];
  this.parent1 = null;
  this.parent2 = null;
  this.gender = gender; // true = male
  this.spouse = null;
}

function marry(p1, p2) {
  p1.spouse = p2;
  p2.spouse = p1;
}

function divorce(p1, p2) {
  p1.spouse = null;
  p2.spouse = null;
}

function makeKid(name, gender, parent1, parent2) {
  const kid = new person(0, name, gender);
  kid.parent1 = parent1;
  kid.parent2 = parent2;
  parent1.children.push(kid);
  parent2.children.push(kid);
  return kid;
}

// Global people list

