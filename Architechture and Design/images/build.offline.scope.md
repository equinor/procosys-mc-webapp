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

## Offline
```mermaid
classDiagram
    Entity <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
```