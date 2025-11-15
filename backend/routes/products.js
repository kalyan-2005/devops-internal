import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description || '',
      price: req.body.price,
      category: req.body.category || 'Uncategorized',
      stock: req.body.stock || 0,
      imageUrl: req.body.imageUrl || ''
    })
    const saved = await product.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updates = {}
    if (req.body.name !== undefined) updates.name = req.body.name
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.price !== undefined) updates.price = req.body.price
    if (req.body.category !== undefined) updates.category = req.body.category
    if (req.body.stock !== undefined) updates.stock = req.body.stock
    if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl
    updates.updatedAt = Date.now()

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router

