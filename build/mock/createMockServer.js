const { initMock, getMatchMock } = require('./getMockData');
const { winPath } = require('./utils');
const { join } = require('path');
const chokidar = require('chokidar');
const signale = require('signale');
const { configBabelRegister } = require('./registerBabel');
let mockconfig = require('./mockconfig');
const url = require('url');
const { match } = require('path-to-regexp');
let watcher;
function getPaths(cwd) {
  const winCwd = winPath(cwd);
  const absMockPath = winPath(join(winCwd, 'mock'));
  const absMockConfigPath = winPath(join(winCwd, '/build/mock/mockconfig.js'));
  return {
    absMockPath,
    absMockConfigPath,
  };
}

function parseJson(req) {
  return new Promise(resolve => {
    let body = '';
    let jsonStr = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      try {
        jsonStr = JSON.parse(body);
      } catch (err) {
        jsonStr = '';
      }
      resolve(jsonStr);
      return;
    });
  });
}
module.exports = function (options = { watch: true, cwd: process.cwd() }) {
  const { absMockPath, absMockConfigPath } = getPaths(options.cwd);
  const paths = [absMockPath, absMockConfigPath];
  // vite热更新时关闭上一个进程
  if (watcher) {
    watcher.close();
  }
  configBabelRegister(paths, {
    cwd: options.cwd,
  });
  initMock(mockconfig);
  if (options.watch) {
    initWatchMockFiles();
  }
  function initWatchMockFiles() {
    // chokidar 在 windows 下使用反斜杠组成的 glob 无法正确 watch 文件变动
    // ref: https://github.com/paulmillr/chokidar/issues/777
    const absPagesGlobPath = winPath(join('./mock', '**/*.[jt]s'));
    watcher = chokidar.watch([...['./mock'], absMockConfigPath, absPagesGlobPath], {
      ignoreInitial: true,
    });
    watcher.on('all', (event, file) => {
      signale.info(`[${event}] ${file}, reload mock data`);
      cleanRequireCache();
      if (file.indexOf('mockconfig.js') != -1) {
        mockconfig = require('./mockconfig');
      }
      initMock(mockconfig);
    });
    process.once('SIGINT', () => {
      watcher.close();
    });
  }
  function cleanRequireCache() {
    Object.keys(require.cache).forEach(file => {
      if (
        paths.some(path => {
          return winPath(file).indexOf(path) > -1;
        })
      ) {
        delete require.cache[file];
      }
    });
  }

  return {
    configureServer({ middlewares }) {
      const middleware = async (req, res, next) => {
        let matchMock = getMatchMock(req.url);
        if (mockconfig.enable && matchMock) {
          let queryParams = {};

          if (req.url) {
            queryParams = url.parse(req.url, true);
          }

          const reqUrl = queryParams.pathname;
          let query = queryParams.query;
          if (reqUrl) {
            const isGet = req.method && req.method.toUpperCase() === 'GET';
            if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
              const urlMatch = match(url, { decode: decodeURIComponent });
              const params = urlMatch(reqUrl).params;
              if (JSON.stringify(params) !== '{}') {
                query = urlMatch(reqUrl).params || {};
              } else {
                query = queryParams.query || {};
              }
            }
          }
          const body = await parseJson(req);
          res.setHeader('Content-Type', 'application/json;charset=utf-8');
          res.send = opt => res.end(JSON.stringify(opt));
          res.json = opt => res.end(JSON.stringify(opt));
          matchMock.handler({ url: req.url, body, query, headers: req.headers }, res);
          return;
        } else {
          return next();
        }
      };
      middlewares.use(middleware);
    },
  };
};
