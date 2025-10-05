import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);
import * as itemModel from '../models/itemModel.js';

describe('itemModel', () => {
  describe('getCollection', () => {
    it('should return a collection object', async () => {
      const collection = await itemModel.getCollection();
      expect(collection).to.exist;
      expect(collection.collectionName).to.be.a('string');
    });
  });

  describe('getAllItems', () => {
    it('should return an array (possibly empty)', async () => {
      const items = await itemModel.getAllItems();
      expect(items).to.be.an('array');
    });
    it('should throw if collection throws', async () => {
      const fakeCollection = {
        find: () => ({
          toArray: () => { throw new Error('DB error'); }
        })
      };
      await expect(itemModel.getAllItems(fakeCollection)).to.be.rejectedWith('DB error');
    });
  });
});
