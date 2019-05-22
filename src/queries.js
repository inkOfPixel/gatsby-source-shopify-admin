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
