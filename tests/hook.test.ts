import { describe, it, expect } from 'vitest'
import { HookManager } from '../src/index'

describe('HookManager', () => {
    it('should intercept function calls', async () => {
        const log: string[] = []
        const obj = {
            async test(x: number) {
                return x + 1
            }
        }
        const manager = new HookManager({ obj })
        manager.hook('obj.test')
            .onCall(args => log.push(`called with ${args}`))
            .onReturn(res => log.push(`returned ${res}`))

        await obj.test(5)
        expect(log).toEqual(['called with 5', 'returned 6'])
    })

    it('should intercept property get/set', () => {
        const log: string[] = []
        const obj = { value: 42 }
        const manager = new HookManager({ obj })
        manager.hook('obj.value')
            .onGet(val => log.push(`get ${val}`))
            .onSet(val => log.push(`set ${val}`))

        obj.value = 100
        const _ = obj.value
        expect(log).toEqual(['set 100', 'get 100'])
    })
})