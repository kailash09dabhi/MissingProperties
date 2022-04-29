import getMissingDataInfoWithPatchedObject from 'missingproperties'

// Example USAGE
export const response = {
  articles: {
    page: {
      details: {
          // description: 'This is description',
          totalChar: 199,
      },
    },
  },
  animals: [
    {
      name: 'Dogs',
      breeds: [
        { name: 'Doggy One', age: 10, location: 'panama' },
        { name: 'Doggy Two', age: 20, location: 'america' },
        { age: 30, location: 'cyprus' },
      ],
    },
    {
      name: 'Bird',
      breeds: [
        { age: 33, location: 'bulgaria' },
        { name: 'Bird One', age: 11, location: 'india' },
        { name: 'Bird Two', age: 22, location: 'japan' },
      ],
    },
  ],
  friends: [
    { user: '', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { age: 37, active: true },
  ],
}
console.log(
  JSON.stringify(
    getMissingDataInfoWithPatchedObject(response,[
      {path: 'animals[].breeds[].name',defaultValue:'INTELLIGENT ANIMAL',defaultValuePath:'animals[].breeds[].age',logKeyPath:'animals[].breeds[].location'},
      {path: 'articles.page.details.description',defaultValue:'INDIA',defaultValuePath:'articles.page.details.totalChar',logKeyPath:'articles.page.details.totalChar'},
    ])
  )
)