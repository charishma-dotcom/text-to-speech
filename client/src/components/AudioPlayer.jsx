function AudioPlayer({
  isSpeaking,
  isPaused,
  onPause,
  onResume,
  onStop,
  text
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="speech-player">
      <div className="player-header">
        <div>
          <strong>
            🔊 Speech Player
          </strong>

          <small>
            {isSpeaking
              ? isPaused
                ? "Paused"
                : "Speaking..."
              : "Ready"}
          </small>
        </div>

        <div
          className={
            isSpeaking
              ? "status-dot active"
              : "status-dot"
          }
        />
      </div>

      <div className="player-controls">
        {isSpeaking &&
          !isPaused && (
            <button
              onClick={onPause}
            >
              ⏸ Pause
            </button>
          )}

        {isSpeaking &&
          isPaused && (
            <button
              onClick={onResume}
            >
              ▶ Resume
            </button>
          )}

        <button
          onClick={onStop}
          className="stop-button"
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;