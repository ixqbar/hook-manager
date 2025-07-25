import { HookManager } from '../dist/hook-manager.es.js'

// 模拟一个对象
const target = {
    async fetchData(x: number) {
        return x * 2
    },
    name: 'demo'
}

const manager = new HookManager({ target })

manager.hook('target.fetchData')
    .onCall(args => console.log('[CALL] fetchData with', args))
    .onReturn(res => console.log('[RETURN] fetchData result:', res))
    .onError(err => console.error('[ERROR]', err))

manager.hook('target.name')
    .onGet(val => console.log('[GET] name =', val))
    .onSet(val => console.log('[SET] name =', val))

// 测试调用
target.fetchData(21).then(console.log)
target.name = 'new name'
console.log(target.name)