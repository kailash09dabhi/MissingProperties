import lodash from 'lodash'
const { get,set,isArray,isEmpty } = lodash

const pathInfo = ( path) => {
  const parentPath = path.substring(0, path.lastIndexOf('.'))
  const lastIndexOfDot = parentPath.lastIndexOf('.')
  const grandParentPath = parentPath.substring(0, lastIndexOfDot)
  const property = path.substring(path.lastIndexOf('.') + 1, path.length)
  const isArray = path.endsWith('[]')
  return { parentPath, grandParentPath, property, isArray }
}

const getPathElements = path => {
  const splits = path.split('.')
  const elements = splits.map(it => {
    const isArray = it.endsWith('[]')
    return { name: isArray ? it.substring(0, it.lastIndexOf('[]')) : it, isArray: it.endsWith('[]') }
  })
  return elements
}

// recursively go through object and to get missing data and to patch object with default value
const getMissingDataInfo = ({object, elements, path, defaultValue,defaultValuePath,logKeyPath,missingData})=>{
  const firstElement = elements[0]
  let newPath
  if(path === ''){
    newPath = firstElement.name
  }else{
    newPath = `${path}.${firstElement.name}`
  }
  const data = get(object,newPath)

  if(elements.length === 1){ 
    // traversal done
    if(!data) {
      const defaultValueFromPath =get(object,`${pathInfo(newPath).parentPath}.${pathInfo(defaultValuePath).property}`)
      set(object,newPath,isEmpty(defaultValuePath) ?defaultValue:`${defaultValue} ${defaultValueFromPath} `)
      return {missingPath: newPath,missingValueIdentifier:get(object,`${pathInfo(newPath).parentPath}.${pathInfo(logKeyPath).property}`)}
    }
    return { missingPath: "" }
  }
  // traversal in progress
  if(!data) {
    set(object, newPath, firstElement.isArray ? [] : {})
    return { missingPath:newPath }
  }

  if(isArray(data)){
    if(data.length === 0){
      return { missingPath:newPath }
    }
    for (let i = 0; i < data.length; i++) {
      const missingChildData = getMissingDataInfo({object,elements: elements.slice(1,elements.length),path: `${newPath}[${i}]`, defaultValue,defaultValuePath,logKeyPath,missingData}) 
      if(!isEmpty(missingChildData)&& !isEmpty(missingChildData.missingPath)){
         missingData.push(missingChildData)
      }  
    }
  }else{
    return getMissingDataInfo({object,elements: elements.slice(1,elements.length), path:`${newPath}`, defaultValue,defaultValuePath,logKeyPath,missingData}) 
  }
}

export const findMissingData = ({object, path,defaultValue, defaultValuePath, logKeyPath})=>{
  const elements =getPathElements(path)
  const missingData =[]
  const missingDataInfo = getMissingDataInfo({object, elements, path:'', defaultValue, defaultValuePath, logKeyPath, missingData})
  if(!isEmpty(missingDataInfo) && !isEmpty(missingDataInfo.missingPath))
  missingData.push(missingDataInfo)
  return missingData
}

const getMissingDataInfoWithPatchedObject = (object, paths) => {
  let patchedObject = {}
  if (object !== null && object !== undefined) patchedObject = JSON.parse(JSON.stringify(object))
  const missingData = {}
  paths.forEach(
    pathInfo =>
      (missingData[pathInfo.path] = 
        findMissingData({object:patchedObject,path: pathInfo.path,defaultValue:pathInfo.defaultValue,defaultValuePath:pathInfo.defaultValuePath,logKeyPath:pathInfo.logKeyPath})
       ),
  )
  return { missingData, patchedObject }
}

export default getMissingDataInfoWithPatchedObject

// Example USAGE
export const response = {
  // articles: {
  //   // page: {
  //   //   details: {
  //   //       // description: 'This is description',
  //   //       totalChar: 199,
  //   //   },
  //   // },
  // },
  animals: [
    {
      name: 'Dogs',
      breeds: [
        // { name: 'Doggy One', age: 10, location: 'panama' },
        // { name: 'Doggy Two', age: 20, location: 'america' },
        // { age: 30, location: 'cyprus' },
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
    // { user: '', age: 36, active: true },
    // { user: 'fred', age: 40, active: false },
    // { age: 37, active: true },
  ],
}

console.log(JSON.stringify(getMissingDataInfoWithPatchedObject(response,[
  {path: 'animals[].breeds[].name',defaultValue:'INTELLIGENT ANIMAL',defaultValuePath:'animals[].breeds[].age',logKeyPath:'animals[].breeds[].location'},
  {path: 'articles.page.details.description',defaultValue:'INDIA',defaultValuePath:'articles.page.details.totalChar',logKeyPath:'articles.page.details.totalChar'},
])))