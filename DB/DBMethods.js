
//find
export const find = async({model,filter={},select="",populate=[],skip=0,limit=10}={})=>{
    const result = await model.find(filter)
    .limit(limit).skip(skip).select(select).populate(populate)
    return result
}
export const findOne = async({model,filter={},select="",populate=[]}={})=>{
    const result = await model.findOne(filter)
    .select(select).populate(populate)
    return result
}



export const findById = async ({model,filter={},select="",populate=[]}={})=>{
    const result = await model.findById(filter).select(select).populate(populate)
    return result
}

 //create
export const createAndSave = async (model,options={})=>{
    const newObj = new model(options)
    const saveObj = await newObj.save()
    return saveObj
}

export const insertMany = async (model,data=[])=>{
    const result = await model.insertMany(data)
    return result
}

export const create = async({model,data={}}={})=>{
    const result = await model.create(data)
    return result
}

//update
 export const updateOne = async({model,filter={},data={}={}}={})=>{
    const result = await model.updateOne(filter,data)
    return result

 }


export const findOneAndUpdate = async({model,filter={},data={},options={},select="",populate=[]}={})=>{
    const result = await model.findOneAndUpdate(filter,data,options)
    .select(select).populate(populate)
    return result
}

export const findByIdAndUpdate = async({model,filter={},data={},options={},select="",populate=[]}={})=>{
    const result = await model.findByIdAndUpdate(filter,data,options)
   .select(select).populate(populate)
    return result
}

//delete

export const deleteOne = async (model,filter={})=>{
    const result = await model.deleteOne(filter)
    return result
}

export const findOneAndDelete = async(model,filter={},select="",populate=[])=>{
    const result = await model.findOneAndDelete(filter).select(select).populate(populate)
    return result
}

export const findByIdAndDelete = async(model,filter={},select="",populate=[])=>{
    const result = await model.findByIdAndDelete(filter).select(select).populate(populate)
    return result
}

