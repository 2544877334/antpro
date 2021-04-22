const { initMock, getMatchMock } = require('./getMockData');
const { winPath } = require('./utils');
const { join } = require('path');
const chokidar = require('chokidar');
const signale = require('signale');
const { configBabelRegister } = require('./registerBabel');
let mockconfig = require('./mockconfig');
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
    const absPagesGlobPath = winPath(join('./mock', '**/_mock.[jt]s'));
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
    configureServer({ app }) {
      const middleware = async (req, res, next) => {
        let matchMock = getMatchMock(req.url);
        if (mockconfig.enable && matchMock) {
          res.setHeader('Content-Type', 'application/json;charset=utf-8');
          return matchMock.handler(req, res, next);
        } else {
          return next();
        }
      };
      app.use(middleware);
    },
  };
};
