import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";
import { isUndefined } from "lodash-es";

/**
 * FamilyMart店铺 - 台湾
 */
axiosRetry(axios, 3); // 请求默认重试3次

let city = "";
let town = "";
let interval = 2000; // 请求速度, 默认2秒

const _url = "https://api.map.com.tw/net/familyShop.aspx";

const _root = [
  "台北市",
  "基隆市",
  "新北市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
  "澎湖縣",
  "連江縣",
  "金門縣",
].map((item) => ({
  label: item,
  value: item,
  city: item,
  children: [],
}));

// 请求调度
async function requesDispatcher(parent, { city, town }) {
  let temp = null;
  switch (true) {
    case !isUndefined(town):
      console.warn(`开始获取 ${city} - ${town} 的店铺地址`);
      temp = await GetShop(city, town);
      break;
    case !isUndefined(city):
      console.warn(`开始获取 ${city} 的下属地区`);
      temp = await GetTown(city);
      break;
  }
  temp && (parent.children = temp);
  return temp;
}

/**
 * 通用请求
 */
async function requestHandler(options, callback) {
  return new Promise((resolve) => {
    setTimeout(async function () {
      const { status, data } = await axios
        .post(_url, qs.stringify(options), {
          headers: {
            Host: "api.map.com.tw",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
            Referer: "https://www.family.com.tw/",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      if (status === 200) {
        const res = eval(`function ${options.fun}(res){return res} ${data}`);
        console.log(res);
        resolve(res.map(callback));
      } else {
        throw new Error(`${options.city}-${options.town} 请求错误.`);
      }
    }, interval);
  });
}

/**
 * 获取区域
 */
async function GetTown(city) {
  const options = {
    searchType: "ShowTownList",
    type: "",
    city,
    fun: "storeTownList",
    key: "6F30E8BF706D653965BDE302661D1241F8BE9EBC",
  };
  return await requestHandler(options, (item) => ({
    label: item.town,
    value: item.town,
    town: item.town,
    children: [],
  }));
}

/**
 * 获取店铺
 */
async function GetShop(city, area) {
  const options = {
    searchType: "ShopList",
    type: "",
    city,
    area,
    road: "",
    fun: "showStoreList",
    key: "6F30E8BF706D653965BDE302661D1241F8BE9EBC",
  };

  const stores = await requestHandler(options, (item) => item);

  return stores.reduce((roads, store) => {
    const currentStore = {
      label: `${store.NAME} ${store.addr}`,
      value: `${store.NAME} ${store.addr}`,
    };
    const currentRoad = roads.find((item) => item.value === store.road);
    if (currentRoad) {
      currentRoad.children.push(currentStore);
    } else {
      roads.push({
        label: store.road,
        value: store.road,
        children: [currentStore],
      });
    }
    return roads;
  }, []);
}

/**
 * 执行队列
 * @param root 源数据
 * @param level 层级
 */
(function queue(root, level) {
  const source = root.map(
    (item, index) =>
      async function () {
        city = !isUndefined(item.city) ? item.city : city;
        town = !isUndefined(item.city) ? void 0 : item.town ? item.town : town;

        const parent = await requesDispatcher(item, { city, town });

        if (parent[0] && !isUndefined(parent[0].children)) {
          !level && (await queue(parent, level + 1)[0]());
        }

        const next = source[++index];

        if (!level) {
          console.log(`正在执行保存 ${city}...`);
          fs.writeFileSync(
            path.resolve(process.cwd(), `./dist/${city}.json`),
            JSON.stringify(item)
          );
        }

        next && (await next());
      }
  );
  return source;
})(_root, 0)[0]();
