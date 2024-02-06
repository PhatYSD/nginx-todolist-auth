// Make limiter request per IP address, 100 requests per 15 minute

import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 100
});

export default limiter;