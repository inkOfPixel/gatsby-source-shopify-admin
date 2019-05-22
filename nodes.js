"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ProductVariantNode = void 0;

var _gatsbyNodeHelpers = _interopRequireDefault(require("gatsby-node-helpers"));

// Node prefix
const TYPE_PREFIX = `ShopifyAdmin`; // Node types

const PRODUCT_VARIANT = `ProductVariant`;

const _createNodeHelpers = (0, _gatsbyNodeHelpers.default)({
  typePrefix: TYPE_PREFIX
}),
      createNodeFactory = _createNodeHelpers.createNodeFactory;

const ProductVariantNode = () => createNodeFactory(PRODUCT_VARIANT);

exports.ProductVariantNode = ProductVariantNode;