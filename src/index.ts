type Callback<T = any> = (arg: T) => void;

class FunctionHook {
    private _callHandlers: Callback<any[]>[] = [];
    private _returnHandlers: Callback<any>[] = [];
    private _errorHandlers: Callback<Error>[] = [];
    private _origFn: Function;

    constructor(public obj: any, public key: string) {
        this._origFn = obj[key];
        this._hook();
    }

    private _hook() {
        const self = this;
        this.obj[this.key] = function (...args: any[]) {
            self._callHandlers.forEach(fn => fn.call(this, args));

            let result;
            try {
                result = self._origFn.apply(this, args);
            } catch (err) {
                self._errorHandlers.forEach(fn => fn.call(this, err as Error));
                throw err;
            }

            if (result && typeof result.then === 'function') {
                return result.then(
                    (res: any) => {
                        self._returnHandlers.forEach(fn => fn.call(this, res));
                        return res;
                    },
                    (err: any) => {
                        self._errorHandlers.forEach(fn => fn.call(this, err));
                        return Promise.reject(err);
                    }
                );
            } else {
                self._returnHandlers.forEach(fn => fn.call(this, result));
                return result;
            }
        };
    }

    onCall(fn: Callback<any[]>): this {
        this._callHandlers.push(fn);
        return this;
    }

    onReturn(fn: Callback<any>): this {
        this._returnHandlers.push(fn);
        return this;
    }

    onError(fn: Callback<Error>): this {
        this._errorHandlers.push(fn);
        return this;
    }

    unhook(): void {
        this.obj[this.key] = this._origFn;
    }
}

class PropertyHook {
    private _getHandlers: Callback<any>[] = [];
    private _setHandlers: Callback<any>[] = [];
    private _origDescriptor: PropertyDescriptor | undefined;
    private _value: any;

    constructor(public obj: any, public key: string) {
        this._origDescriptor = Object.getOwnPropertyDescriptor(obj, key);
        this._value = obj[key];
        this._hook();
    }

    private _hook() {
        const self = this;
        Object.defineProperty(this.obj, this.key, {
            configurable: true,
            enumerable: true,
            get() {
                self._getHandlers.forEach(fn => fn.call(this, self._value));
                return self._value;
            },
            set(val) {
                self._setHandlers.forEach(fn => fn.call(this, val));
                self._value = val;
            }
        });
    }

    onGet(fn: Callback<any>): this {
        this._getHandlers.push(fn);
        return this;
    }

    onSet(fn: Callback<any>): this {
        this._setHandlers.push(fn);
        return this;
    }

    unhook(): void {
        if (this._origDescriptor) {
            Object.defineProperty(this.obj, this.key, this._origDescriptor);
        }
    }
}

function resolvePath(root: any, path: string): { obj: any; key: string } | null {
    const parts = path.split('.');
    let target = root;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!target) return null;
        target = target[parts[i]];
    }
    const key = parts[parts.length - 1];
    return target ? { obj: target, key } : null;
}

export default class HookManager {
    private hooks = new Map<string, FunctionHook | PropertyHook>();

    constructor(public root: any = typeof window !== 'undefined' ? window : globalThis) {}

    hook(path: string): FunctionHook | PropertyHook {
        const result = resolvePath(this.root, path);
        if (!result) throw new Error(`Invalid path: ${path}`);

        const { obj, key } = result;
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        const isFunction = typeof obj[key] === 'function' && !(descriptor && (descriptor.get || descriptor.set));

        const hook = isFunction
            ? new FunctionHook(obj, key)
            : new PropertyHook(obj, key);

        this.hooks.set(path, hook);
        return hook;
    }

    unhook(path: string): void {
        const hook = this.hooks.get(path);
        if (hook) {
            hook.unhook();
            this.hooks.delete(path);
        }
    }

    unhookAll(): void {
        for (const hook of this.hooks.values()) {
            hook.unhook();
        }
        this.hooks.clear();
    }
}