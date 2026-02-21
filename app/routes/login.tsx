import { Form, useActionData } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const code = formData.get("inviteCode");
  
  // This checks the environment variable you set in Cloudflare
  const secretCode = (context.cloudflare as any).env.VITE_INVITE_CODE;

  if (code === secretCode) {
    return redirect("/", {
      headers: {
        "Set-Cookie": "is_allowed=true; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax",
      },
    });
  }

  return { error: "Wrong code, try again!" };
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1>Enter Invite Code</h1>
      <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          name="inviteCode" 
          type="password" 
          placeholder="Enter Code"
          style={{ padding: '10px', borderRadius: '5px', border: 'none' }} 
        />
        {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '5px' }}>
          Verify
        </button>
      </Form>
    </div>
  );
}
