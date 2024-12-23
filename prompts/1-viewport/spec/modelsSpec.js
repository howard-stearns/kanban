import {Task, Column, Board} from '../models.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

jasmine.getEnv().configure({random: false}); // Whether or not to randomize the order.

describe("Kanban", function () {
  let nColumns = 101;
  let size = 100 + 1; // Odd, for insertion test at size/2. Makes drag=>drop easier.
  describe('Board', function () {
    beforeAll(function () {
      Board.makeExample(nColumns, size);
    });
    describe("Column", function () {
      let column, startId;
      beforeAll(function () {
	column = Board.instance.at(nColumns/2);
	startId = column.at(0).id;
      });
      it("accesses column.", function () {
	expect(column).toBeInstanceOf(Column);
      });
      it("contains added items.", function () {
	for (let i = 0; i < size; i++) {
	  const item = column.items[i];
	  expect(item).toBeInstanceOf(Task);
	  expect(item.label).toBe(`Task ${i}`);
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
  });
});
