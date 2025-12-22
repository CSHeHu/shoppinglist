import { expect } from 'chai';
import esmock from 'esmock';

describe('itemModel (unit)', () => {
  it('exports expected functions', async () => {
    const mod = await import('../models/itemModel.js');
    expect(mod.getCollection).to.be.a('function');
    expect(mod.getAllItems).to.be.a('function');
    expect(mod.createItem).to.be.a('function');
    expect(mod.updateItem).to.be.a('function');
    expect(mod.deleteItem).to.be.a('function');
  });

  it('getAllItems works with a passed-in collection', async () => {
    const fakeCollection = { find: () => ({ toArray: async () => [1,2,3] }) };
    const { getAllItems } = await esmock('../models/itemModel.js', {});
    const items = await getAllItems(fakeCollection);
    expect(items).to.deep.equal([1,2,3]);
  });
});
