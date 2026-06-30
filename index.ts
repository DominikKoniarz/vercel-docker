import index from "./index.html";

const server = Bun.serve({
    port: process.env.PORT || 3000,
    hostname: "0.0.0.0",
    routes: {
        "/": index,
        "/api/random-number": {
            GET: () => {
                return new Response(JSON.stringify({ number: Math.random() }));
            },
        },
    },
    fetch() {
        return new Response("Not found");
    },
});

console.log(`Server is running on ${server.url}`);
