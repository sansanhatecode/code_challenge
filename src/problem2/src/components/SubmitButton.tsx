interface SubmitButtonProps {
  submitting: boolean;
  canSubmit: boolean;
  hasTokens: boolean;
}

export function SubmitButton({ submitting, canSubmit, hasTokens }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className={`
        w-full mt-3 py-4 rounded-2xl text-[15px] sm:text-base font-bold tracking-tight
        flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer
        ${submitting
          ? "bg-s3 text-t3 cursor-not-allowed"
          : canSubmit
            ? "bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(108,92,231,0.35)] active:translate-y-0"
            : "bg-s3 text-t3 cursor-not-allowed"
        }
      `}
    >
      {submitting ? (
        <>
          <span className="w-[18px] h-[18px] border-[2.5px] border-white/20 border-t-white rounded-full [animation:spin_0.7s_linear_infinite]" />
          Swapping...
        </>
      ) : !canSubmit ? (
        !hasTokens ? "Select tokens" : "Enter an amount"
      ) : "Swap"}
    </button>
  );
}
