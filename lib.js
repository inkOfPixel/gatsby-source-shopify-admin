"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.queryAll = exports.queryOnce = exports.printGraphQLError = exports.createClient = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _graphqlRequest = require("graphql-request");

var _prettyjson = _interopRequireDefault(require("prettyjson"));

var _fp = require("lodash/fp");

/**
 * Create a Shopify Storefront GraphQL client for the provided name and token.
 */
const createClient = (shopName, accessToken) => new _graphqlRequest.GraphQLClient(`https://${shopName}.myshopify.com/admin/api/2019-04/graphql.json`, {
  headers: {
    "X-Shopify-Access-Token": accessToken
  }
});
/**
 * Print an error from a GraphQL client
 */


exports.createClient = createClient;

const printGraphQLError = e => {
  const prettyjsonOptions = {
    keysColor: `red`,
    dashColor: `red`
  };
  if (e.response && e.response.errors) console.error(_prettyjson.default.render(e.response.errors, prettyjsonOptions));
  if (e.request) console.error(_prettyjson.default.render(e.request, prettyjsonOptions));
};
/**
 * Request a query from a client.
 */


exports.printGraphQLError = printGraphQLError;

const queryOnce =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (client, query, first = 250, after) {
    return yield client.rawRequest(query, {
      first,
      after
    });
  });

  return function queryOnce(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Get all paginated data from a query. Will execute multiple requests as
 * needed.
 */


exports.queryOnce = queryOnce;

const queryAll =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (client, path, query, first = 250, after = null, aggregatedResponse = null) {
    const _ref3 = yield queryOnce(client, query, first, after),
          data = _ref3.data,
          extensions = _ref3.extensions;

    const edges = (0, _fp.get)([...path, `edges`], data);
    const nodes = edges.map(edge => Object.assign({}, edge.node, {
      id: Buffer.from(edge.node.id).toString("base64")
    }));
    aggregatedResponse = aggregatedResponse ? aggregatedResponse.concat(nodes) : nodes;

    if ((0, _fp.get)([...path, `pageInfo`, `hasNextPage`], data)) {
      if (extensions.cost.throttleStatus.currentlyAvailable < extensions.cost.requestedQueryCost) {
        yield sleep(1000 * extensions.cost.requestedQueryCost / 50);
      }

      return queryAll(client, path, query, first, (0, _fp.last)(edges).cursor, aggregatedResponse);
    }

    return aggregatedResponse;
  });

  return function queryAll(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.queryAll = queryAll;

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}