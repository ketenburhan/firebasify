const firebasify = (obj) => {
  if (Array.isArray(obj) && obj.every((item) => item.constructor === Object)) {
    obj = _firebasify(obj);
  }

  for (let key in obj) {
    if (typeof obj[key] === "object") {
      obj[key] = firebasify(obj[key]);
    }
  }

  return obj;
};

const _firebasify = (obj) => {
  let out = {};
  let itemsWithoutId = [];
  let biggestId = 0;
  for (let item of obj) {
    let id = Number(item.id);
    if (typeof id === "number" && !Number.isNaN(id)) {
      out[item.id] = item;
      if (item.id > biggestId) {
        biggestId = id;
      }
    } else {
      itemsWithoutId.push(item);
    }
  }

  let idNow = biggestId + 1;
  for (let item of itemsWithoutId) {
    item.id = idNow;
    out[idNow] = item;
    idNow++;
  }

  return out;
};

module.exports = firebasify;
