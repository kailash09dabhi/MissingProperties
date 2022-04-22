import lodash from 'lodash'
const { get,set,isArray,isEmpty } = lodash

// const user = {
//   articles: {
//     page: {
//       details: {
//         description: 'This is description',
//         totalChar: 199,
//       },
//     },
//   },
//   animals: [
//     {
//       name: 'Dogs',
//       breeds: [
//         { name: 'Doggy One', age: 10, active: true },
//         { name: 'Doggy Two', age: 20, active: false },
//         { age: 37, active: true, id: 123 },
//       ],
//     },
//     {
//       name: 'Bird',
//       breeds: [
//         { name: 'Bird One', age: 10, active: true },
//         { name: 'Bird Two', age: 20, active: false },
//         { age: 247, active: true },
//       ],
//     },
//   ],
//   friends: [
//     { user: '', age: 36, active: true },
//     { user: 'fred', age: 40, active: false },
//     { age: 37, active: true },
//   ],
// }

const pathInfo = (object, path) => {
  const parentPath = path.substring(0, path.lastIndexOf('.'))
  const lastIndexOfDot = parentPath.lastIndexOf('.')
  const lastIndexOfArrayElement = parentPath.lastIndexOf('[0]')
  const lastIndex = Math.max(lastIndexOfDot, lastIndexOfArrayElement)
  const grandParentPath = parentPath.substring(0, lastIndex)
  const property = path.substring(path.lastIndexOf('.') + 1, path.length)
  const grandParent = get(object, grandParentPath)
  return { parentPath, grandParentPath, property, grandParent }
}
//1. missing property, if

const _getAndUpdateMissingDataPropertyOfObjectWithDefaultValue = (object, path, logPropertyPath, defaultValue) => {
  const missingData = []
  const propertyPathInfo = pathInfo(object, path)
  const logPropertyPathInfo = pathInfo(object, logPropertyPath)
  if (!propertyPathInfo.grandParent) {
    throw new Error('Provided path does not exist in json')
  }
  if (isArray(propertyPathInfo.grandParent)) {
    const isLogPropertyFromSameGrandParent =
      isArray(logPropertyPathInfo.grandParent) &&
      logPropertyPathInfo.grandParentPath === propertyPathInfo.grandParentPath
    const logPropertyValue = get(object, logPropertyPath)
    for (let i = 0; i < propertyPathInfo.grandParent.length; i++) {
      const parent = propertyPathInfo.grandParent[i]
      if (isEmpty(parent[propertyPathInfo.property])) {
        missingData.push({
          property: propertyPathInfo.property,
          key: isLogPropertyFromSameGrandParent ? parent[logPropertyPathInfo.property] : logPropertyValue,
        })
        set(object, `${propertyPathInfo.grandParentPath}[${i}].${propertyPathInfo.property}`, defaultValue)
      }
    }
  } else {
    if (isEmpty(get(object, path))) {
      missingData.push({
        property: propertyPathInfo.property,
        key: get(object, logPropertyPath),
      })
      set(object, path, defaultValue)
    }
  }
  return missingData
}
const getAndUpdateMissingDataPropertyOfObjectWithDefaultValue = (object, paths) => {
  const objectCopy = JSON.parse(JSON.stringify(object))
  const missingData = {}
  paths.forEach(
    pathInfo =>
      (missingData[pathInfo.path] = _getAndUpdateMissingDataPropertyOfObjectWithDefaultValue(
        objectCopy,
        pathInfo.path,
        pathInfo.logPropertyPath,
        pathInfo.defaultValue,
      )),
  )
  return { missingData, objectCopy }
}

export default getAndUpdateMissingDataPropertyOfObjectWithDefaultValue
// console.log(
//   JSON.stringify(
//     getAndUpdateMissingDataPropertyOfObjectWithDefaultValue(user, [
//       { path: 'friends[0].user', defaultValue: 'Kailas', logPropertyPath: 'friends[0].age' },
//       { path: 'animals[0].breeds[0].name', defaultValue: 'Animal', logPropertyPath: 'animals[0].breeds[0].age' },
//       {
//         path: 'articles.page.details.pageName',
//         defaultValue: 'Default Page',
//         logPropertyPath: 'articles.page.details.pageName',
//       },
//     ]),
//   ),
// )
