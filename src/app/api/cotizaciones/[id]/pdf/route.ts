import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import QuotePdfDocument from "@/lib/pdf/QuotePdf";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  if (!quote) {
    return new NextResponse("Cotización no encontrada", { status: 404 });
  }

  const { data: items } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", params.id)
    .order("sort_order");

  const document = createElement(QuotePdfDocument, {
    quote,
    client: quote.clients,
    items: items ?? [],
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(document);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.quote_number}.pdf"`,
    },
  });
}
