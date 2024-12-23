import {Task, Column, Board} from '../app/models.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

jasmine.getEnv().configure({random: false}); // Whether or not to randomize the order.

describe("Kanban", function () {
  let nColumns = 101;
  let size = 3; //100 + 1; // Odd, for insertion test at size/2. Makes drag=>drop easier.
  describe('Board', function () {
    beforeAll(function () {
      Board.makeExample(nColumns, size);
    });
    describe("Column", function () {
      let columnIndex, column, startId;
      beforeAll(function () {
	columnIndex = nColumns/2;
	column = Board.instance.at(columnIndex);
	startId = column.at(0).id;
      });
      it("accesses column.", function () {
	expect(column).toBeInstanceOf(Column);
      });
      it("contains added items.", function () {
	for (let i = 0; i < size; i++) {
	  const item = column.items[i];
	  expect(item).toBeInstanceOf(Task);
	  expect(item.name).toBe(`Task ${Math.floor(columnIndex)}.${i}`);
	  expect(item.id).toBe(startId + i); // In this case.
	}
      });
      describe("action", function () {
	let item, index;
	beforeAll(function () {
	  item = new Task({name: 'added'});
	  index = size/2;
	  column.addItem(item, {index});
	});
	afterAll(function () {
	  column.removeItem(item);
	  expect(column.items.length).toBe(size);
	  expect(column.items.indexOf(item)).toBe(-1);
	});
	it("adds item at index.", function () {
	  expect(column.items.length).toBe(size + 1);
	  expect(column.items.indexOf(item)).toBe(Math.floor(index));
	});
      });
    });
    describe("Task", function ()  {
      let task, columnNumber = 1, column, taskNumber = 2;
      beforeAll(function () {
	column = Board.instance.at(columnNumber);
	task = column.at(taskNumber);
      });
      it("adds category.", function () {
	const key = 'foo';
	task.addCategory(key);
	expect(task.categories).toContain(key);
	task.removeCategory(key);
      });
      it("removes category.", function () {
	const key = 'bar';
	task.addCategory('red');
	task.addCategory(key);
	task.addCategory('white');	
	expect(task.categories).toContain(key);
	task.removeCategory(key);
	expect(task.categories).not.toContain(key);
	expect(task.categories).toContain('red');
	expect(task.categories).toContain('white');
	for (const category of [key, 'red', 'white']) {
	  task.removeCategory(category);
	}
      });
      it("does not contain duplicates.", function () {
	for (const key of ['a', 'b', 'a', 'c', 'b']) {
	  task.addCategory(key);
	}
	task.categories.sort();
	expect(task.categories).toEqual(['a', 'b', 'c']);
      });
      it("edits assignee.", function () {
	const name = 'hrs';
	task.assignee = name;
	expect(task.assignee).toBe(name);
      });
      it("edits due date.", function () {
	const date = new Date();
	task.due = date;
	expect(task.due).toBe(date);
      });
      it("can take name, description, due, assignee, and categories at construction.", function () {
	const name = "finish project",
	      description = "get it done",
	      due = new Date("12/25/2030"),
	      categories = ['red', 'white'],
	      assignee = "hrs",
	      data = {assignee, categories, due, description, name},
	      task = new Task(data);
	for (const key in data) {
	  expect(task[key]).toBe(data[key]);
	}
      });
      describe('filters.', function () {
	let originalColumnSize, uniqueString = "aardvark", uniqueDate = new Date("5/8/1945"), afterDate = new Date(uniqueDate);
	afterDate.setDate(afterDate.getDate() + 1);
	beforeAll(function () {
	  originalColumnSize = column.filteredAt(columnNumber);
	});
	function testFilter(name, capture, set, filter, unset) {
	  it(name, function () {
	    let was = capture();
	    set();
	    Board.instance.applyFilter(filter);
	    const col = Board.instance.filteredAt(columnNumber);
	    expect(col).toBe(column); // columns are not filtered
	    expect(col.filteredSize).toBe(1);
	    expect(col.filtered.every(filter)).toBeTruthy();
	    expect(filter(col.at(taskNumber))).toBeTruthy(); // The original ordering has not changed.
	    // In general, the index for at() and filteredAt() might or might not be the same,
	    // depending on whether earlier tasks are filtered out. In this example, they are different.
	    // Always use filtereAt() and filteredSize to iterate over filtered items.
	    expect(col.filteredAt(taskNumber)).not.toBe(task); // In this case.
	    expect(col.filteredAt(0)).toBe(task); // In this case.
	    unset(was);
	  });
	}
	// Note that Board.applyFilter is not cumulative. The most recently set filter applies.
	// If you want to test on multiple dimensions, you must supply a more complicated filter predicate.
	testFilter('by exact name.',
		   () => task.name,
		   () => task.name = uniqueString,
		   task => task.name === uniqueString,
		   old => task.name = old);
	testFilter('by exact description.',
		   () => task.description,
		   () => task.description = uniqueString,
		   task => task.description === uniqueString,
		   old => task.description = old);
	testFilter('by exact assignee.',
		   () => task.assignee,
		   () => task.assignee = uniqueString,
		   task => task.assignee === uniqueString,
		   old => task.assignee = old);
	testFilter('due by a given date.',
		   () => task.due,
		   () => task.due = uniqueDate,
		   task => task.due < afterDate,
		   old => task.due = old);
	testFilter('by exact category.',
		   () => task.categories,
		   () => task.addCategory(uniqueString),
		   task => task.categories.includes(uniqueString),
		   ingoredOld => task.removeCategory(uniqueString));
	
      });
    });
  });
});
