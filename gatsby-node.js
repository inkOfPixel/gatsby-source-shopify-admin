"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.sourceNodes = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chalk = _interopRequireDefault(require("chalk"));

var _pIteration = require("p-iteration");

var _lib = require("./lib");

var _nodes = require("./nodes");

var _queries = require("./queries");

const sourceNodes =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* ({
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
  }) {
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
      yield Promise.all([createNodes(`productVariants`, _queries.PRODUCT_VARIANTS_QUERY, _nodes.ProductVariantNode, args)]);
      console.timeEnd(msg);
    } catch (e) {
      console.error(_chalk.default`\n{red error} an error occured while sourcing data`); // If not a GraphQL request error, let Gatsby print the error.

      if (!e.hasOwnProperty(`request`)) throw e;
      (0, _lib.printGraphQLError)(e);
    }
  });

  return function sourceNodes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Fetch and create nodes for the provided endpoint, query, and node factory.
 */


exports.sourceNodes = sourceNodes;

const createNodes =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (endpoint, query, nodeFactory, {
    client,
    createNode,
    formatMsg,
    verbose,
    imageArgs
  }, f =
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(function* () {})) {
    // Message printed when fetching is complete.
    const msg = formatMsg(`fetched and processed ${endpoint}`);
    if (verbose) console.time(msg);
    yield (0, _pIteration.forEach)((yield (0, _lib.queryAll)(client, [endpoint], query)),
    /*#__PURE__*/
    function () {
      var _ref4 = (0, _asyncToGenerator2.default)(function* (entity) {
        const node = yield nodeFactory(imageArgs)(entity);
        createNode(node);
        yield f(entity);
      });

      return function (_x7) {
        return _ref4.apply(this, arguments);
      };
    }());
    if (verbose) console.timeEnd(msg);
  });

  return function createNodes(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();