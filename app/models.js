const EndOfTheWorld = new Date("1/1/9000");
export class Task {
  static nextId = 0;
  static endOfTheWorld = EndOfTheWorld;
  constructor({name = '', description = '', due = EndOfTheWorld, assignee = '', categories = []} = {}) {
    this.name = name;
    this.description = description;
    this.due = due;
    this.assignee = assignee;
    this.categories = categories;
    this.id = this.constructor.nextId++;
  }
  categories = [];
  addCategory(categoryString) {
    if (this.categories.includes(categoryString)) return;
    this.categories.push(categoryString);
  }
  removeCategory(categoryString) {
    let index = this.categories.indexOf(categoryString);
    if (index < 0) return; // silent
    this.categories.splice(index, 1);
  }
}
export class Group { // E.g., a Column of Tasks, or a Board of Columns.
  items = [];
  assertPresent(index, item) { // Throw error if index < 0.
    if (index < 0) throw new Error(`Item ${item.id} "${item.name}" is not present.`);
  }
  assertItem(item) { // Non-null, for now.
    if (!item) throw new Error('Item is required');
  }
  get filtered() {
    if (!this._filtered) this._filtered = this.items;
    return this._filtered;
  }
  at(index) { // Return the item at (floor of) index
    return this.items[Math.floor(index)];
  }
  filteredAt(index) {
    return this.filtered[Math.floor(index)];
  }
  get size() {
    return this.items.length;
  }
  get filteredSize() {
    return this.filtered.length;
  }
  addItem(item, {
    following = null,
    index = following && this.items.indexOf(following)
  } = {}) { // Add an item at the specified (floor of) index, before the speciified following item, or at the end.
    this.assertItem(item);
    if (index) {
      this.assertPresent(index, item);
      this.items.splice(Math.floor(index), 0, item);
    } else {
      this.items.push(item);
    }
  }
  removeItem(item) { // Remove the specified item.
    // We COULD avoid indexOf by keeping the index in item, but then we would have to update following items.
    this.assertItem(item);
    const index = this.items.indexOf(item);
    this.assertPresent(index, item);
    this.items.splice(index, 1);
  }
}
  
export class Column extends Group {
  static nextId = 0; // Separate namespace from items.
  constructor({name} = {}) {
    super();
    this.name = name;
    this.id = this.constructor.nextId++;
  }
}

export class Board extends Group {
  applyFilter(filter) {
    console.log('applyFilter', filter);
    for (const column of this.items) {
      column._filtered = column.items.filter(filter);
      console.log('filtered:', column._filtered);
    }
  }
  static makeExample(nColumns, nTasksPerColumn) { // Populate the board.
    let board = this.instance = new this();
    for (let i = 0; i < nColumns; i++) {
      const column = new Column({ name: `Column ${i}` });
      for (let j = 0; j < nTasksPerColumn; j++) {
	let description = `Description of Task ${j} `;
	if (i % 2 === 0 && j % 2 === 0) description += description;
        const task = new Task({ name: `Task ${i}.${j}`, description });
        column.addItem(task);
      }
      board.addItem(column);
    }
    return board;
  }
}
  
