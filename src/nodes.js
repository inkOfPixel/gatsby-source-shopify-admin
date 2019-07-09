import createNodeHelpers from "gatsby-node-helpers";

// Node prefix
const TYPE_PREFIX = `ShopifyAdmin`;

// Node types
const PRODUCT_VARIANT = `ProductVariant`;
const COLLECTION = `Collection`;

const { createNodeFactory } = createNodeHelpers({
  typePrefix: TYPE_PREFIX
});

export const ProductVariantNode = () => createNodeFactory(PRODUCT_VARIANT);
export const CollectionNode = () => createNodeFactory(COLLECTION);
