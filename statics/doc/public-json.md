# Public Json

## Create Json
  - method **POST**
  - route **/json**
  - body **Your Json**

## Get Json
  - method **GET**
  - route **/json/:id**
  - query 

    | Key         | Type        |
    | ----------- | ----------- |
    | schame      | string      |
 
## Update Json
  - method **PUT**
  - route **/json/:id**
  - body **Your Json**
  - query 

    | Key         | Type                                              |
    | ----------- | ------------------------------------------------- |
    | path        | string                                            |
    | schame      | string                                            |
    | action      | replace , assign , deep-assign , push , contact   |
 

