export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: 48 }}>T3 SaaS</h1>
      <p style={{ fontSize: 20, color: "#666", margin: "16px 0" }}>tRPC + Prisma + NextAuth + Tailwind. Type-safe from database to UI.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 32, textAlign: "left" }}>
        <FeatureCard icon="🔗" title="tRPC" desc="End-to-end type safety with zero code generation" />
        <FeatureCard icon="🗄️" title="Prisma" desc="Type-safe database access with auto-generated types" />
        <FeatureCard icon="🔐" title="NextAuth" desc="Authentication with OAuth and credential providers" />
      </div>
    </main>
  );
}
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 12 }}><div style={{ fontSize: 28 }}>{icon}</div><h3>{title}</h3><p style={{ color: "#666", fontSize: 14 }}>{desc}</p></div>;
}
