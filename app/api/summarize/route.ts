import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    // 1. Check whether URL was provided
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "URL is required",
        },
        { status: 400 }
      );
    }

    // 2. Validate URL format
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid URL",
        },
        { status: 400 }
      );
    }

    // 3. Only allow HTTP and HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only HTTP and HTTPS URLs are allowed",
        },
        { status: 400 }
      );
    }
    // 3.5 Prevent requests to local/private network addresses
const hostname = parsedUrl.hostname.toLowerCase();

const blockedHostnames = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
];

if (
  blockedHostnames.includes(hostname) ||
  hostname.endsWith(".local") ||
  hostname.endsWith(".internal")
) {
  return NextResponse.json(
    {
      success: false,
      error: "Local and internal URLs are not allowed",
    },
    { status: 400 }
  );
}

    // 4. Fetch the webpage
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    // 5. Check HTTP response
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Unable to fetch webpage. Status: ${response.status}`,
        },
        { status: 400 }
      );
    }

    // 6. Get HTML
    const html = await response.text();

    // 7. Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // 8. Remove unnecessary elements
    $("script, style, noscript, svg, iframe").remove();

    // 9. Extract title
    const title = $("title").text().trim();

    // 10. Extract visible text
    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // 11. Check whether text was extracted
    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract readable text from this webpage",
        },
        { status: 400 }
      );
    }

    // 12. Limit text length
    const cleanedText = text.slice(0, 30000);

    // 13. Generate AI summary using Groq
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are an expert web page summarizer. Create concise, accurate summaries based only on the provided webpage content.",
        },
        {
          role: "user",
          content: `Summarize the following webpage in 5 to 8 concise bullet points.

Focus on:
- The main topic
- Important facts
- Key ideas
- Important conclusions

Do not invent information that is not present in the webpage.

Webpage title:
${title || "Untitled Page"}

Webpage content:
${cleanedText}`,
        },
      ],
      temperature: 0.3,
    });

    // 14. Extract summary
    const summary = completion.choices[0]?.message?.content?.trim();

    // 15. Check whether AI generated a summary
    if (!summary) {
      return NextResponse.json(
        {
          success: false,
          error: "AI could not generate a summary",
        },
        { status: 500 }
      );
    }

    // 16. Return final response
    return NextResponse.json({
      success: true,
      title: title || "Untitled Page",
      summary,
    });
  } catch (error) {
    console.error("Scraping error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch or process the webpage",
      },
      { status: 500 }
    );
  }
}