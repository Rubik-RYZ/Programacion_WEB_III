import { Router } from 'express'
import { create, deleteGuitar, getAll, update } from '../controller/guitarController.js'
const guitarsRouter = Router()
guitarsRouter.get('/', getAll)
guitarsRouter.post('/',create)
guitarsRouter.put('/:id', update)
guitarsRouter.delete ('/:id', deleteGuitar)

export default guitarsRouter