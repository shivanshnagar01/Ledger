export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { prompt } = req.body;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },

                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    input: prompt,
                    max_output_tokens: 300
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: result.error
            });
        }

        const message = result.output?.find(
            item => item.type === "message"
        );

        const text = message?.content?.find(
            item => item.type === "output_text"
        )?.text;

        return res.status(200).json({
            answer: text || ""
        });

    } catch (error) {

        return res.status(500).json({
            error: "AI request failed"
        });
    }
}