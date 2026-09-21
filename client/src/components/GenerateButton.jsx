function GenerateButton({
  onClick,
  disabled
}) {
  return (
    <button
      type="button"
      className="generate-button"
      onClick={onClick}
      disabled={disabled}
    >
      ▶ Generate Speech
    </button>
  );
}

export default GenerateButton;