# 🛍️ Product Variants Feature - BRANA KIDS Admin

## ✅ **Features Added:**

### **1. Product Variant Interface**
- **ProductVariant Type**: Defines variant structure with id, name, price, stock, sku, and attributes
- **Enhanced Product Type**: Added hasVariants, variants, and variantAttributes fields
- **Flexible Attributes**: Support for any attribute type (Size, Color, Material, etc.)

### **2. Variant Management Functions**
- **Add/Remove Attributes**: Create and manage variant attributes
- **Add/Remove Options**: Manage options for each attribute
- **Generate Variants**: Automatically create all combinations
- **Update Variants**: Edit individual variant prices and stock
- **SKU Generation**: Auto-generate SKUs for variants

### **3. Admin Form UI Components**
- **Variant Toggle**: Checkbox to enable/disable variants
- **Attribute Builder**: Dynamic form to create attributes and options
- **Variant Generator**: Button to create all combinations
- **Variant Editor**: Individual variant editing with price/stock controls
- **Visual Management**: Clean, organized interface for variant management

## 🎨 **UI Components:**

### **Variant Toggle:**
```jsx
<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="hasVariants"
    checked={!!formData.hasVariants}
    onChange={e => handleChange("hasVariants", e.target.checked)}
  />
  <Label htmlFor="hasVariants">This product has variants (e.g., Size, Color)</Label>
</div>
```

### **Attribute Builder:**
```jsx
{formData.variantAttributes?.map((attr, attrIndex) => (
  <div key={attrIndex} className="p-4 border rounded-lg bg-white">
    <div className="flex items-center gap-2 mb-3">
      <Input
        placeholder="Attribute name (e.g., Size, Color)"
        value={attr.name}
        onChange={(e) => updateVariantAttribute(attrIndex, 'name', e.target.value)}
        className="flex-1"
      />
      <Button onClick={() => removeVariantAttribute(attrIndex)}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
    {/* Options management */}
  </div>
))}
```

### **Variant Editor:**
```jsx
{formData.variants.map((variant) => (
  <div key={variant.id} className="p-4 border rounded-lg bg-white">
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
  </div>
))}
```

## 🔧 **Technical Implementation:**

### **Variant Generation Algorithm:**
```jsx
const generateVariants = () => {
  // Filter valid attributes
  const attributes = formData.variantAttributes.filter(attr => 
    attr.name.trim() && attr.options.length > 0 && attr.options.every(opt => opt.trim())
  )

  // Generate all combinations recursively
  const combinations: any[] = []
  const generateCombinations = (current: any, remaining: any[]) => {
    if (remaining.length === 0) {
      combinations.push(current)
      return
    }

    const [attr, ...rest] = remaining
    attr.options.forEach((option: string) => {
      generateCombinations({
        ...current,
        [attr.name]: option
      }, rest)
    })
  }

  generateCombinations({}, attributes)

  // Create variants from combinations
  const variants: ProductVariant[] = combinations.map((combo, index) => ({
    id: `variant-${Date.now()}-${index}`,
    name: Object.values(combo).join(" - "),
    price: formData.price || 0,
    stock: formData.stock || 0,
    sku: `${formData.name?.toLowerCase().replace(/\s+/g, '-')}-${Object.values(combo).join('-').toLowerCase()}`,
    attributes: combo
  }))
}
```

### **API Validation:**
```jsx
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
  }
}
```

## 🎯 **How to Use:**

### **1. Enable Variants:**
- Check "This product has variants" checkbox
- Variant management section appears

### **2. Create Attributes:**
- Click "Add Attribute" button
- Enter attribute name (e.g., "Size", "Color")
- Add options for each attribute (e.g., "Small", "Medium", "Large")

### **3. Generate Variants:**
- Click "Generate Variants" button
- System creates all combinations automatically
- Each variant gets unique name, SKU, and default price/stock

### **4. Edit Variants:**
- Modify individual variant prices and stock
- Update SKUs if needed
- Remove unwanted variants

### **5. Save Product:**
- Variants are saved with the product
- API validates variant data
- Product can have both base price and variant prices

## 📊 **Example Usage:**

### **T-Shirt Product:**
- **Attributes**: Size, Color
- **Size Options**: Small, Medium, Large, XL
- **Color Options**: Red, Blue, Green
- **Generated Variants**: 12 combinations
  - Small Red, Small Blue, Small Green
  - Medium Red, Medium Blue, Medium Green
  - Large Red, Large Blue, Large Green
  - XL Red, XL Blue, XL Green

### **Each Variant Has:**
- **Name**: "Small - Red"
- **SKU**: "t-shirt-small-red"
- **Price**: Individual price (e.g., Small = $15, Large = $18)
- **Stock**: Individual stock count
- **Attributes**: { Size: "Small", Color: "Red" }

## 🚀 **Benefits:**

### **For Admins:**
- **Easy Management**: Simple interface for complex products
- **Bulk Generation**: Create all combinations automatically
- **Individual Control**: Edit each variant separately
- **Flexible Pricing**: Different prices for different variants

### **For Customers:**
- **Clear Options**: Easy to understand product variations
- **Accurate Pricing**: See exact price for each variant
- **Stock Awareness**: Know which variants are available
- **Better Shopping**: More detailed product information

## 🔗 **Integration:**

### **Database Storage:**
- Variants stored as array in product document
- Each variant has unique ID and attributes
- Maintains referential integrity

### **Frontend Display:**
- Variants can be displayed in product pages
- Price ranges shown (e.g., "$15 - $25")
- Stock status per variant
- Variant selection interface

**The variant system is now ready for use in the admin panel!** 🎉

## 📝 **Next Steps:**
1. **Test the Admin Form**: Add products with variants
2. **Frontend Integration**: Display variants on product pages
3. **Cart Integration**: Handle variant selection in cart
4. **Order Management**: Track variant-specific orders

