import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";

axiosRetry(axios, 3); // 请求默认重试3次

const _url = "https://api.map.com.tw/net/familyShop.aspx";

/**
 * 通用请求
 */
async function requestHandler(options) {
  const { data } = await axios.post(_url, qs.stringify(options), {
    headers: {
      Host: "api.map.com.tw",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
      Referer: "https://www.family.com.tw/",
    },
  });
  console.log(data);
}

/**
 * 获取区域
 */
function getTown() {
  const options = {
    searchType: "ShowTownList",
    type: "",
    city: "台北市",
    fun: "storeTownList",
    key: "6F30E8BF706D653965BDE302661D1241F8BE9EBC",
  };
  requestHandler(options);
}

/**
 * 获取店铺
 */
function getShop() {
  const options = {
    searchType: "ShopList",
    type: "",
    city: "台北市",
    area: "中正區",
    road: "八德路一段",
    fun: "showSingleRoadStore",
    key: "6F30E8BF706D653965BDE302661D1241F8BE9EBC",
  };
}

getTown();
