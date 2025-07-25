type Callback<T = any> = (arg: T) => void;
export declare class FunctionHook {
    obj: any;
    key: string;
    private _callHandlers;
    private _returnHandlers;
    private _errorHandlers;
    private _origFn;
    constructor(obj: any, key: string);
    private _hook;
    onCall(fn: Callback<any[]>): this;
    onReturn(fn: Callback<any>): this;
    onError(fn: Callback<Error>): this;
    unhook(): void;
}
export declare class PropertyHook {
    obj: any;
    key: string;
    private _getHandlers;
    private _setHandlers;
    private _origDescriptor;
    private _value;
    constructor(obj: any, key: string);
    private _hook;
    onGet(fn: Callback<any>): this;
    onSet(fn: Callback<any>): this;
    unhook(): void;
}
export declare class HookManager {
    root: any;
    private hooks;
    constructor(root?: any);
    hook(path: string): FunctionHook | PropertyHook;
    unhook(path: string): void;
    unhookAll(): void;
}
export {};
