import { randomBytes } from "node:crypto";

const ETag = randomBytes(16).toString("hex");

const index = Bun.file("./index.html");

const server = Bun.serve({
    port: process.env.PORT || 3000,
    hostname: "0.0.0.0",
    routes: {
        "/": {
            GET: (req) => {
                const ifNoneMatch = req.headers.get("If-None-Match");

                if (ifNoneMatch === ETag) {
                    return new Response("Not modified", {
                        status: 304,
                        headers: {
                            "Cache-Control":
                                "private, max-age=3600, must-revalidate",
                        },
                    });
                }

                return new Response(index, {
                    headers: {
                        ETag: ETag,
                        "Cache-Control":
                            "private, max-age=3600, must-revalidate",
                    },
                });
            },
        },
        "/api/random-number": {
            GET: () => {
                const number = Math.random();

                return new Response(JSON.stringify({ number }), {});
            },
        },
    },
    fetch() {
        return new Response("Not found");
    },
});

console.log(`Server is running on ${server.url}`);
