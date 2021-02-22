import Axios from 'axios';
import baseURL, { URLS } from './URLS';

// const appkey = 'despair_1593934729887';
// const appkey = 'dd_1597654682810';
const appkey = 'spring_1613795278342';

// 创建一个请求实例
const request = Axios.create({
  baseURL,
  params: {
    appkey,
  },
});

request.interceptors.response.use((value) => value.data);

const getSideList = (type) => request.get(
  URLS.getSide,
  { params: { type } },
);

const getGoodsList = (type, page, size, sort) => request.get(
  URLS.getGoodsList,
  {
    params: {
      type, page, size, sort,
    },
  },
);

const search = (type, page, size) => request.get(
  URLS.search,
  {
    params: {
      type, page, size,
    },
  },
);

const likeSearch = (value) => request.get(
  URLS.likeSearch,
  { params: { likeValue: value } },
);

const getGoodsByIds = (value) => request.get(
  URLS.getGoodsByIds,
  {
    params: { value },
  },
);

export default {
  getSideList,
  getGoodsList,
  search,
  likeSearch,
  getGoodsByIds,
};
