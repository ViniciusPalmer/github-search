export function LoadingScreen() {
  return (
    <div className="absolute z-2 flex h-screen w-screen items-center justify-center bg-surface-overlay">
      <div
        className="h-[124px] w-[124px] animate-loading-spin cursor-wait rounded-full border-8 border-white/25 border-t-white"
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
}
