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
  makeObserverCallback({create, destroy, computeIndex, margin = 1, total = 1}) { // Return a function suitable as a callback
    // for IntersectionObserver, to implmenent an "infinite scroll" that adds AND removes elements as needed
    // when elements come in and out of view (either because of scrolling or resizing). The arguments should be:
    //   create(itemModel, side, index) - Add an element to the DOM corresponding to one of our items.
    //      itemModel: the model that the new element should represent.
    //      side: either 'start' or 'end', indicating where the element should be added in flow direction.
    //      index: the index of itemModel within the this.filtered.
    //      Should return the newly created element.
    //   destroy(side, index) - Remove an element from the DOM that is no longer needed.
    //      side: either 'start' or 'end', indcating which end of the flow direction the element should be removed from.
    //      index: the index within the filtered items of the element that has just become invisible. This not NECESARILLY
    //         correspond to the element that should be removed. (I.e., the element farthest to the indicated side should be removed.)
    //      Should return the element that was removed.
    //   margin - The number of extra non-visible elements that we should keep in the DOM, to avoid hickups.
    //   total - The number of elements that have already been added. The client must wire the IntersectionObserver
    //     and then add one element to the DOM -- the callback will automatically populate the rest!
    //     If the client creates more than one element, it is the client's responsibility to set the element.dataset.index
    //     to the index of the element in the flow direction.
    // Caution: for the time being, create/destroy are expected to be synchronous.
    let min = 0, max = -margin, resetTimer;
    return (entries, observer) => {
      if (!entries.length) return;
      if (resetTimer) return;
      function elementIndex(element) { return  parseInt(element.dataset.index || '0'); }
      function entryIndex(entry) { return elementIndex(entry.target); }
      const make1 = (newIndex, side) => {
	const model = this.filteredAt(newIndex);
	if (!model) return;
	const newElement = create(model, side, newIndex);
	if (!newElement) return;
	newElement.dataset.index = newIndex;
	total++;
	observer.observe(newElement);
      };
      function report(label, kind = 'log') {
	const input = entries.map(entry => ([entryIndex(entry), entry.isIntersecting]));
	if (!entries[0].target.parentElement) console.error(`${label} has wacky target`, entries, {min, max, total}); else
	console[kind](label,
		    {min, max, total},
		    input.pop(), input,
		    Array.from(entries[0].target.parentElement.children).map(element => element.dataset.index || `${element.style.minWidth} x ${element.style.minHeight}`));
      }
      if (entries.some(entry => !entry.isIntersecting && entryIndex(entry) > min && entryIndex(entry) < max)) {
	const reset = async () => {
	  report('*** reset', 'warn');
	  for (let n = 0; n < total; n++) destroy('end', -1);
	  setTimeout(() => {
	    observer.takeRecords(); // Clear/ignore any changes from destroy loop.
	    const index = computeIndex(),
		  model = this.filteredAt(index);
	    total = 0; min = index; max = index - margin;
	    resetTimer = null;
	    if (index > 0) {
	      min--;
	      make1(index-1, 'start');
	    }
	    make1(index, 'end');
	  }, 500);
	};
	clearTimeout(resetTimer);
	resetTimer = setTimeout(reset, 500);
	return;
      }
      report('normal');
      for (const entry of entries) {
	console.log(entry.target, entry.target.parentElement.scrollTop);
	const index = entryIndex(entry);
	if (entry.isIntersecting) { // Newly visible.
	  // Expand min/max on the side where the new item appeared, to reflect the newly visible item.
	  // Add the item on the new side IFF we're not out of data (checked by makeColumnDisplay).
	  let newIndex, side;
	  if (index >= min) {             // Items are comming in on the end.
	    max++;
	    newIndex = index + margin;
	    side = 'end';
	  } else if (index < max) {       // Items are coming in on the start.
	    min--;
	    newIndex = index - margin;
	    side = 'start';
	  }
	  make1(newIndex, side);
	} else if (index < min || index > max) {
	  continue; // Out of range when we make an item outside the visible range, and it instantly report invisible.
	} else {
	  // Shrink min/max on the side where the item disappeared from view.
	  // Remove the item on that side IFF have more than we should (checkd by removeColumnDisplay).
	  let side; 
	  if (index === min) { //(index < max) {              // Items are sliding off the start.
	    min++;
	    side = 'start';
	  } else {                        // Items sliding off the end.
	    max--;
	    side = 'end';
	  }
	  const expectedLow =  Math.max(0, min - margin),
		expectedHigh = Math.min(this.filteredSize - 1, max + margin),
		expected = expectedHigh - expectedLow + 1;
	  if (total <= expected) continue;
	  const element = destroy(side, index);
	  observer.unobserve(element); // Clean living. Should happen automatically when destroy() removes element from DOM.
	  total--;
	}
      }
    };
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
  applyFilter(filter) {
    for (const column of this.items) {
      column._filtered = column.items.filter(filter);
    }
  }
  static makeExample(nColumns, nTasksPerColumn) { // Populate the board.
    let board = this.instance = new this();
    for (let i = 0; i < nColumns; i++) {
      const column = new Column({ label: `Column ${i}` });
      for (let j = 0; j < nTasksPerColumn; j++) {
	let text = `Description of Task ${j} `;
	if (i % 2 === 0 && j % 2 === 0) text += text;
        const task = new Task({ label: `Task ${i}.${j}`, text });
        column.addItem(task);
      }
      board.addItem(column);
    }
    return board;
  }
}

  
