import { BrandEyebrow } from "../BrandEyebrow";

export function SearchHero() {
  return (
    <section className="mx-auto flex w-full max-w-[920px] flex-col items-center gap-5 text-center">
      <BrandEyebrow>BUSCA EM TEMPO REAL</BrandEyebrow>
      <h1 className="max-w-4xl font-auth-title text-4xl font-semibold tracking-[-0.04em] text-auth-text-primary sm:text-5xl lg:text-[4rem] lg:leading-[1.05]">
        Encontre usuários próximos no GitHub
      </h1>
      <p className="max-w-2xl text-base leading-7 text-auth-text-secondary sm:text-lg">
        Digite parte de um nome de usuário e veja até cinco perfis mais próximos para continuar sua busca.
      </p>
    </section>
  );
}
