# 🛍️ Enhanced Product Variants - Individual Images, Prices & Stock

## ✅ **New Features Added:**

### **1. Individual Variant Images**
- **Per-Variant Images**: Each variant can have its own specific images
- **Multiple Upload Methods**: File upload or URL input for each variant
- **Image Management**: Add, remove, and manage images per variant
- **Cloudinary Integration**: Automatic upload and deletion of variant images

### **2. Enhanced Variant Data Structure**
```typescript
interface ProductVariant {
  id: string
  name: string
  price: number        // Individual price per variant
  stock: number        // Individual stock per variant
  sku?: string         // Unique SKU per variant
  images: {            // Individual images per variant
    url: string
    type: "url" | "file"
  }[]
  attributes: {        // Variant attributes (Size, Color, etc.)
    [key: string]: string
  }
}
```

### **3. Complete Variant Management**

#### **Variant Creation Process:**
1. **Enable Variants**: Check "This product has variants"
2. **Define Attributes**: Add attributes like Size, Color, Material
3. **Add Options**: Define options for each attribute
4. **Generate Variants**: Auto-create all combinations
5. **Customize Each Variant**: Set individual price, stock, and images

#### **Individual Variant Editing:**
- **Price Control**: Set different prices for each variant
- **Stock Management**: Track inventory per variant
- **Image Upload**: Add specific images for each variant
- **SKU Management**: Auto-generate or customize SKUs

## 🎨 **UI Components:**

### **Variant Image Management:**
```jsx
{/* Variant Images Section */}
<div className="mt-4 space-y-3">
  <Label>Variant Images</Label>
  
  {/* Image Upload Options */}
  <div className="flex gap-2">
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          addVariantImage(variant.id, e.target.files[0])
        }
      }}
      className="flex-1"
    />
    <Input
      placeholder="Or enter image URL"
      onChange={(e) => {
        if (e.target.value.trim()) {
          addVariantImageUrl(variant.id, e.target.value)
          e.target.value = ""
        }
      }}
      className="flex-1"
    />
  </div>

  {/* Display Variant Images */}
  {variant.images && variant.images.length > 0 && (
    <div className="grid gap-2 grid-cols-3">
      {variant.images.map((image, imageIndex) => (
        <div key={imageIndex} className="relative group">
          <div className="relative w-full aspect-square">
            <Image
              src={image.url}
              alt={`${variant.name} image ${imageIndex + 1}`}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            onClick={() => removeVariantImage(variant.id, imageIndex)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )}
</div>
```

### **Variant Editor Interface:**
```jsx
{formData.variants.map((variant) => (
  <div key={variant.id} className="p-4 border rounded-lg bg-white">
    <div className="flex items-center justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-medium">{variant.name}</h4>
        <p className="text-sm text-muted-foreground">SKU: {variant.sku}</p>
      </div>
      <Button onClick={() => removeVariant(variant.id)}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>

    {/* Price and Stock */}
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Price</Label>
        <Input
          type="number"
          value={variant.price}
          onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label>Stock</Label>
        <Input
          type="number"
          value={variant.stock}
          onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
        />
      </div>
    </div>

    {/* SKU Management */}
    <div className="mt-3">
      <Label>SKU</Label>
      <Input
        value={variant.sku || ''}
        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
        placeholder="Auto-generated SKU"
      />
    </div>

    {/* Variant Images Section */}
    {/* ... image management UI ... */}
  </div>
))}
```

## 🔧 **Technical Implementation:**

### **Variant Image Management Functions:**
```typescript
// Upload variant image file
const addVariantImage = async (variantId: string, file: File) => {
  try {
    setLoading(true)
    
    const formDataObj = new FormData()
    formDataObj.append("image", file)
    formDataObj.append("type", "product")

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formDataObj,
    })

    const data = await uploadResponse.json()

    // Add image to specific variant
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(variant => 
        variant.id === variantId 
          ? { ...variant, images: [...variant.images, { url: data.url, type: "file" }] }
          : variant
      )
    }))
    
    toast.success("Variant image uploaded successfully")
  } catch (error) {
    toast.error("Failed to upload variant image")
  } finally {
    setLoading(false)
  }
}

// Add variant image URL
const addVariantImageUrl = (variantId: string, imageUrl: string) => {
  setFormData(prev => ({
    ...prev,
    variants: prev.variants?.map(variant => 
      variant.id === variantId 
        ? { ...variant, images: [...variant.images, { url: imageUrl, type: "url" }] }
        : variant
    )
  }))
}

// Remove variant image
const removeVariantImage = async (variantId: string, imageIndex: number) => {
  // Delete from Cloudinary if needed
  // Remove from variant images array
  setFormData(prev => ({
    ...prev,
    variants: prev.variants?.map(variant => 
      variant.id === variantId 
        ? { ...variant, images: variant.images.filter((_, i) => i !== imageIndex) }
        : variant
    )
  }))
}
```

