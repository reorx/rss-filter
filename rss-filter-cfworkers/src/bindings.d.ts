// https://github.com/cloudflare/workers-types#using-bindings
export {}

declare global {
  const MY_ENV_VAR: string;
  const MY_SECRET: string;
  const MY_KV: KVNamespace;
}
