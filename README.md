# MissingProperties

__To install this package run command:__

    npm run missingproperties
    
__Sample json input__    

    const input = {
          articles: {
            page: {
              details: {
                description: 'This is description',
                totalChar: 199,
              },
            },
          },
          animals: [
            {
              name: 'Dogs',
              breeds: [
                { name: 'Doggy One', age: 10, active: true },
                { name: 'Doggy Two', age: 20, active: false },
                { age: 37, active: true, id: 123 },
              ],
            },
            {
              name: 'Bird',
              breeds: [
                { name: 'Bird One', age: 10, active: true },
                { name: 'Bird Two', age: 20, active: false },
                { age: 247, active: true },
              ],
            },
          ],
          friends: [
            { user: '', age: 36, active: true },
            { user: 'fred', age: 40, active: false },
            { age: 37, active: true },
          ],
        }

To identify the missing properties which is required to be present in response,

you can use run the below command:

    getMissingDataInfoWithPatchedObject(response,[
      {path: 'animals[].breeds[].name',defaultValue:'INTELLIGENT ANIMAL',defaultValuePath:'animals[].breeds[].age',logKeyPath:'animals[].breeds[].location'},
      {path: 'articles.page.details.description',defaultValue:'INDIA',defaultValuePath:'articles.page.details.totalChar',logKeyPath:'articles.page.details.totalChar'},
    ])

__Output will be:__
        {
          "patchedObject": {
            "articles": {
              "page": {
                "details": {
                  "totalChar": 199,
                  "description": "INDIA 199 "
                }
              }
            },
            "animals": [
              {
                "name": "Dogs",
                "breeds": []
              },
              {
                "name": "Bird",
                "breeds": [
                  {
                    "age": 33,
                    "location": "bulgaria",
                    "name": "INTELLIGENT ANIMAL 33 "
                  },
                  {
                    "name": "Bird One",
                    "age": 11,
                    "location": "india"
                  },
                  {
                    "name": "Bird Two",
                    "age": 22,
                    "location": "japan"
                  }
                ]
              }
            ],
            "friends": []
          },
          "missingData": {
            "animals[].breeds[].name": [
              {
                "missingPath": "animals[0].breeds"
              },
              {
                "missingPath": "animals[1].breeds[0].name",
                "missingValueIdentifier": "bulgaria"
              }
            ],
            "articles.page.details.description": [
              {
                "missingPath": "articles.page.details.description",
                "missingValueIdentifier": 199
              }
            ]
          }
        }


Method __getMissingDataInfoWithPatchedObject__ provides the missing properties array with information of missing properties 
so it can be loggable and also provides the response with defaultValue.

It accepts two parameter ie. 
1. input (json response)
2. array of object of required properties
   __a. path:__ 
        path of required property
   __b. defaultValue:__ 
        Replacable default value when the above required property is missing
   __c. defaultValuePath:__  Replacable combined value from defaultValuePath and defaultValue when the path is missing
   __d. logPropertyPath:__ 
        Property path which will help to identify the missing property for logging utilities


