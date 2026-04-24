import { Card, CardContent } from "@/components/ui/card";
import { AuthMockupPanel } from "@/components/AuthMockupPanel";
import { BrandEyebrow } from "@/components/BrandEyebrow";
import { GitHubLoginButton } from "@/components/GitHubLoginButton";

interface LoginPlatformCardProps {
  oauthHref: string;
}

export function LoginPlatformCard({ oauthHref }: LoginPlatformCardProps) {
  return (
    <Card className="w-full overflow-hidden border-auth-border bg-auth-card shadow-auth-card backdrop-blur-xl">
      <CardContent className="space-y-7 px-6 py-8 text-center sm:px-12 sm:py-11">
        <div className="space-y-4">
          <BrandEyebrow>GITHUB REPOSITORY CONSULTING</BrandEyebrow>
          <div className="space-y-3">
            <h1 className="font-auth-title text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-auth-text-primary sm:text-[54px]">
              Entre para consultar repositórios GitHub
            </h1>
            <p className="mx-auto max-w-[560px] font-auth-body text-base leading-7 text-auth-text-secondary sm:text-lg">
              Faça login com sua conta GitHub e encontre projetos, donos,
              linguagens e estatísticas em uma experiência focada.
            </p>
          </div>
        </div>

        <AuthMockupPanel />

        <div className="flex justify-center">
          <GitHubLoginButton href={oauthHref} />
        </div>

        <p className="font-auth-label text-xs font-medium leading-5 text-auth-text-muted sm:text-sm">
          OAuth via GitHub • Interface responsiva • Busca por usuário e
          repositório
        </p>
      </CardContent>
    </Card>
  );
}
