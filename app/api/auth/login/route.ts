import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "alfred_session";

async function createSessionToken(password: string) {
  const data = new TextEncoder().encode(
    `alfred-private:${password}`
  );

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(
  request: NextRequest
) {
  try {
    const configuredPassword =
      process.env.ALFRED_PASSWORD;

    if (!configuredPassword) {
      return NextResponse.json(
        {
          error:
            "Alfred private access is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    const suppliedPassword =
      typeof body.password === "string"
        ? body.password
        : "";

    if (
      !suppliedPassword ||
      suppliedPassword !== configuredPassword
    ) {
      return NextResponse.json(
        {
          error: "Incorrect password.",
        },
        {
          status: 401,
        }
      );
    }

    const sessionToken =
      await createSessionToken(
        configuredPassword
      );

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error(
      "Alfred login error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong signing in.",
      },
      {
        status: 500,
      }
    );
  }
}
