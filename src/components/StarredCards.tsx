import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";

export function StarredCards() {
  const { starredStorage, starredIsOpen } = useContext(RepoConsultingContext);
  return (
    <>
      {starredStorage !== null &&
        starredStorage !== undefined &&
        starredIsOpen && (
          <div className="scrollbar-brand flex max-h-80 w-full flex-col overflow-y-auto">
            {starredStorage.map((repo, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center justify-start border-b border-black/61 px-4 py-2 hover:bg-surface-overlay max-[720px]:flex-wrap max-[720px]:items-start max-[720px]:px-2"
              >
                <div className="flex w-[33%] flex-row items-center justify-start max-[720px]:mb-2 max-[720px]:w-full">
                  <img
                    className="mr-2 w-[30px] rounded-full"
                    src={repo.owner.avatar_url}
                    alt="Icone do GitHub Branco"
                  />
                  <div>
                    <span className="text-[0.7rem] text-brand-title">Proprietario:</span>
                    <h2 className="text-[0.8rem] text-brand-text">{repo.owner.login}</h2>
                  </div>
                </div>

                <div className="m-[5px] flex w-[30%] flex-col items-start justify-center max-[720px]:w-1/2">
                  <span className="text-[0.7rem] text-brand-title">Nome:</span>
                  <h2 className="text-[0.8rem] text-brand-text">{repo.name}</h2>
                </div>

                <div className="w-[36%] max-[720px]:w-full">
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
