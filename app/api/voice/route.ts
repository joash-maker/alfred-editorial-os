import { NextRequest } from "next/server";

const DEFAULT_VOICE_ID =
  "7JxUWWyYwXK8kmqmKEnT";

export async function POST(
  request: NextRequest
) {
  try {
    const apiKey =
      process.env.ELEVENLABS_API_KEY;

    const voiceId =
      process.env.ELEVENLABS_VOICE_ID ||
      DEFAULT_VOICE_ID;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "ELEVENLABS_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";

    if (!text) {
      return Response.json(
        {
          error:
            "Text is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (text.length > 5000) {
      return Response.json(
        {
          error:
            "Alfred's spoken response is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type":
            "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id:
            "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.78,
            style: 0,
            use_speaker_boost: true,
            speed: 0.96,
          },
        }),
      }
    );

    if (!response.ok) {
      const details =
        await response.text();

      console.error(
        "ElevenLabs voice error:",
        response.status,
        details
      );

      return Response.json(
        {
          error:
            "Alfred's natural voice could not be generated.",
        },
        {
          status: 502,
        }
      );
    }

    const audio =
      await response.arrayBuffer();

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type":
          "audio/mpeg",
        "Cache-Control":
          "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Alfred natural voice error:",
      error
    );

    return Response.json(
      {
        error:
          "Something went wrong generating Alfred's natural voice.",
      },
      {
        status: 500,
      }
    );
  }
}
