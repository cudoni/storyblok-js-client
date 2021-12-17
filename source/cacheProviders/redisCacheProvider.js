import { createClient } from 'redis';

const RedisCacheProvider = {
  client: null,
  prefix: 'blok',
  
  async connect (config) {
    if (!config.uri) throw new Error(`Redis connection URI is required in 'config.uri'`);

    this.client = createClient(clientOptions);
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    return this.client.connect();
  },

  async get(key) {
    let value = await this.client.hGet(this.prefix, key);
    return this.deserialize(value);
  },

  async getAll() {
    let result = await this.client.hGetAll(this.prefix);
    return result
  },

  async set (key, content) {
    // memory[key] = content;
    await this.client.hSet(this.prefix, key, this.serialize(content));
  },

  serialize (value) {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  },

  deserialize (value) {
    return JSON.parse(value);
  },
  
  flush() {
    this.client.hFlush();
  }
}

export default RedisCacheProvider;
