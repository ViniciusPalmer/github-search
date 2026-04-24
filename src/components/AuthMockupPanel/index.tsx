import { Card, CardContent } from "@/components/ui/card";
import { AuthFeatureRow } from "@/components/AuthFeatureRow";
import { AuthStatCard } from "@/components/AuthStatCard";

const FEATURE_ROWS = [
  {
    tone: "violet",
    label: "Usuário",
    value: "octocat / repositórios públicos",
  },
  {
    tone: "magenta",
    label: "Linguagens",
    value: "TypeScript, Sass, APIs GitHub",
  },
  {
    tone: "cyan",
    label: "Insights",
    value: "Stars, favoritos e estatísticas",
  },
] as const;

const STATS = [
  { value: "01", label: "Login" },
  { value: "02", label: "Busca" },
  { value: "03", label: "Análise" },
] as const;

export function AuthMockupPanel() {
  return (
    <Card
      aria-hidden="true"
      data-testid="auth-mockup-panel"
      className="pointer-events-none border-auth-border-strong bg-auth-panel shadow-auth-panel"
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b border-auth-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-auth-magenta" />
          <span className="h-2.5 w-2.5 rounded-full bg-auth-violet" />
          <span className="h-2.5 w-2.5 rounded-full bg-auth-cyan" />
          <span className="ml-2 truncate font-auth-label text-xs font-medium text-auth-text-muted">
            github-search.local/auth
          </span>
        </div>
        <div className="space-y-4 bg-auth-terminal p-4 sm:p-5">
          <div className="space-y-3">
            {FEATURE_ROWS.map((row) => (
              <AuthFeatureRow
                key={row.label}
                tone={row.tone}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <AuthStatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
