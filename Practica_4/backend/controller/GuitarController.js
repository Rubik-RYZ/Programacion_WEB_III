import GuitarModel from "../model/guitarModel.js"

export const getAll = async (req, res) => {
    try{
        const guitars = await GuitarModel.getAll()
        res.status(200).json(guitars)
    }catch(error){
        res.status(500).json({message:'Error al obtener guitars',error:error.message})
    }
}

export const create = async(req,res)=>{
    try{
        const {name, price, stock} = req.body
        const newGuitar=await GuitarModel.create([name, price, stock])
        res.status(201).json({id:newGuitar,message:'GuitarModel creado'})
    }catch(error){
        res.status(500).json({message:'Error al cargar el GuitarModel',error:error.message})
    }
}
export const update = async(req,res)=>{
    try{
        const {id}=req.params
        const buscar=await GuitarModel.getById(id)
        if(!buscar) return res.status(404).json({message:'GuitarModel no encontrado'})
        const {name, price, stock} = req.body
        await GuitarModel.update({
            id,
            input: [name, price, stock]
          })
        res.status(200).json({message:'GuitarModel actualizado correctamente'})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Error al actualizar el GuitarModel',error:error.message})
    }
}
export const deleteGuitar = async(req, res) => {
    try{
        const {id}=req.params
        const buscar=await GuitarModel.getById(id)
        if(!buscar) return res.status(404).json({message:'GuitarModel no encontrado'})
        await GuitarModel.delete(id)
        res.status(200).json({message:'GuitarModel eliminado correctamente'})

    }catch(error){
        console.error(error)
        res.status(500).json({message:'Error al eliminar el GuitarModel',error:error.message})
    } 
}