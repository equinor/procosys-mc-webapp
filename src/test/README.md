# Axios HttpClient 
Http communication is implemented with the Axios library. The HttpRequests and Responses for offline content will be defined by two simple classes 
    - HttpRequestMessage 
    - HttpResponseMessage

The objects will have the same design as there counterpart in .net Core. The classes will put common functionality to to the base classes and share a common abstract interface. The main reason for creating these classes is to be agnostics to technology stack. And delegate the Axios -> Data and Data -> Axios into the base functionality.


```mermaid 
 classDiagram
 IHttpCommon <|-- IHttpRequestMessage
 IHttpRequestMessage <|-- HttpRequestMessage
 HttpRequestMessage <|-- HttpRequestMessageGenericT
 IHttpCommon <|-- IHttpResponseMessage
 IHttpResponseMessage <|-- HttpResponseMessage
 HttpResponseMessage <|-- HttpResponseMessageGenericT

 IMapAxiosToHttpRequestMessage <|-- MapAxiosToHttpRequestMessage
 IMapAxiosToHttpResponseMessage <|-- MapAxiosToHttpResponseMessage
 
``` 

```mermaid 
 classDiagram
      Animal <|-- Duck
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