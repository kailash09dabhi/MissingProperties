# MissingProperties

To install this package run command:

    npm run missingproperties
    
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

console.log(
  JSON.stringify(
    getAndUpdateMissingDataPropertyOfObjectWithDefaultValue(input, [
      { path: 'friends[0].user', defaultValue: 'Kailas', logPropertyPath: 'friends[0].age' },
      { path: 'animals[0].breeds[0].name', defaultValue: 'Animal', logPropertyPath: 'animals[0].breeds[0].age' },
      {
        path: 'articles.page.details.pageName',
        defaultValue: 'Default Page',
        logPropertyPath: 'articles.page.details.pageName',
      },
    ]),
  ),
)

Response would be like:

{
  "missingData": {
    "friends[0].user": [
      {
        "property": "user",
        "key": 36
      },
      {
        "property": "user",
        "key": 37
      }
    ],
    "animals[0].breeds[0].name": [
      {
        "property": "name",
        "key": 37
      }
    ],
    "articles.page.details.pageName": [
      {
        "property": "pageName"
      }
    ]
  },
  "objectCopy": {
    "articles": {
      "page": {
        "details": {
          "description": "This is description",
          "totalChar": 199,
          "pageName": "Default Page"
        }
      }
    },
    "animals": [
      {
        "name": "Dogs",
        "breeds": [
          {
            "name": "Doggy One",
            "age": 10,
            "active": true
          },
          {
            "name": "Doggy Two",
            "age": 20,
            "active": false
          },
          {
            "age": 37,
            "active": true,
            "id": 123,
            "name": "Animal"
          }
        ]
      },
      {
        "name": "Bird",
        "breeds": [
          {
            "name": "Bird One",
            "age": 10,
            "active": true
          },
          {
            "name": "Bird Two",
            "age": 20,
            "active": false
          },
          {
            "age": 247,
            "active": true
          }
        ]
      }
    ],
    "friends": [
      {
        "user": "Kailas",
        "age": 36,
        "active": true
      },
      {
        "user": "fred",
        "age": 40,
        "active": false
      },
      {
        "age": 37,
        "active": true,
        "user": "Kailas"
      }
    ]
  }
}


Method 'getAndUpdateMissingDataPropertyOfObjectWithDefaultValue' provides the missing properties array with information of missing properties 
so it can be loggable and also provides the response with defaultValue.

It accepts two parameter ie. 
1. input (json response)
2. array of object of required properties 
   a. path: of required property
   b. defaultValue: Replacable default value when the above required property is missing
   c. logPropertyPath: Property path which will help to identify the missing property for logging utilities

