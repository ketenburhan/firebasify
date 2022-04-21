const getPath = (object: { [key: string]: any }, path: string) =>
  path.split("/").reduce((p, c) => (p && p[c]) || null, object);
const setPath = (object: { [key: string]: any }, path: string, value: any) =>
  path.split("/").reduce((obj, path, index) => {
    let newValue = path.split(".").length === ++index ? value : obj[path] || {};
    obj = Object.assign(obj, { [path]: newValue });
    return newValue;
  }, object);

export const firebasify = (
  obj: { [key: string]: any },
  rules: string[],
  defaultUniqueKey = "id"
) => {
  const re = /^(?:(?:((?:[\w\d\s]|\\:)+):)|:)?\/(.*)/g;
  for (let rule of rules) {
    const matches = re.exec(rule);
    if (!matches) {
      console.error(`Invalid rule: ${rule}`);
      continue;
    }
    let [_, uniqueKey, path] = matches;
    let currentObj = path === "" ? obj : getPath(obj, path);
    if (!currentObj) {
      console.log(`"${path}" is invalid (not found).`);
      continue;
    }
    if (Array.isArray(currentObj)) {
      if (currentObj.every((item: any) => item.constructor === Object)) {
        let firebasified = _firebasify(
          currentObj,
          uniqueKey || defaultUniqueKey
        );
        if (path === "") {
          obj = firebasified;
          continue;
        }
        setPath(obj, path, firebasified);
      } else {
        console.error(`All elements of ${path} are not objects:`, currentObj);
        continue;
      }
    } else {
      console.error(`${path} is not an array.`);
      continue;
    }
  }

  return obj;
};

const _firebasify = (obj: { [key: string]: any }, uniqueKey: string) => {
  let out: { [key: string]: any } = {};
  let itemsWithoutUniqueKey = [];
  let biggestUniqueKey = 0;

  for (let key in obj) {
    let item = obj[key];
    let id = Number(item[uniqueKey]);
    if (typeof id === "number" && !Number.isNaN(id)) {
      out[String(id)] = item;
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

export default firebasify;
