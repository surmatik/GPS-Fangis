export default class Nedb {
  constructor() {
    this.db = new Map();
    this.autoIncrement = 1;
  }

  insert(doc, callback) {
    const id = this.autoIncrement++;
    this.db.set(id, { ...doc, _id: id });
    callback(null, { ...doc, _id: id });
  }

  find(query, callback) {
    const result = Array.from(this.db.values()).filter(doc => {
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
    callback(null, result);
  }
}
