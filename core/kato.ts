import * as mergeOptions from 'merge-options'
import Context from "./context";
import {MiddlewareContainer} from "./middleware";
import {ModuleContainer} from "./module";
import {jsonStringify} from "./common/json";

const debug = require('debug')('kato:core');

type KatoOptions = {
  loose?: boolean,
  files?: {
    maxSize?: number
    maxCount?: number
  }
}

export default class Kato {
  //中间件容器
  middlewares = new MiddlewareContainer();
  //模块容器
  modules = new ModuleContainer();
  //配置
  options: KatoOptions;

  constructor(options: KatoOptions = {}) {
    //初始化配置
    const defaultOptions: KatoOptions = {
      loose: false,
      files: {
        maxCount: 5,
        maxSize: 50000000
      }
    };
    this.options = mergeOptions.call({concatArrays: true}, defaultOptions, options);
    debug(`config: ${jsonStringify(this.options)}`);
  }

  //添加中间件
  use = this.middlewares.use.bind(this.middlewares);
  //添加中间件
  useAfter = this.middlewares.useAfter.bind(this.middlewares);

  //加载api模块
  load = this.modules.load.bind(this.modules);

  //执行来自适配器过来的实例
  async do(ctx: Context) {
    ctx.kato = this;
    //交给中间件去处理
    await this.middlewares.do(ctx);
  }
}
