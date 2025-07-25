# hook-manager

一个轻量的 JavaScript / TypeScript 函数和属性拦截（Hook）管理器，支持同步异步函数拦截，属性的 getter/setter 拦截。

支持多种打包格式（ESM、CJS、UMD、浏览器 min.js），并附带完整的 TypeScript 类型定义。



## 安装

```bash
npm install hook-manager
```

## 使用
```js
import { HookManager } from 'hook-manager'

// 需要被拦截的对象
const target = {
  async fetchData(x: number) {
    return x * 2
  },
  name: 'demo'
}

const manager = new HookManager({ target })

// 拦截函数调用
manager.hook('target.fetchData')
  .onCall(args => console.log('Called fetchData with', args))
  .onReturn(res => console.log('Returned fetchData result:', res))
  .onError(err => console.error('Error in fetchData:', err))

// 拦截属性访问和赋值
manager.hook('target.name')
  .onGet(val => console.log('Get name:', val))
  .onSet(val => console.log('Set name:', val))

// 使用示例
target.fetchData(21).then(console.log)
target.name = 'new name'
console.log(target.name)

```

## API

### `new HookManager(root?: object)`

构造函数，默认 root 是全局对象 `window`（浏览器）或 `globalThis`（Node.js）。

### `hook(path: string): FunctionHook | PropertyHook`

根据路径对函数或属性进行 Hook，路径格式示例：

* `myObject.myFunc`
* `myObject.someProperty`

返回对应 Hook 实例，支持链式调用。

### FunctionHook 方法

* `.onCall(fn: (args: any[]) => void): this` — 拦截函数调用参数
* `.onReturn(fn: (result: any) => void): this` — 拦截函数返回值（支持 Promise）
* `.onError(fn: (error: Error) => void): this` — 拦截函数抛出错误
* `.unhook(): void` — 取消 Hook，恢复原函数

### PropertyHook 方法

* `.onGet(fn: (value: any) => void): this` — 拦截属性读取
* `.onSet(fn: (value: any) => void): this` — 拦截属性赋值
* `.unhook(): void` — 取消 Hook，恢复原属性描述符

### 其他

* `unhook(path: string): void` — 取消指定路径的 Hook
* `unhookAll(): void` — 取消所有 Hook

---

## 许可证

MIT License




