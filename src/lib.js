import { GraphQLClient } from "graphql-request";
import prettyjson from "prettyjson";
import { get, last } from "lodash/fp";

/**
 * Create a Shopify Storefront GraphQL client for the provided name and token.
 */
export const createClient = (shopName, accessToken) =>
  new GraphQLClient(
    `https://${shopName}.myshopify.com/admin/api/2019-04/graphql.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "X-GraphQL-Cost-Include-Fields": true
      }
    }
  );

/**
 * Print an error from a GraphQL client
 */
export const printGraphQLError = e => {
  const prettyjsonOptions = { keysColor: `red`, dashColor: `red` };

  if (e.response && e.response.errors)
    console.error(prettyjson.render(e.response.errors, prettyjsonOptions));

  if (e.request) console.error(prettyjson.render(e.request, prettyjsonOptions));
};

/**
 * Request a query from a client.
 */
export const queryOnce = async (client, query, first = 250, after) =>
  await client.rawRequest(query, { first, after });

/**
 * Get all paginated data from a query. Will execute multiple requests as
 * needed.
 */
export const queryAll = async (
  client,
  path,
  query,
  first = 250,
  after = null,
  aggregatedResponse = null
) => {
  try {
    const { data } = await queryOnce(client, query, first, after);

    const edges = get([...path, `edges`], data);
    const nodes = edges.map(edge => ({
      ...edge.node,
      id: Buffer.from(edge.node.id).toString("base64")
    }));

    aggregatedResponse = aggregatedResponse
      ? aggregatedResponse.concat(nodes)
      : nodes;

    if (get([...path, `pageInfo`, `hasNextPage`], data)) {
      return queryAll(
        client,
        path,
        query,
        first,
        last(edges).cursor,
        aggregatedResponse
      );
    }

    return aggregatedResponse;
  } catch (e) {
    if (
      e.response.extensions.cost.throttleStatus.currentlyAvailable <
      e.response.extensions.cost.requestedQueryCost
    ) {
      await sleep((1000 * e.response.extensions.cost.requestedQueryCost) / 50);
      return queryAll(client, path, query, first, after, aggregatedResponse);
    }
    return aggregatedResponse;
  }
};

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
