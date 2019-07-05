export const PRODUCT_VARIANTS_QUERY = `
  query GetProductVariants($first: Int!, $after: String) {
    productVariants(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          barcode
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 50) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          sortOrder
        }
      }
    }
	}
`;
