export class Task {
  static nextId = 0;
  constructor({label = '', text = ''} = {}) {
    this.label = label;
    this.text = text;
    this.id = this.constructor.nextId++;
  }
}
export class Group { // E.g., a Column of Tasks, or a Board of Columns.
  items = [];
  assertPresent(index, item) { // Throw error if index < 0.
    if (index < 0) throw new Error(`Item ${item.id} "${item.label}" is not present.`);
  }
  assertItem(item) { // Non-null, for now.
    if (!item) throw new Error('Item is required');
  }
  at(index) { // Return the item at (floor of) index
    return this.items[Math.floor(index)];
  }
  get size() {
    return this.items.length;
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
  constructor({label} = {}) {
    super();
    this.label = label;
    this.id = this.constructor.nextId++;
  }
}
export class Board extends Group {
  static makeExample(nColumns, nTasksPerColumn) { // Populate the board.
    let board = this.instance = new this();
    for (let i = 0; i < nColumns; i++) {
      const column = new Column({ label: `Column ${i}` });
      for (let j = 0; j < nTasksPerColumn; j++) {
	let text = `Description of Task ${j} `;
	if (i % 2 === 0 && j % 2 === 0) text += text;
        const task = new Task({ label: `Task ${j}`, text });
        column.addItem(task);
      }
      board.addItem(column);
    }
    return board;
  }
}

  
