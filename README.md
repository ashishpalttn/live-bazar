# live-bazar
npm install
npm run start:offline

## Testing Products V2 API Endpoints

### Create a New Product (POST)
```bash
curl -X POST http://localhost:3000/product-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "product_Name": "Sample Product",
    "description": "This is a sample product description",
    "brand_Name": "Sample Brand",
    "image_url": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "mrp": 999.99,
    "is_verified": false,
    "unit": "pieces"
  }'
```

### Get All Products (GET)
```bash
curl -X GET http://localhost:3000/products-v2
```

### Get Product by ID (GET)
```bash
curl -X GET http://localhost:3000/product-v2/{product_id}
# Replace {product_id} with an actual product ID
```

### Update Product (PATCH)
```bash
curl -X PATCH http://localhost:3000/product-v2/{product_id} \
  -H "Content-Type: application/json" \
  -d '{
    "product_Name": "Updated Product Name",
    "mrp": 1299.99,
    "is_verified": true
  }'
# Replace {product_id} with an actual product ID
```

### Delete Product (DELETE)
```bash
curl -X DELETE http://localhost:3000/product-v2/{product_id}
# Replace {product_id} with an actual product ID
```

Note: Before testing, make sure to:
1. Run `npm install` to install dependencies
2. Start the local server using `npm run start:offline`
3. The server will be running at `http://localhost:3000`