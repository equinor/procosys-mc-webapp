
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
      React Offline toggle button                         :a1, 2d
      
      Add ServiceWorker template                          :a1, 1d
      
      Add Custom Paths and Matches functions              :after a1, 7d

      Create concept of Response Entities                 :after a1, 3d

      Generate Offline Data Process                       :after a1, 7d
      
      Create TagEntities with Indexes                     :after a1, 3d
      Create TagRepository                                :after a1, 2d
      Integration tests for TagRepository                 :after a1, 3d
      Generate Tag data                                   :after a1
      
      Create PunchEntity indexes                          :after a1,cpe1, 1d
      Punch Repository                                    :after a1,cpe1, 1d
      Integration tests for PunchRepository               :after a1,cpe1, 1d     
      Generate Punch Data                                 :after cpe1, 3d 
      
      Create PunchCategoryEntity indexes                  :cpe2, 1d
      PunchCategory Repository                            :after cpe1, 1d
      Integration test for PunchCategoryRepository        :after cpe1, 1d
      Generate PunchCategory Data                         :after cpe1, 3d
      
      Create PunchPriorityEntity indexes                  :cpe3, 1d
      PunchPriority Repository                            :after cpe2, 1d
      Integration test for PunchPriorityRepository        :after cpe2, 1d                
      Generate PunchPriority Data                         :after cpe1, 3d
      
      Create PunchTypesEntity indexes                     :pte1, 1d
      PunchTypes Repository                               :ptr after pte1, 1d
      Integration test PunchTypesRepository               :after pte1, 1d
      Generate PunchTypes Data                            :after ptr , 3d       

      Create PunchSortEntity and indexes                  :cpe5, 4d
      PunchSortEntityRepository                           :pser after cpe5, 1d
      Integration test PunchSortEntityRepository          :after pser, 1d
      Generate PunchSort Data                             :gpsd after pser , 3d
      
      Create PunchOrganizationEntity and indexes          :cpoe, 1d
      PunchOrganizationEntityRepository                   :poer after cpoe, 1d
      Integration tests PunchOrganizationEntityRepository :after poer, 1d
      Generate PunchOrganizations Data                    :after poer, 3d

      Create ChecklistEntity and indexes                  :ccei, 1d
      ChecklistEntityRepository                           :cler after ccei, 1d
      Integration tests ChecklistRepository               :after cler, 1d   
      Generate Checklists Data                            :after cler, 3d


      Create ChecklistItemEntity and indexes              :clie, 1d
      Create ChecklistItemRepository                      :clir after clie, 1d
      Integration test ChecklistItemRepository            :after clir, 1d
      Generate ChecklistItems Data                        :after clir, 3d
     
      Create CustomCheckItemsEntity and indexes           :ccie, 1d 
      Create CustomCheckItemsRepository                   :ccir after ccie, 1d
      Integration tests CustomCheckItemsRepository        :after ccir, 1d
      Generate CustomCheckItems Data                      :after cpe1, 3d

      Create LoopstagsEntity and indexes                  :ltei, 1d
      Create LoopstagsRepository                          :ltre after ltei, 1d
      Integration tests LoopstagsRepository               :after ltre, 3d
      Generate Loopstags Data                             :after cpe1, 3d

      Create RowsEntity and indexes                       :rtei, 1d
      Create RowsEntityRepository                         :rtre after rtei, 3d
      Create RowsEntity Integration Tests                 :after rtre, 3d
      Generate Rows Data                                  :after rtre, 1d

      Create ColumnsEntity and indexes                    :ctei, 1d
      Create ColumnsRepository                            :ctre after ctei, 1d
      Create ColumnsRepository Tests                      :ctre after ctei, 1d   
      Generate Columns Data                               :after ctre, 1d 

      Create ColumListEntity and indexes                  :clte, 1d
      Create ColumListRepository                          :cltr after clte, 1d
      Integration Tests ColumListRepository               :cltrtest after cltr, 1d
      Generate ColumnLabels Data                          :after cpe1, 3d
      
      Create ColumnLabelsEntity and indexes               :clle, 1d
      Create ColumnLabelsRepository                       :cllr after clle, 1d
      Integration Tests ColumnLabelsRepository            :cllrtest after cllr, 1d
      Generate ColumnLabels Data                          :after cpe1, 3d
      
      Create CellsEntity and indexes                      :ctei, 1d
      Create CellsEntityRepository                        :ctre after ctei, 1d
      Integration Tests CellsEntityRepository             :ctretest after ctre, 1d
      Generate Cells Data                                 :after cpe1, 3d

      MoreToCome (Vilde) [Det er flere Eniteter som skal genereres]   :after cpe1, 3d
       
      Generate Person Data                                            :after cpe1, 3d

      Setup Equinor PC for working with selfsigned certificates       :after a1, 1d

      Create Broadcast React Component                                 :after a1, 1d                    
      Create React Component for loading and handling ServiceWorker modifications :after cpe1, 3d
      (Prototypes and Code ref. article ref:<Dan>)

      Modification (Post or Put operation) on a Punch should be following with a update of one or more Database Entities : after a1, 5d
      Note: Any more to come..... :)  

    

      Dixie decryption/encryption   :a4, 3d
      UI for selection offline scope:a3,  5d
      Load offline data from Main API:a5, 10d

    section Main API
    Create offline scope : a1, 4d
    Add API for GET offline scope  :a1, 1d    
    another task                        :after a1, 1d
    
    section PCS MAIN
    UI offline scope (Select MCPkg with disciplineCode)      :pcs1, 12d
    Save to database      :pcs1, 4d
```