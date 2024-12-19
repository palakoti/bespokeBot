const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
console.log(process.env.OPENAI_API_KEY);
// endpoint
app.post("/bespokeBot", async (req, res) => {
    try {
        const userInput = req.body.message;

        if (!userInput) {
            return res.status(400).json({ error: "Message is required." });
        }

        // Call to Open AI API
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const botReply = response.data.choices[0].message.content;

        // Send AI response to the user
        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: "Request processing error"+error });
    }
});

// Test endpoint
app.get("/", (req, res) => {
    res.send("bespoke Bot is active");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Running server on http://localhost:${PORT}`);
});
