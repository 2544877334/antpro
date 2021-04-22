const glob = require('glob');
const path = require('path');
const { pathToRegexp } = require('path-to-regexp');
const signale = require('signale');

const { winPath } = require('./utils');
// const mockconfig = require('./mockconfig')
let _mockconfig = {};
const cwd = process.cwd();
let mockList = [];
// 获取mock文件列表
function getMockFile() {
  let mockFiles = glob
    .sync('mock/**/*.[jt]s', {
      cwd,
      ignore: [],
    })
    .map(p => path.join(cwd, p));
  // windows下路径处理
  mockFiles = mockFiles.map(p => winPath(p));

  // debug(`load mock data from ${absMockPath}, including files ${JSON.stringify(mockFiles)}`)
  return mockFiles;
}
// 获取mock文件数据
function getMockData(files) {
  let mockData = {};
  files.forEach(mockFile => {
    try {
      // if (mockFile.indexOf('ts') != -1) {
      //   return
      // }
      const m = require(mockFile);
      mockData = Object.assign(mockData, m.default || m);
      return mockData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
  return mockData;
}

// mock数据格式化
function parseMockData(config) {
  mockList = Object.keys(config).reduce((list, key) => {
    const handler = config[key];
    const { method, path } = parseMockUrl(key);
    const keys = [];
    const re = pathToRegexp(path, keys);
    list.push({
      method,
      path,
      re,
      keys,
      handler: mockHandle(handler),
    });
    return list;
  }, []);
}
function getMatchMock(url) {
  // return (
  //   mockconfig.mockList.findIndex(whiteUrl => {
  //     if (Object.prototype.toString.call(whiteUrl) == '[object RegExp]') {
  //       // return whiteUrl.test(url)
  //     } else {
  //       return url.indexOf(whiteUrl) != -1
  //     }
  //   }) != -1
  // )
  return (
    _mockconfig.mockUrlList.findIndex(whiteUrl => {
      // return url.indexOf(whiteUrl) != -1
      if (Object.prototype.toString.call(whiteUrl) == '[object RegExp]') {
        return whiteUrl.test(url);
      } else {
        return url.indexOf(whiteUrl) != -1;
      }
    }) != -1 && mockList.find(item => url.indexOf(item.path) != -1)
  );
}
function mockHandle(handler) {
  if (Object.prototype.toString.call(handler) == '[object Function]') {
    return handler;
  }
  return () => {
    return handler;
  };
}

function parseMockUrl(key) {
  let method = 'get';
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1];
  }
  return {
    method,
    path,
  };
}

function initMock(config) {
  try {
    _mockconfig = config;
    mockList = [];
    const files = getMockFile();
    const mockData = getMockData(files);
    parseMockData(mockData);
  } catch (e) {
    signale.warn('init mock failed');
    signale.fatal(e);
  }
}

module.exports = {
  getMatchMock,
  initMock,
};
