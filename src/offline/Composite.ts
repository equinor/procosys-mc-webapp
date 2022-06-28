// import { AADServerParamKeys } from '@azure/msal-common/dist/utils/Constants';
// import { remove } from '@equinor/eds-icons';
// import { add } from '@equinor/eds-icons';
import { EntityTypes } from './Entity';
import { StrategyTypes } from './Strategy';

export interface IComponent {
    save(): void;
    load(): void;
}

export abstract class Component implements IComponent {
    protected parent!: Component | null;

    public setParent(parent: Component | null): void {
        this.parent = parent;
    }
    public getParent(): Component | null {
        return this.parent;
    }
    add(component: Component): void {}

    remove(component: Component): void {}

    isComposite(): boolean {
        return false;
    }

    save(): void {
        throw new Error('Method not implemented.');
    }
    load(): void {
        throw new Error('Method not implemented.');
    }
    public abstract operation(): string;
}

export type LeafOperationType = { type: string };

export class Composite extends Component {
    protected children: Component[] = [];

    /**
     * A composite object can add or remove other components (both simple or
     * complex) to or from its child list.
     */
    public add(component: Component): void {
        this.children.push(component);
        component.setParent(this);
    }

    public remove(component: Component): void {
        const componentIndex = this.children.indexOf(component);
        this.children.splice(componentIndex, 1);

        component.setParent(null);
    }

    public isComposite(): boolean {
        return true;
    }

    /**
     * The Composite executes its primary logic in a particular way. It
     * traverses recursively through all its children, collecting and summing
     * their results. Since the composite's children pass these calls to their
     * children and so forth, the whole object tree is traversed as a result.
     */
    public operation(): string {
        const results = [];
        for (const child of this.children) {
            results.push(child.operation());
        }

        return `Branch(${results.join('+')})`;
    }

    clientCode(component: Component): void {
        console.log(`RESULT: ${component.operation()}`);
    }
}
