import chalk from "chalk";
import { forEach } from "p-iteration";
import { createClient, printGraphQLError, queryAll } from "./lib";
import { ProductVariantNode } from "./nodes";
import { PRODUCT_VARIANTS_QUERY } from "./queries";

export const sourceNodes = async (
  { actions: { createNode, touchNode }, createNodeId, store, cache },
  { shopName, accessToken, verbose = true }
) => {
  const client = createClient(shopName, accessToken);

  // Convenience function to namespace console messages.
  const formatMsg = msg =>
    chalk`\n{blue gatsby-source-shopify-admin/${shopName}} ${msg}`;

  try {
    console.log(formatMsg(`starting to fetch data from Shopify`));

    // Arguments used for file node creation.
    const imageArgs = { createNode, createNodeId, touchNode, store, cache };

    // Arguments used for node creation.
    const args = {
      client,
      createNode,
      createNodeId,
      formatMsg,
      verbose,
      imageArgs
    };

    // Message printed when fetching is complete.
    const msg = formatMsg(`finished fetching data from Shopify`);

    console.time(msg);
    await Promise.all([
      createNodes(
        `productVariants`,
        PRODUCT_VARIANTS_QUERY,
        ProductVariantNode,
        args
      )
    ]);
    console.timeEnd(msg);
  } catch (e) {
    console.error(chalk`\n{red error} an error occured while sourcing data`);

    // If not a GraphQL request error, let Gatsby print the error.
    if (!e.hasOwnProperty(`request`)) throw e;

    printGraphQLError(e);
  }
};

/**
 * Fetch and create nodes for the provided endpoint, query, and node factory.
 */
const createNodes = async (
  endpoint,
  query,
  nodeFactory,
  { client, createNode, formatMsg, verbose, imageArgs },
  f = async () => {}
) => {
  // Message printed when fetching is complete.
  const msg = formatMsg(`fetched and processed ${endpoint}`);

  if (verbose) console.time(msg);
  await forEach(await queryAll(client, [endpoint], query), async entity => {
    const node = await nodeFactory(imageArgs)(entity);
    createNode(node);
    await f(entity);
  });
  if (verbose) console.timeEnd(msg);
};