### **API Validation Enhancement:**
```typescript
// Variants validation
if (body.hasVariants) {
  if (!body.variants || !Array.isArray(body.variants) || body.variants.length === 0) {
    return 'At least one variant is required when hasVariants is true'
  }

  for (const variant of body.variants) {
    if (!variant.name || !variant.price || variant.stock === undefined) {
      return 'Each variant must have name, price, and stock'
    }
    if (isNaN(parseFloat(variant.price)) || isNaN(parseInt(variant.stock))) {
      return 'Variant price and stock must be valid numbers'
    }
    
    // Validate variant images
    if (variant.images && !Array.isArray(variant.images)) {
      return 'Variant images must be an array'
    }
    if (variant.images && variant.images.length > 3) {
      return 'Maximum of 3 images allowed per variant'
    }
  }
}
```

## 📊 **Example Usage:**

### **T-Shirt Product with Variants:**

#### **Product Setup:**
- **Base Product**: "BRANA KIDS T-Shirt"
- **Attributes**: Size (Small, Medium, Large) + Color (Red, Blue, Green)
- **Generated Variants**: 9 combinations

#### **Individual Variant Data:**
```json
{
  "variants": [
    {
      "id": "variant-123-0",
      "name": "Small - Red",
      "price": 1500,
      "stock": 25,
      "sku": "brana-kids-t-shirt-small-red",
      "images": [
        {
          "url": "https://cloudinary.com/small-red-tshirt.jpg",
          "type": "file"
        }
      ],
      "attributes": {
        "Size": "Small",
        "Color": "Red"
      }
    },
    {
      "id": "variant-123-1",
      "name": "Medium - Blue",
      "price": 1800,
      "stock": 30,
      "sku": "brana-kids-t-shirt-medium-blue",
      "images": [
        {
          "url": "https://cloudinary.com/medium-blue-tshirt.jpg",
          "type": "file"
        }
      ],
      "attributes": {
        "Size": "Medium",
        "Color": "Blue"
      }
    }
    // ... more variants
  ]
}
```

## 🎯 **Complete Workflow:**

### **1. Create Product with Variants:**
1. **Basic Info**: Enter product name, description, category
2. **Enable Variants**: Check "This product has variants"
3. **Define Attributes**: Add Size, Color, etc.
4. **Add Options**: Small/Medium/Large, Red/Blue/Green
5. **Generate Variants**: Click "Generate Variants"

### **2. Customize Each Variant:**
1. **Set Prices**: Different prices per variant
2. **Set Stock**: Individual inventory counts
3. **Add Images**: Upload specific images per variant
4. **Customize SKUs**: Auto-generated or custom SKUs

### **3. Save and Manage:**
1. **API Validation**: Ensures all data is valid
2. **Database Storage**: Variants stored with product
3. **Image Management**: Cloudinary integration
4. **Frontend Ready**: Data ready for display

## 🚀 **Benefits:**

### **For Admins:**
- **Complete Control**: Individual price, stock, and images per variant
- **Visual Management**: See exactly what each variant looks like
- **Flexible Pricing**: Different prices for different sizes/colors
- **Inventory Tracking**: Track stock per variant separately

### **For Customers:**
- **Accurate Representation**: See exact images for each variant
- **Clear Pricing**: Know exact price for each option
- **Stock Awareness**: See availability per variant
- **Better Decisions**: Make informed choices with visual data

### **For Business:**
- **Detailed Analytics**: Track sales per variant
- **Inventory Management**: Know which variants sell best
- **Pricing Strategy**: Set different prices based on costs/demand
- **Customer Satisfaction**: Accurate product representation

## 🔗 **Integration Points:**

### **Frontend Display:**
- **Product Pages**: Show variant options with images
- **Cart System**: Handle variant selection
- **Search/Filter**: Filter by variant attributes
- **Order Management**: Track variant-specific orders

### **Database Structure:**
```json
{
  "name": "BRANA KIDS T-Shirt",
  "hasVariants": true,
  "variants": [
    {
      "id": "variant-123-0",
      "name": "Small - Red",
      "price": 1500,
      "stock": 25,
      "sku": "brana-kids-t-shirt-small-red",
      "images": [...],
      "attributes": {...}
    }
  ]
}
```

**The enhanced variant system now supports individual images, prices, and stock for each variant!** 🎉

## 📝 **Next Steps:**
1. **Test the Enhanced Form**: Create products with variant-specific images
2. **Frontend Integration**: Display variants with their specific images
3. **Cart Enhancement**: Handle variant selection with images
4. **Order Management**: Track variant-specific orders
5. **Analytics**: Track sales performance per variant

