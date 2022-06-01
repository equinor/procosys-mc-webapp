//https://svitla.com/blog/functional-programming-in-typescript#:~:text=Function%20composition%20in%20Typescript&text=Note%20the%20split%20function%20only,used%20inside%20the%20map%20call.

type Rule<T> = (x: T) => null | string;

type FormRules<T> = {
    [K in keyof T]: Rule<T[K]>;
};

const compose =
    <T>(a: Rule<T>, b: Rule<T>): Rule<T> =>
    (x) =>
        a(x) || b(x);
