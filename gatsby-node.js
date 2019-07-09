"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.sourceNodes = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _pIteration = require("p-iteration");

var _lib = require("./lib");

var _nodes = require("./nodes");

var _queries = require("./queries");

const sourceNodes = async ({
  actions: {
    createNode,
    touchNode
  },
  createNodeId,
  store,
  cache
}, {
  shopName,
  accessToken,
  verbose = true
}) => {
  const client = (0, _lib.createClient)(shopName, accessToken); // Convenience function to namespace console messages.

  const formatMsg = msg => _chalk.default`\n{blue gatsby-source-shopify-admin/${shopName}} ${msg}`;

  try {
    console.log(formatMsg(`starting to fetch data from Shopify`)); // Arguments used for file node creation.

    const imageArgs = {
      createNode,
      createNodeId,
      touchNode,
      store,
      cache
    }; // Arguments used for node creation.

    const args = {
      client,
      createNode,
      createNodeId,
      formatMsg,
      verbose,
      imageArgs
    }; // Message printed when fetching is complete.

    const msg = formatMsg(`finished fetching data from Shopify`);
    console.time(msg);
    await createNodes(`productVariants`, _queries.PRODUCT_VARIANTS_QUERY, _nodes.ProductVariantNode, args);
    await createNodes(`collections`, _queries.COLLECTIONS_QUERY, _nodes.CollectionNode, args);
    console.timeEnd(msg);
  } catch (e) {
    console.error(_chalk.default`\n{red error} an error occured while sourcing data`); // If not a GraphQL request error, let Gatsby print the error.

    if (!e.hasOwnProperty(`request`)) throw e;
    (0, _lib.printGraphQLError)(e);
  }
};
/**
 * Fetch and create nodes for the provided endpoint, query, and node factory.
 */


exports.sourceNodes = sourceNodes;

const createNodes = async (endpoint, query, nodeFactory, {
  client,
  createNode,
  formatMsg,
  verbose,
  imageArgs
}, f = async () => {}) => {
  // Message printed when fetching is complete.
  const msg = formatMsg(`fetched and processed ${endpoint}`);
  if (verbose) console.time(msg);
  await (0, _pIteration.forEach)((await (0, _lib.queryAll)(client, [endpoint], query)), async entity => {
    const node = await nodeFactory(imageArgs)(entity);
    createNode(node);
    await f(entity);
  });
  if (verbose) console.timeEnd(msg);
};