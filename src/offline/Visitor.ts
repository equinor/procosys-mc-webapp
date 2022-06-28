export interface IVisitor {
    visit(visitor: IVisitor): void;
}

export interface IElements {
    accept(visitor: IVisitor): void;
}
