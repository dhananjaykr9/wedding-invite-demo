import { NextResponse } from "next/server";

const GOOGLE_SHEET_URL =
    "https://script.google.com/macros/s/AKfycby96nNEBj0j3dv-2EFMsGe_MbzHkLTJWnvVwpmNGFXsdVPEjVMEMY6dqpADV5sMqXua/exec";

export async function GET() {
    try {
        const res = await fetch(`${GOOGLE_SHEET_URL}?action=getWishes`, {
            redirect: "follow",
            headers: { "Accept": "application/json" },
            cache: "no-store",
        });

        const text = await res.text();
        console.log("[Wishes API] Status:", res.status, "Body preview:", text.slice(0, 200));

        // Apps Script sometimes returns HTML on auth errors
        if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
            console.error("[Wishes API] Non-JSON response from Apps Script");
            return NextResponse.json({ data: [], error: "Apps Script returned non-JSON. Check deployment access is set to 'Anyone'." });
        }

        const json = JSON.parse(text);
        return NextResponse.json(json);
    } catch (err) {
        console.error("[Wishes API] Error:", err);
        return NextResponse.json({ data: [], error: String(err) });
    }
}
