import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("Slack bot sends test DM", async () => {
  const token = Deno.env.get("SLACK_BOT_TOKEN");
  const userId = Deno.env.get("SLACK_NOTIFY_USER_ID");
  if (!token || !userId) throw new Error("Missing SLACK_BOT_TOKEN or SLACK_NOTIFY_USER_ID");

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      channel: userId,
      text: "✅ Test message from submit-form bot — la integración funciona correctamente.",
    }),
  });

  const data = await res.json();
  console.log("Slack response:", data);
  assertEquals(data.ok, true, `Slack error: ${data.error}`);
});
