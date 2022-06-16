# Backend 

# Feature
When the MC App uploads its offline content, the API should have a function that ensure data integrity
http://api/checklistitem:{data}
PBI 1. Create Middleware for HTTP requests (HEADER + PUT|POST )
PBI 2. Ensure Not Dirty (NowState == Request.Header.Hash )
PBI 2. Create Middleware for HTTP response 


## Procedure:  (Duplicate PBI foreach path)
1. HEADER == SYNCH
1.1 PUT|POST
1.3 var type = LOOPUP[REQUEST.Uri]
1.4 T type = deserialize(payload)
1.5 var asIsEntity == QUERY(payload.id) [Remember that we use the CheckList not CheckListItem]
1.5 Hash(type) == Hash(asIsEntity)
1.3 Compare type && asIsEntity, compare properties value 
1.4 Fail send Response

TIME: 12 api * 8timer

# Procedure Response:
REQUEST.headers contains "SYNC"
REQUEST.method = PUT|POST

var type = LOOPUP[REQUEST.Uri]
1.4 T type = deserialize(payload)
1.5 var asIsEntity == QUERY(payload.id) [Remember that we use the CheckList not CheckListItem]
1.6 RESPONSE.Headers.Add("HASH", Hash(asIsEntity))

TIME: 12 api * 4timer
 
Swagger doc: 8t 

We need the same mechanism when we building up the offline scope. Here we need to generate the initial Digital Signature used E.g:
 


### Middleware for GET request processing 
We need at least two  CustomMiddleware for handing
1. http://api.com/checklist?id=100 
2. http://api.com/punchListItem?id=100

Procedure: For middleware GET operations on CheckList og PunchListItem method
0. The request header should contain a PCS_MC_APP_Mode:BUILDING_OFFLINE_SCOPE value
1. The request method should be GET 
2. var type = Find the type associated with the [REQUEST.Uri] from an Dictionary<Uri, Type>
3. T data = deserialize(REQUEST.payload)
4. var freshType = Query the database|api for getting the latest version of  = GetEntityWithId(data.Id)
5. response.Headers(PCS_MC_APP_Mode:BUILDING_OFFLINE_SCOPE)
6. response.Headers(HASH, Hash(freshType))
7. send response

## From API Perspective with Middleware - GET - CheckList|PunchListItem
### From MC APP Perspective
1. We need to signal to the Middleware that we BUILDING_OFFLINE_SCOPE
2. CREATE REQUEST
 2.1 Method: GET
 2.2 Headers.Add(PCS_MC_APP_Mode, CREATE_OFFLINE_SCOPE)
 3.2 SEND

### From API Perspective
### Process response from API containing digitalSignature and data
 3.3 var hash = RESPONSE.Headers.find("DigitalSignature)
 3.4 var request = REQUEST
 4.5 var response = RESPONSE
 4.6 var uniqueIndex = Hash(REQUEST, RESPONSE)
 4.7 db.insert(uniqueIndex, hash, REQUEST, RESPONSE)






- Goal: The offline functionality should have as little impact as possible on the existing Main-API (API)
- When the MC App uploads its offline content, the API should have a function that ensure data integrity 
- Create an API Http Middleware with properties like:
    - Detect stale data 
        - When MC APP (APP) are in SYNC mode all http traffic will contains:
        ``` 
            {"PCS_MC_APP_Mode", "SYNC"}, 
            {"PCS_MC_APP_KEY", "1.1"},  
        ```
        The KEY will provide created and modified values from when the offline scope was created

        - The middleware will be triggered by the "SYNC" header value.

            - Make a query to database, and find the latest Created or Modified - [Compare Now() against KEY]. If they are equals, the are "less" change to break data integrity 
            ``` 
            S = Query(C|M) != PCS_MC_APP_KEY
            Query(C|M): Getting the latest created or modified date  
            PCS_MC_APP_KEY: Information about when the Entity (CheckList|Punch) was 'lasted' change from MC App point of view 
            ``` 

            - Create a Http response with HEADER(S) so that MC App can update the offline content, especially important when doing PUT Request for updating a CheckList checkListItems, where CheckList is lowest Entity that contains change or modified fields. (The CheckList object modifiedDate will be change when a PUT /api/CheckListItem?Id=X&Value=Y
            occurs)

             ``` 
            S = Query(C|M) 
            If HTTP REQUEST == PCS_MC_APP_Mode:Sync, Then HTTP RESPONSE har en header  PCS_MC_APP_KEY:<Ny Key>
            ``` 


            API Http middleware is a "thing" that allow execution of "Cross-Cutting-Concerns" in the HttpPipeline (We can chain up a chain of middleware handlers and Short circuit the request if needed  )

Epic: "When running a mc_app stored search from MC App, we retrieve a result list with different types of entities in the search result"

- As a User I want to run queries stored as saved mc search, so that I can create a new or extend an existing one    

  The Search results in a collection of CheckLists and PunchItems (We don't have any knowledge of association|relation to 'mother' )

Note:  Already c
        

           
# Front-end 
# Epics
## It should be possible to call the API 
