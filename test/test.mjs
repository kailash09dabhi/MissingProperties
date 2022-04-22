import getAndUpdateMissingDataPropertyOfObjectWithDefaultValue from 'missingproperties'

const user = {
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

console.log(
  JSON.stringify(
    getAndUpdateMissingDataPropertyOfObjectWithDefaultValue(user, [
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
