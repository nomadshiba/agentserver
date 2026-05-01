import { createOAIProviderClient } from "~/provider.ts";

const testClient = createOAIProviderClient({
    base: "https://ollama.com/v1",
    key: "3c8d277861cc45da83ebf6fffce99730.hJ73XtnPwVNQw8Z8XdPmoHQh",
});

testClient;
