import localforage from "localforage";

export const db = {
  save: async (key, value) => {
    return await localforage.setItem(key, value);
  },
  get: async (key) => {
    return await localforage.getItem(key);
  },
  remove: async (key) => {
    return await localforage.removeItem(key);
  }
};