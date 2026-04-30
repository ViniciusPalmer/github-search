import Image from "next/image";

import { useRepoConsultingContext } from "../../contexts/RepoConsultingContext";
import { BrandEyebrow } from "../BrandEyebrow";
import { SearchPageShell } from "../SearchPageShell/index";

export function LoggedOutLandingScreen() {
  const { startSession } = useRepoConsultingContext();

  return (
    <SearchPageShell>
      <section className="mx-auto flex w-full max-w-[680px] justify-center py-4 sm:py-10">
        <div className="w-full rounded-auth-card border border-auth-border bg-auth-card/95 px-6 py-8 text-auth-text-primary shadow-auth-card backdrop-blur-md sm:px-12 sm:py-11">
          <div className="flex flex-col items-center gap-7 text-center">
            <div className="flex flex-col items-center gap-5">
              <BrandEyebrow>GITHUB REPOSITORY CONSULTING</BrandEyebrow>
              <div className="space-y-4">
                <h1 className="font-auth-title text-4xl font-semibold tracking-[-0.04em] text-auth-text-primary sm:text-5xl sm:leading-[1.05]">
                  Entre para consultar repositórios GitHub
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-auth-text-secondary sm:text-base">
                  Faça login com sua conta GitHub e encontre projetos, donos,
                  linguagens e estatísticas em uma experiência focada.
                </p>
              </div>
            </div>

            <section className="w-full rounded-auth-card border border-auth-border-strong bg-auth-panel p-5 shadow-auth-panel">
              <div className="rounded-auth-control border border-auth-border bg-auth-terminal p-4">
                <div className="flex items-center justify-between gap-4 border-b border-auth-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-auth-magenta" />
                    <span className="h-2.5 w-2.5 rounded-full bg-auth-cyan" />
                    <span className="h-2.5 w-2.5 rounded-full bg-auth-eyebrow" />
                  </div>
                  <p className="font-auth-label text-[11px] font-medium tracking-[0.08em] text-auth-text-muted">
                    github-search.local/auth
                  </p>
                </div>

                <div className="mt-4 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-auth-text-primary">
                    <span className="h-2 w-2 rounded-full bg-auth-violet" />
                    <span>OAuth GitHub pronto para iniciar</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-auth-text-secondary">
                    <span className="h-2 w-2 rounded-full bg-auth-magenta" />
                    <span>Permissões mínimas, busca rápida</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-auth-text-secondary">
                    <span className="h-2 w-2 rounded-full bg-auth-cyan" />
                    <span>Sessão segura antes da pesquisa</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-auth-control border border-auth-border bg-auth-terminal-tile px-4 py-3 text-left">
                    <p className="font-auth-title text-2xl font-semibold text-auth-text-primary">
                      1 click
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-auth-text-muted">
                      login
                    </p>
                  </div>
                  <div className="rounded-auth-control border border-auth-border bg-auth-terminal-tile px-4 py-3 text-left">
                    <p className="font-auth-title text-2xl font-semibold text-auth-text-primary">
                      0 setup
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-auth-text-muted">
                      required
                    </p>
                  </div>
                  <div className="rounded-auth-control border border-auth-border bg-auth-terminal-tile px-4 py-3 text-left">
                    <p className="font-auth-title text-2xl font-semibold text-auth-text-primary">
                      live
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-auth-text-muted">
                      results data
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={startSession}
                className="inline-flex items-center gap-3 rounded-auth-control bg-auth-violet px-6 py-4 font-auth-body text-base font-semibold text-auth-text-primary shadow-auth-button transition hover:bg-auth-magenta focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-card focus-visible:outline-none"
              >
                <Image
                  src="/icons/GitHub-Dark.png"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  data-testid="github-login-icon"
                  className="h-5 w-5 invert"
                />
                Entrar com GitHub
              </button>
              <p className="font-auth-label text-[11px] font-medium uppercase tracking-[0.12em] text-auth-text-muted sm:text-xs">
                OAuth via GitHub • Interface responsiva • Busca por usuário e repositório
              </p>
            </div>
          </div>
        </div>
      </section>
    </SearchPageShell>
  );
}
