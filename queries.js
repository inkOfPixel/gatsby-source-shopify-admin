"use strict";

exports.__esModule = true;
exports.COLLECTIONS_QUERY = exports.PRODUCT_VARIANTS_QUERY = void 0;
const PRODUCT_VARIANTS_QUERY = `
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
exports.PRODUCT_VARIANTS_QUERY = PRODUCT_VARIANTS_QUERY;
const COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 50) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          handle
          sortOrder
        }
      }
    }
	}
`;
exports.COLLECTIONS_QUERY = COLLECTIONS_QUERY;