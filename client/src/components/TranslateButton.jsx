function TranslateButton({
  onClick,
  loading,
  disabled
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      style={{
        width: "100%",
        height: "52px",
        marginTop: "18px",
        padding: "0 20px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",

        border: "1px solid #d8def5",
        borderRadius: "10px",

        background:
          "linear-gradient(135deg, #f8f9ff 0%, #eef1ff 100%)",

        color: "#586ee8",

        fontSize: "15px",
        fontWeight: "700",

        cursor: isDisabled
          ? "not-allowed"
          : "pointer",

        boxShadow:
          "0 4px 12px rgba(88, 110, 232, 0.10)",

        opacity: isDisabled ? 0.5 : 1,

        transition: "all 0.2s ease"
      }}
      onMouseEnter={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.transform =
            "translateY(-2px)";

          event.currentTarget.style.background =
            "linear-gradient(135deg, #eef1ff 0%, #e4e8ff 100%)";

          event.currentTarget.style.borderColor =
            "#586ee8";

          event.currentTarget.style.boxShadow =
            "0 8px 20px rgba(88, 110, 232, 0.18)";
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform =
          "translateY(0)";

        event.currentTarget.style.background =
          "linear-gradient(135deg, #f8f9ff 0%, #eef1ff 100%)";

        event.currentTarget.style.borderColor =
          "#d8def5";

        event.currentTarget.style.boxShadow =
          "0 4px 12px rgba(88, 110, 232, 0.10)";
      }}
    >
      <span
        style={{
          width: "30px",
          height: "30px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "7px",

          background: "#586ee8",
          color: "#ffffff",

          fontSize: "18px",
          fontWeight: "700",

          lineHeight: "1"
        }}
      >
        {loading ? "⟳" : "⇄"}
      </span>

      <span>
        {loading
          ? "Translating..."
          : "Translate to Selected Language"}
      </span>
    </button>
  );
}

export default TranslateButton;