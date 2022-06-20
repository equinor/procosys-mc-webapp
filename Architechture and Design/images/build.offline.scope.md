# Building offlone scope 

```mermaid
sequenceDiagram
    Function(E(id)) ->> Api:  Get The Function   
    Api -->> Function(E(id)):  The Function is returned
    Function(E(id))->> Api: Get all checklist that belongs to this Function    
    Api -->> Function(E(id)): List Checklist of Checklists that belong to E
    Function(E(id))->> Api: Get All CheckListItem that belongs to the current CheckList
    Api -->> Function(E(id)): List CheckListItem of CheckListItem that belong to E
    Function(E(id))->> Api: Get All Punch that belongs to the current CheckList
    Api -->> Function(E(id)): List Punch of Punch that belong to E
    Function(E(id))->> Api: Get All PunchItems that belongs to the current Punch
    Api -->> Function(E(id)): List PunchItems of PunchItems that belong to E 
    Function(E(id))->> Api: Get All Attachment that belongs to the current PunchItem
    Api -->> Function(E(id)): List Attachment of Attachment that belong to E
```

## Visitor pattern matchingBenefits:
The following lists the benefits of using the Visitor pattern:

1. Makes adding new operations easy
2. Gathers related operations and separates unrelated ones

When to Use:
You should use the Visitor pattern when:

 1. An object structure contains many classes of objects with differing interfaces and you want to perform operations on these objects that depend on their concrete classes.
2. Classes defining the object structure rarely change but you often want to define new operations over the structure.




``` Typescript
interface IHttpMessage<T> {
    request: IHttpRequestMessage;
    response IHttpResponseMessage;
    data: Array<T>;
    executedDate : Date
    executedBy: Person

    executeRequestMessage(): IHttpResponseMessage;
    getHash(): string;
    getData(): Array<T>;
}

interface IStrategy<T> {
    httpMessage : IHttpMessage
    execute(): void
    getExecutedDate(): Date;
    getExecutedBy(): Person;
}

public class GetEntityStrategy<T> : IStrategy<T> {
    httpMessage: IHttpMessage;

    constructor(httpClient client,
        httpMessage: IHttpMessage) {
        this.httpMessage = httpMessage;
    }

    IHttpMessage execute() {
        this.httpMessage.executeRequestMessage();
    }

    getHash(): string {
        return this.httpMessage.getHash();
    }
}


interface Visitor
{
    accept(visitor: IVisitor): void;
}

interface IEntityWithWork extends IVisitor {
    accept(visitor: IVisitor): void;
    IStrategy<T> workStrategy;
    void doWork();
}

    
interface ICheckList extends IEntityWithWork {
    accept(visitor: IVisitor): void;
    doWork();
}

interface ICheckListItem<IPunch> {
  accept(visitor: IVisitor): void;  
  doWork();
}

interface IPunch<IPunchItem> {
  accept(visitor: IVisitor): void;  
  doWork();
}

interface IPunchItem {
    accept(visitor: IPunchItemVisitor);
    doWork();
}

// GET /api/CommPkg/CheckLists 
class CheckList extends ICheckList {
    constructor(
        IStrategy<ChecklistDetails> ChecklistDetailsStrategy, 
        IStrategy<ChecklistPreview> ChecklistPreviewStrategy,
        IStrategy<Attachments> getAttachmentsInCheckListStrategy) 
        {}
    
    accept(visitor: ICheckList) {
        visitor.visit(this);
    }

    doWork(): void { 
        ChecklistDetailsStrategy.execute();
        ChecklistPreviewStrategy.execute(); 
        getAttachmentsInCheckListStrategy.execute();
        }
    
    

} 

class CheckItem extends ICheckItem {

}

```
# Usage 
class McPkt extends IEntity 
{}