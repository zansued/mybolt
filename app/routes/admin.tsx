import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie") || "";
  
  // Use 'OMAN-MASTER' or your chosen secret admin code
  if (!cookieHeader.includes("invite_code=OMAN-MASTER")) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const kv = (context.cloudflare as any).env.INVITE_KV;
  const list = await kv.list();
  const codes = await Promise.all(
    list.keys.map(async (key: any) => {
      const val = await kv.get(key.name);
      return { name: key.name, ...JSON.parse(val) };
    })
  );

  return json({ codes });
};

export default function Admin() {
  const { codes } = useLoaderData<typeof loader>();
  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8B5CF6' }}>Referral Statistics</h1>
      <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
        {codes.map((c: any) => (
          <div key={c.name} style={{ border: '1px solid #333', padding: '20px', borderRadius: '12px', background: '#0a0a0a' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>Code: {c.name}</h2>
            <p style={{ color: '#aaa' }}>Usage: <span style={{ color: '#fff' }}>{c.uses} / {c.limit}</span></p>
            <p style={{ color: c.uses >= c.limit ? '#ff4444' : '#44ff44' }}>
              Status: {c.uses >= c.limit ? 'Full / Expired' : 'Active'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
