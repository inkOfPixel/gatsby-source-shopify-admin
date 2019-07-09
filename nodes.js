"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CollectionNode = exports.ProductVariantNode = void 0;

var _gatsbyNodeHelpers = _interopRequireDefault(require("gatsby-node-helpers"));

// Node prefix
const TYPE_PREFIX = `ShopifyAdmin`; // Node types

const PRODUCT_VARIANT = `ProductVariant`;
const COLLECTION = `Collection`;
const {
  createNodeFactory
} = (0, _gatsbyNodeHelpers.default)({
  typePrefix: TYPE_PREFIX
});

const ProductVariantNode = () => createNodeFactory(PRODUCT_VARIANT);

exports.ProductVariantNode = ProductVariantNode;

const CollectionNode = () => createNodeFactory(COLLECTION);

exports.CollectionNode = CollectionNode;