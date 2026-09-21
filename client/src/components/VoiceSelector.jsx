function VoiceSelector({
  voices,
  selectedVoice,
  onChange
}) {
  return (
    <div className="select-group">
      <label>
        Voice
      </label>

      <select
        value={selectedVoice}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        disabled={!voices.length}
      >
        {!voices.length ? (
          <option value="">
            No voice available
          </option>
        ) : (
          voices.map(
            (voice) => (
              <option
                key={`${voice.name}-${voice.lang}`}
                value={voice.name}
              >
                {voice.name}
                {" — "}
                {voice.lang}
                {voice.default
                  ? " — Default"
                  : ""}
              </option>
            )
          )
        )}
      </select>

      <small className="voice-info">
        {voices.length} available
      </small>
    </div>
  );
}

export default VoiceSelector;