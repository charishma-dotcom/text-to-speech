function DownloadButton({ text }) {
  const handleDownload = () => {
    if (!text || !text.trim()) {
      return;
    }

    const blob = new Blob(
      [text],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "speech-text.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const isDisabled = !text || !text.trim();

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDisabled}
      style={{
        width: "100%",
        height: "58px",
        marginTop: "14px",
        padding: "0 24px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",

        border: "1px solid #d8def5",
        borderRadius: "12px",

        background:
          "linear-gradient(135deg, #ffffff 0%, #f1f4ff 100%)",

        color: "#4f5fd5",

        fontSize: "15px",
        fontWeight: "700",

        cursor: isDisabled
          ? "not-allowed"
          : "pointer",

        boxShadow:
          "0 4px 12px rgba(88, 110, 232, 0.10)",

        opacity: isDisabled ? 0.5 : 1,

        transition:
          "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform =
            "translateY(-2px)";

          e.currentTarget.style.background =
            "linear-gradient(135deg, #f8f9ff 0%, #e9edff 100%)";

          e.currentTarget.style.borderColor =
            "#586ee8";

          e.currentTarget.style.boxShadow =
            "0 9px 22px rgba(88, 110, 232, 0.18)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.background =
          "linear-gradient(135deg, #ffffff 0%, #f1f4ff 100%)";

        e.currentTarget.style.borderColor =
          "#d8def5";

        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(88, 110, 232, 0.10)";
      }}
    >
      <span
        style={{
          width: "36px",
          height: "36px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "9px",

          background: "#586ee8",
          color: "#ffffff",

          fontSize: "22px",
          fontWeight: "700",

          lineHeight: "1"
        }}
      >
        ↓
      </span>

      <span>
        Download Text
      </span>
    </button>
  );
}

export default DownloadButton;