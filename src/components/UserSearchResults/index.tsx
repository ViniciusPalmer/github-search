import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { UserResultCard, type UserResultCardItem } from "../UserResultCard/index";

interface UserSearchResultsProps {
  results: UserResultCardItem[];
  currentPage: number;
  totalResults: number;
  pageSize: number;
  isLoading: boolean;
  selectedLogin: string | null;
  onSelect: (login: string) => void;
  onPageChange: (page: number) => void;
}

interface ScrollThumbMetrics {
  height: number;
  offset: number;
}

const MIN_SCROLL_THUMB_HEIGHT = 72;
const DEFAULT_SCROLL_THUMB_HEIGHT = 88;

function buildVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 1) {
    return [] as Array<number | "ellipsis">;
  }

  const visiblePages = new Set([1, currentPage, totalPages]);

  if (currentPage > 2) {
    visiblePages.add(currentPage - 1);
  }

  if (currentPage < totalPages - 1) {
    visiblePages.add(currentPage + 1);
  }

  const sortedPages = [...visiblePages].sort((left, right) => left - right);

  return sortedPages.reduce<Array<number | "ellipsis">>((items, page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);

    return items;
  }, []);
}

export function UserSearchResults({
  results,
  currentPage,
  totalResults,
  pageSize,
  isLoading,
  selectedLogin,
  onSelect,
  onPageChange,
}: UserSearchResultsProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scrollThumbMetrics, setScrollThumbMetrics] = useState<ScrollThumbMetrics>({
    height: DEFAULT_SCROLL_THUMB_HEIGHT,
    offset: 0,
  });

  const syncScrollThumb = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const trackHeight = viewport.clientHeight;

    if (trackHeight === 0) {
      return;
    }

    const maxScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);

    if (maxScrollTop === 0) {
      setScrollThumbMetrics({
        height: Math.min(trackHeight, DEFAULT_SCROLL_THUMB_HEIGHT),
        offset: 0,
      });

      return;
    }

    const nextThumbHeight = Math.max(
      MIN_SCROLL_THUMB_HEIGHT,
      Math.round((viewport.clientHeight / viewport.scrollHeight) * trackHeight)
    );
    const maxThumbOffset = Math.max(0, trackHeight - nextThumbHeight);
    const nextThumbOffset = Math.round((viewport.scrollTop / maxScrollTop) * maxThumbOffset);

    setScrollThumbMetrics({
      height: nextThumbHeight,
      offset: nextThumbOffset,
    });
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    syncScrollThumb();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncScrollThumb);

      return () => {
        window.removeEventListener("resize", syncScrollThumb);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      syncScrollThumb();
    });

    resizeObserver.observe(viewport);

    Array.from(viewport.children).forEach((child) => {
      resizeObserver.observe(child);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [results, syncScrollThumb]);

  if (results.length === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const visibleRangeStart = (currentPage - 1) * pageSize + 1;
  const visibleRangeEnd = visibleRangeStart + results.length - 1;
  const canGoPrevious = !isLoading && currentPage > 1;
  const canGoNext = !isLoading && currentPage < totalPages;

  return (
    <section className="flex min-h-0 flex-col gap-3" aria-labelledby="github-user-results-title">
      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <div>
          <h2 id="github-user-results-title" className="font-auth-title text-lg font-semibold text-auth-text-primary">
            Perfis encontrados
          </h2>
          <p className="text-sm text-auth-text-secondary">Selecione um perfil para abrir os detalhes</p>
        </div>
        <span className="rounded-full bg-auth-terminal px-3 py-1 text-xs text-auth-text-muted">
          {visibleRangeStart}-{visibleRangeEnd} de {totalResults}
        </span>
      </div>
      <div className="flex min-h-0 items-stretch gap-2">
        <div
          ref={viewportRef}
          role="region"
          aria-label="Lista de perfis encontrados"
          tabIndex={0}
          onScroll={syncScrollThumb}
          className="scrollbar-none grid min-h-0 max-h-[16rem] flex-1 gap-3 overflow-y-auto overscroll-contain pr-1 outline-none sm:max-h-[18rem] lg:max-h-[20rem]"
        >
          {results.map((user) => (
            <UserResultCard
              key={user.id}
              user={user}
              isLoading={selectedLogin === user.login}
              isDisabled={selectedLogin !== null || isLoading}
              onSelect={onSelect}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex w-[14px] shrink-0 rounded-full bg-auth-terminal p-px"
          data-scrollbar-rail="true"
        >
          <div
            className="relative h-full w-full rounded-full border border-auth-border-strong bg-auth-terminal-tile/90"
            data-scrollbar-track="true"
          >
            <div
              className="absolute inset-x-px rounded-full border border-violet-200/90 bg-[linear-gradient(180deg,var(--color-auth-cyan)_0%,var(--color-auth-violet)_56%,var(--color-auth-magenta)_100%)] shadow-[0_0_18px_rgba(139,92,246,0.32)]"
              data-scrollbar-thumb="true"
              style={{
                height: `${scrollThumbMetrics.height}px`,
                transform: `translateY(${scrollThumbMetrics.offset}px)`,
              }}
            />
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <nav
          aria-label="Paginação dos resultados"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="default"
            disabled={!canGoPrevious}
            aria-label="Página anterior"
            onClick={() => onPageChange(currentPage - 1)}
            className="h-10 border border-auth-border bg-auth-terminal px-4 text-auth-text-secondary hover:bg-auth-terminal-tile hover:text-auth-text-primary disabled:border-auth-border disabled:bg-auth-terminal"
          >
            Previous
          </Button>
          {visiblePages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  aria-hidden="true"
                  className="flex h-10 min-w-10 items-center justify-center rounded-auth-control border border-auth-border bg-auth-terminal px-3 text-sm text-auth-text-secondary"
                >
                  ...
                </span>
              );
            }

            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                type="button"
                variant={isCurrentPage ? "default" : "ghost"}
                size="default"
                disabled={isLoading || isCurrentPage}
                aria-label={`Página ${page}`}
                aria-current={isCurrentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className="h-10 min-w-10 border border-auth-border px-0"
              >
                {page}
              </Button>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="default"
            disabled={!canGoNext}
            aria-label="Próxima página"
            onClick={() => onPageChange(currentPage + 1)}
            className="h-10 border border-auth-border bg-auth-terminal px-4 text-auth-text-secondary hover:bg-auth-terminal-tile hover:text-auth-text-primary disabled:border-auth-border disabled:bg-auth-terminal"
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}
