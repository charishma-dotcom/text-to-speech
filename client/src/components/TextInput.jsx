function TextInput({
  text,
  setText,
  onClear
}) {
  return (
    <div className="input-section">
      <div className="section-header">
        <label>
          Enter your text
        </label>

        <span>
          {text.length} characters
        </span>
      </div>

      <textarea
        value={text}
        onChange={(event) =>
          setText(
            event.target.value
          )
        }
        placeholder="Type your text here..."
        maxLength={32767}
      />

      <div className="input-footer">
        <span>
          Maximum 32,767 characters
        </span>

        <button
          type="button"
          onClick={onClear}
          disabled={!text}
          className="clear-button"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default TextInput;