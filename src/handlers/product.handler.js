module.exports.createProduct = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Product created successfully' }),
  };
};

module.exports.getProduct = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Product retrieved successfully' }),
  };
};
