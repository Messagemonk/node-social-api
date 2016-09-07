import Bluebird from 'bluebird';
import nock from 'nock';
import Core from '../src/core/core';

describe('Core', () => {
  it('should be a class', () => {
    const core = new Core({});
    expect(core instanceof Core).toBeTruthy();
  });

  describe('#constructor', () => {
    it('should set global Promise by default', () => {
      const core = new Core({});
      expect(core.Promise).toEqual(Promise);
    });

    it('should overwrite Promise', () => {
      const core = new Core({ Promise: Bluebird });
      expect(core.Promise).toEqual(Bluebird);
    });
  });

  describe('#checkValidConfig', () => {
    // TODO test checkValidConfig
  });

  describe('#request', () => {
    const core = new Core({});

    it('should return a promise', () => {
      nock('https://api.instagram.com')
        .get('/')
        .reply(200, 'success');
      const promise = core.request({
        method: 'GET',
        uri: 'https://api.instagram.com',
      });
      expect(promise instanceof Promise).toBeTruthy();
    });

    it('should return request result', async () => {
      nock('https://api.instagram.com')
        .get('/')
        .reply(200, 'success');
      const result = await core.request({
        method: 'GET',
        uri: 'https://api.instagram.com',
      });
      expect(result).toEqual('success');
    });

    it('should return request error', async () => {
      nock('https://api.instagram.com')
        .get('/')
        .reply(400, 'error');
      try {
        await core.request({
          method: 'GET',
          uri: 'https://api.instagram.com',
        });
      } catch (err) {
        expect(err.body).toEqual('error');
      }
    });

    it('should return connection error', async () => {
      nock('https://api.instagram.com')
        .get('/')
        .delayConnection(2000)
        .reply(400, 'error');
      try {
        await core.request({
          method: 'GET',
          uri: 'https://api.instagram.com',
          timeout: 1000,
        });
      } catch (err) {
        expect(err.code).toEqual('ETIMEDOUT');
      }
    });
  });
});
