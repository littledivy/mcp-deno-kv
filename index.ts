import { McpServer } from "npm:@modelcontextprotocol/sdk@1.8.0/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.8.0/server/stdio.js";
import { z } from "npm:zod@3.24.2";

const DENO_KV_PATH = Deno.args[0];

const kv = await Deno.openKv(DENO_KV_PATH);

const server = new McpServer({
  name: "denokv",
  version: "1.0.0",
});

server
  .tool("denokv_set", {
    key: z.array(z.string()).describe("The key to set in the key-value store"),
    value: z.any().describe("The value to set in the key-value store"),
  }, async ({ key, value }) => {
    await kv.set(key, value);
  });

server
  .tool("denokv_get", {
    key: z.array(z.string()).describe("The key to get from the key-value store"),
  }, async ({ key }) => {
    return await kv.get(key);
  });

server
  .tool("denokv_delete", {
    key: z.array(z.string()).describe("The key to delete from the key-value store"),
  }, async ({ key }) => {
    await kv.delete(key);
  });

const transport = new StdioServerTransport();
await server.connect(transport);
