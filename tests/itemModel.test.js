import { expect } from 'chai';
import * as itemModel from '../models/itemModel.js';

describe('itemModel', () => {
  describe('getCollection', () => {
    it('should return a collection object', async () => {
      const collection = await itemModel.getCollection();
      expect(collection).to.exist;
      expect(collection.collectionName).to.be.a('string');
    });
  });
});
