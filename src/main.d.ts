declare const app: import("vue").App<Element>;
declare global {
    interface Window {
        app: typeof app;
    }
}
export {};
