import Context from "./core/context";
import {Middleware} from "./core/container";

//调用中间件,用于调用真实的方法
export default async function invoker(ctx: Context, next: Middleware) {
  ctx.result = new Date();
  await next()
}
