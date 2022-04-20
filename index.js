const getPath = (object, path) =>
  path.split("/").reduce((p, c) => p && p[c] || null, object);
const setPath = (object, path, value) =>
  path
    .split("/")
    .reduce(
      (o, p, i) => o[p] = path.split(".").length === ++i ? value : o[p] || {},
      object,
    );

const firebasify = (obj, rules, defaultUniqueKey = "id") => {
  const re = /^(?:(?:((?:[\w\d\s]|\\:)+):)|:)?\/(.*)/g;
  for (let rule of rules) {
    const matches = re.exec(rule);
    let [_, uniqueKey, path] = matches;
    let currentObj = path === "" ? obj : getPath(obj, path);
    if (!currentObj) {
      console.log(`"${path}" is invalid (not found).`);
      continue;
    }
    if (currentObj.constructor === Array) {
      if (currentObj.every((item) => item.constructor === Object)) {
        let firebasified = _firebasify(
          currentObj,
          uniqueKey || defaultUniqueKey,
        );
        if (path === "") {
          obj = firebasified;
          continue;
        }
        setPath(obj, path, firebasified);
      } else {
        console.error(
          `All elements of ${path} are not objects:`,
          currentObj,
        );
        continue;
      }
    } else {
      console.error(`${path} is not an array.`);
      continue;
    }
  }

  return obj;
};

const _firebasify = (obj, uniqueKey) => {
  let out = {};
  let itemsWithoutUniqueKey = [];
  let biggestUniqueKey = 0;

  for (let item of obj) {
    let id = Number(item[uniqueKey]);
    if (typeof id === "number" && !Number.isNaN(id)) {
      out[id] = item;
      if (id > biggestUniqueKey) {
        biggestUniqueKey = id;
      }
    } else {
      itemsWithoutUniqueKey.push(item);
    }
  }

  let idNow = biggestUniqueKey + 1;
  for (let item of itemsWithoutUniqueKey) {
    item[uniqueKey] = idNow;
    out[idNow] = item;
    idNow++;
  }

  return out;
};

module.exports = firebasify;
