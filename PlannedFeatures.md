
# Gnat diagram 
A Gantt chart is a type of bar chart that illustrates a project schedule, named after its popularizer, Henry Gantt, who designed such a chart around the years 1910–1915. Modern Gantt charts also show the dependency relationships between activities and the current schedule status. 
<br>[Ref](https://en.wikipedia.org/wiki/Gantt_chart)

# Note
To able able to view and do modifications in this markdown file, please install the VS code mermaid extension.


# Identified features for "offline" project   

```mermaid
%%{init: {'securityLevel': 'loose', 'theme':'default'}}%%
gantt
    title The "offline" project
    dateFormat  DD-MM-YYYY

    Section Web App
      Add ServiceWorker template                          :a1, 1d
      Service worker need to persist state in local storage :
      Add Custom Paths and Matches functions              :after a1, 7d
      Create concept of response Entities                 :after a1, 3d
      Generate Offline Data Process                       :after a1, 7d
      
      Create TagEntities with Indexes                     :cte, after a1, 2d
      Create TagRepository                                :ctr, after cte, 2d
      Integration tests for TagRepository                 :testtr, after ctr, 3d
      Generate Tag data                                   :after testtr, 3d
      
      Create PunchEntity indexes                          :cpe1, after a1, 2d
      Punch Repository                                    :pr, after cpe1, 2d
      Integration tests for PunchRepository               :cretest, after pr, 1d     
      Generate Punch Data                                 :gpd, after cretest, 2d 
      
      Create PunchCategoryEntity indexes                  :poce, after a1, 2d
      PunchCategory Repository                            :pcr, after poce, 2d
      Integration test for PunchCategoryRepository        :testpcr, after pcrrr, 2d
      Generate PunchCategory Data                         :cpcd, after testpcr, 2d
      
      Create PunchPriorityEntity indexes                  :cpe3, after a1, 2d
      PunchPriority Repository                            :ppr, after cpe3, 1d
      Integration test for PunchPriorityRepository        :testppr, after ppr, 1d                
      Generate PunchPriority Data                         :after testppr, 3d
      
      Create PunchTypesEntity indexes                     :pte1, after a1, 1d
      PunchTypes Repository                               :ptr, after pte1, 1d
      Integration test PunchTypesRepository               :testptr, after ptr, 1d
      Generate PunchTypes Data                            :after testptr , 1d       

      Create PunchSortEntity and indexes                  :cpe5, after a1, 2d
      PunchSortEntityRepository                           :pser, after cpe5, 1d
      Integration test PunchSortEntityRepository          :testpser, after pser, 1d
      Generate PunchSort Data                             :gpsd,  after testpser , 3d
      
      Create PunchOrganizationEntity and indexes          :cpoe, after a1, 2d
      PunchOrganizationEntityRepository                   :poer, after cpoe, 1d
      Integration tests PunchOrganizationEntityRepository :testpoer, after poer, 1d
      Generate PunchOrganizations Data                    :gpod, after testpoer, 3d

      Create ChecklistEntity and indexes                  :ccei, after a1, 2d
      ChecklistEntityRepository                           :cler, after ccei, 1d
      Integration tests ChecklistRepository               :testcler, after cler, 1d   
      Generate Checklists Data                            :gcld, after testcler, 1d

      Create ChecklistItemEntity and indexes              :clie, after a1,  1d
      Create ChecklistItemRepository                      :clir, after clie, 1d
      Integration test ChecklistItemRepository            :testclir, after clir, 1d
      Generate ChecklistItems Data                        :after testclir, 3d
     
      Create CustomCheckItemsEntity and indexes           :ccie, after a1,  1d 
      Create CustomCheckItemsRepository                   :ccir,  after ccie, 1d
      Integration tests CustomCheckItemsRepository        :testccir, after ccir, 1d
      Generate CustomCheckItems Data                      :gccd, after testccir, 3d

      Create LoopstagsEntity and indexes                  :ltei, after a1, 2d
      Create LoopstagsRepository                          :ltre, after ltei, 1d
      Integration tests LoopstagsRepository               :testltre, after ltre, 3d
      Generate Loopstags Data                             :glts, after testltre, 3d

      Create RowsEntity and indexes                       :rtei, after a1, 2d
      Create RowsEntityRepository                         :rtre, after rtei, 1d
      Create RowsEntity Integration Tests                 :testrtre, after rtre, 3d
      Generate Rows Data                                  :grd, after testrtre, 1d

      Create ColumnsEntity and indexes                    :ctei, after a1, 1d
      Create ColumnsRepository                            :ctre, after ctei, 1d
      Create ColumnsRepository Tests                      :testctre, after ctre, 1d   
      Generate Columns Data                               :after testctre, 1d 

      Create ColumListEntity and indexes                  :clte, after a1, 1d
      Create ColumListRepository                          :cltr, after clte, 1d
      Integration Tests ColumListRepository               :cltrtest, after cltr, 1d
      Generate ColumnLabels Data                          :after cltrtest, 3d
      
      Create ColumnLabelsEntity and indexes               :clle, after a1, 1d
      Create ColumnLabelsRepository                       :cllr, after clle, 1d
      Integration Tests ColumnLabelsRepository            :cllrtest, after cllr, 1d
      Generate ColumnLabels Data                          :after cllrtest, 2d
      
      Create CellsEntity and indexes                      :ctei, after a1, 1d
      Create CellsEntityRepository                        :ctre, after ctei, 1d
      Integration Tests CellsEntityRepository             :ctretest, after ctre, 1d
      Generate Cells Data                                 :after ctretest, 1d

      Create AdditionalTagFieldsEntity and indexes        :atfi, after a1, 1d
      Create AdditionalTagFieldsRepository                :atfr, after atfi, 1d
      Integration Tests AdditionalTagFieldsRepository     :atfrtest, after atfr, 1d
      Generate AdditionalTagFields Data                   :after atfrtest, 1d

      Create McPkgPreviewEntity and indexes               :mcpp, after a1, 1d
      Create McPkgPreviewRepository                       :mcpr, after mcpp, 1d
      Integration Tests McPkgPreviewRepository            :mcprtest, after mcpr, 1d
      Generate McPkgPreview Data                          :after mcprtest, 1d

      Create WoPreviewEntity and indexes                  :wope, after a1, 1d
      Create WoPreviewRepository                          :wopr, after wope, 1d
      Integration Tests WoPreviewRepository               :woprtest, after wopr, 1d
      Generate WoPreview Data                             :after woprtest, 1d

      Create PoPreviewEntity and indexes                  :pope, after a1, 1d
      Create PoPreviewRepository                          :popr, after pope, 1d
      Integration Tests PoPreviewRepository               :poprtest, after popr, 1d
      Generate PoPreview Data                             :after poprtest, 1d

      Create PersonsEntity and indexes                    :pere, after a1, 1d
      Create PersonsRepository                            :perr, after pere, 1d
      Integration Tests PersonsRepository                 :perrtest, after perr, 1d
      Generate Persons Data                               :after perrtest, 1d

       
      Generate Person Data (why is this here?)                               :after cpe1, 3d

      Setup Equinor PC for working with selfsigned certificates       :after a1, 1d
    
      Modification (Post or Put operation) on a Punch should be followed with an update of checklist and MC pkg : after a1, 5d
      Modification (Post or Put operation) on a Checklist should be followed with an update of MC pkg : after a1, 5d
      

      UI for selection offline scope:a3,  5d
      Load offline data from Main API:a5, 10d

    Section Main API
      Create offline scope                                                        : a1, 4d
      Add API for GET offline scope                                               :a1, 1d    
      another task                                                                :after a1, 1d
    
    Section PCS MAIN
      UI offline scope (Select MCPkg with disciplineCode)                         :pcs1, 12d
      Select offline scope                                                        :pcs-create-scope, after pcs1, 3d
      
    Section Main API
      API for persisting offline work                                             :api-persist-offline, pcs1, 4d
      API for getting offline work                                                :api-get-offline, pcs1, 4d

    Section React Components
      Create Broadcast React Component                                            :cbrc, after a1, 1d                    
      Create React Component for loading and handling ServiceWorker modifications :after cpe1, 3d
      React Offline toggle button                                                 :tooglebutton, after a1, 2d
    
    Section Security
      Dixie decryption/encryption                                                 :dixiesec, after a1, 3d

    Section Export Data
      Get change data by modified date                                            :gcd, after api-persist-offline, 1d
      Publish data to Main API                                                    :publish, after gcd, 1d
      Cleanup offline data                                                        :cleanup, after publish, 1d
```