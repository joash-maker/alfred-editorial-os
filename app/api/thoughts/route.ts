import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { content, category, title } = await req.json();

    if (!content) {
      return Response.json(
        { error: "No thought content provided." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("thoughts")
      .insert({
        title: title || null,
        category: category || "General",
        content,
        source: "alfred-dashboard",
        status: "raw",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      thought: data,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong saving the thought." },
      { status: 500 }
    );
  }
}
