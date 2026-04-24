import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";

export function RepoCards() {
  const { repoStorage, repoIsOpen } = useContext(RepoConsultingContext);
  return (
    <>
      {repoStorage !== null && repoStorage !== undefined && repoIsOpen && (
        <div className="scrollbar-brand flex max-h-80 w-full flex-col justify-start overflow-y-auto">
          {repoStorage.map((repo, index) => (
            <div
              key={index}
              className="flex w-full flex-row items-center justify-start border-b border-black/61 px-4 py-2 hover:bg-surface-overlay"
            >
              <div className="flex w-[33%] flex-row items-center justify-start max-[720px]:hidden">
                <img
                  className="mr-2 w-[30px]"
                  src="icons/GitHub-Light.png"
                  alt="Icone do GitHub Branco"
                />
                <h2 className="text-[0.8rem] text-brand-text">Repositorio do GitHub</h2>
              </div>

              <div className="m-[5px] flex w-[30%] flex-col flex-wrap items-start justify-center max-[720px]:w-1/2">
                <span className="text-[0.7rem] text-brand-title">Nome:</span>
                <h2 className="text-[0.8rem] text-brand-text">{repo.name}</h2>
              </div>

              <div className="w-[36%]">
                <span className="text-[0.7rem] text-brand-title">Descrição:</span>
                <h2 className="text-[0.8rem] text-brand-text">
                  {!repo.description
                    ? "Descrição não encontrada"
                    : repo.description}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
