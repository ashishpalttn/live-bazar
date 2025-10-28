const dynamoClient = require('../utils/dynamoClient');

const PRODUCT_SEARCH_TABLE = 'product-search';
const VENDOR_PRODUCT_TABLE = 'vendor-product_v2';

const generateSearchKeywords = (text) => {
    if (!text) return [];
    const words = text.toLowerCase().split(/\s+/);
    const keywords = new Set();
    
    // Add individual words
    words.forEach(word => {
        if (word.length >= 3) { // Only index words with 3 or more characters
            keywords.add(word);
        }
    });
    
    // Add combinations of words
    for (let i = 0; i < words.length - 1; i++) {
        keywords.add(words.slice(i, i + 2).join(' '));
    }
    
    return Array.from(keywords);
};

const indexProductForSearch = async (product, vendor_id) => {
    const keywords = generateSearchKeywords(product.product_name);
    if (product.brand_name) {
        keywords.push(...generateSearchKeywords(product.brand_name));
    }

    const operations = keywords.map(keyword => ({
        PutRequest: {
            Item: {
                keyword: keyword,
                product_id: product.product_id,
                product_name: product.product_name,
                brand_name: product.brand_name || '',
                vendor_ids: new Set([vendor_id]),  // Using Set to ensure unique vendor IDs
                updatedAt: new Date().toISOString()
            }
        }
    }));

    // DynamoDB BatchWrite has a limit of 25 items
    for (let i = 0; i < operations.length; i += 25) {
        const batch = operations.slice(i, i + 25);
        await dynamoClient.batchWrite({
            RequestItems: {
                [PRODUCT_SEARCH_TABLE]: batch
            }
        }).promise();
    }
};

const searchProducts = async (searchTerm, limit = 20) => {
    const keywords = generateSearchKeywords(searchTerm);
    const results = new Map(); // Use Map to deduplicate by product_id

    for (const keyword of keywords) {
        const params = {
            TableName: PRODUCT_SEARCH_TABLE,
            KeyConditionExpression: 'keyword = :keyword',
            ExpressionAttributeValues: {
                ':keyword': keyword
            },
            Limit: limit
        };

        const { Items } = await dynamoClient.query(params).promise();
        
        // Merge results, keeping track of how many keywords matched
        Items.forEach(item => {
            const existing = results.get(item.product_id) || { ...item, matchCount: 0 };
            existing.matchCount += 1;
            results.set(item.product_id, existing);
        });
    }

    // Convert to array and sort by matchCount (more matches = more relevant)
    const sortedResults = Array.from(results.values())
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, limit);

    // For each product, get the vendor-specific details
    const productsWithVendors = await Promise.all(
        sortedResults.map(async (product) => {
            const vendorProducts = await Promise.all(
                Array.from(product.vendor_ids).map(async (vendor_id) => {
                    const params = {
                        TableName: VENDOR_PRODUCT_TABLE,
                        Key: {
                            vendor_id,
                            product_id: product.product_id
                        }
                    };
                    const { Item } = await dynamoClient.get(params).promise();
                    return Item;
                })
            );

            return {
                ...product,
                vendors: vendorProducts.filter(Boolean) // Remove any null results
            };
        })
    );

    return {
        products: productsWithVendors,
        count: productsWithVendors.length
    };
};

module.exports = {
    indexProductForSearch,
    searchProducts
};