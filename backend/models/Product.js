import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'Uncategorized' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const Product = mongoose.model('Product', productSchema)

export default Product

