import { useState } from "react";

function SpeechHistory({
  history,
  onReplay,
  onFavorite,
  onDelete,
  onClear,
  userEmail
}) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClearClick = () => {
    setShowDialog(true);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleConfirmClear = () => {
  onClear();

  setShowDialog(false);
};

  return (
    <>
      <section className="page-card history-page">

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px"
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 8px",
                color: "#16213e",
                fontSize: "30px",
                fontWeight: "700"
              }}
            >
              Speech History
            </h2>

            <p
              style={{
                margin: "0",
                color: "#687086",
                fontSize: "16px"
              }}
            >
              Your previously generated speech
              is stored locally.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearClick}
              style={{
                height: "48px",
                padding: "0 18px",
                border: "1px solid #f0b7b7",
                borderRadius: "10px",
                background: "#fffafa",
                color: "#d94747",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Clear History
            </button>
          )}
        </div>

        {/* EMPTY HISTORY */}
        {history.length === 0 ? (
          <div
            style={{
              padding: "55px 20px",
              textAlign: "center",
              border: "1px dashed #d8def0",
              borderRadius: "12px",
              background: "#fafbff"
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "12px"
              }}
            >
              🕘
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#25304a",
                fontSize: "18px"
              }}
            >
              No Speech History
            </h3>

            <p
              style={{
                margin: "0",
                color: "#7a8398",
                fontSize: "14px"
              }}
            >
              Your generated speech will appear
              here.
            </p>
          </div>
        ) : (

          /* HISTORY LIST */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}
          >
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "20px 22px",
                  border: "1px solid #dce2f0",
                  borderRadius: "12px",
                  background: "#fbfcff"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px"
                  }}
                >

                  <div
                    style={{
                      flex: "1",
                      minWidth: "0"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginBottom: "10px"
                      }}
                    >

                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: "6px",
                          background: "#f0f3fa",
                          color: "#586780",
                          fontSize: "12px"
                        }}
                      >
                        {item.languageName ||
                          item.language}
                      </span>

                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: "6px",
                          background: "#f0f3fa",
                          color: "#586780",
                          fontSize: "12px"
                        }}
                      >
                        {item.voice}
                      </span>

                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: "6px",
                          background: "#f0f3fa",
                          color: "#586780",
                          fontSize: "12px"
                        }}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </span>

                    </div>

                    <div
                      style={{
                        color: "#25304a",
                        fontSize: "17px",
                        lineHeight: "1.6",
                        wordBreak: "break-word"
                      }}
                    >
                      {item.text}
                    </div>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      flexShrink: "0"
                    }}
                  >

                    {/* PLAY */}
                    <button
                      type="button"
                      title="Play"
                      onClick={() =>
                        onReplay(item)
                      }
                      style={{
                        width: "44px",
                        height: "44px",
                        border:
                          "1px solid #d8dfef",
                        borderRadius: "9px",
                        background: "#ffffff",
                        fontSize: "19px",
                        cursor: "pointer"
                      }}
                    >
                      ▶
                    </button>

                    {/* FAVORITE */}
                    <button
                      type="button"
                      title={
                        item.favorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      onClick={() =>
                        onFavorite(item.id)
                      }
                      style={{
                        width: "44px",
                        height: "44px",
                        border:
                          "1px solid #d8dfef",
                        borderRadius: "9px",
                        background: "#ffffff",
                        color: item.favorite
                          ? "#e5a000"
                          : "#25304a",
                        fontSize: "19px",
                        cursor: "pointer"
                      }}
                    >
                      {item.favorite
                        ? "★"
                        : "☆"}
                    </button>

                    {/* DELETE ONE */}
                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        onDelete(item.id)
                      }
                      style={{
                        width: "44px",
                        height: "44px",
                        border:
                          "1px solid #d8dfef",
                        borderRadius: "9px",
                        background: "#ffffff",
                        color: "#c34c4c",
                        fontSize: "17px",
                        cursor: "pointer"
                      }}
                    >
                      🗑
                    </button>

                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* CUSTOM CLEAR HISTORY DIALOG */}
      {showDialog && (
        <div
          style={{
            position: "fixed",
            inset: "0",
            zIndex: "99999",
            background:
              "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={handleCancel}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              boxSizing: "border-box",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)"
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ICON */}
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "13px",
                background: "#fff1f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "18px"
              }}
            >
              🗑️
            </div>

            {/* TITLE */}
            <h2
              style={{
                margin: "0 0 10px",
                color: "#20283a",
                fontSize: "21px",
                fontWeight: "700"
              }}
            >
              Clear Speech History?
            </h2>

            {/* MESSAGE */}
            <p
              style={{
                margin: "0 0 25px",
                color: "#687086",
                fontSize: "15px",
                lineHeight: "1.6"
              }}
            >
              Are you sure you want to clear your
speech history?

Your starred favorites will be kept.
Only non-favorite history items will
be removed.
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
              }}
            >

              {/* CANCEL */}
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  border:
                    "1px solid #d8def0",
                  borderRadius: "9px",
                  background: "#ffffff",
                  color: "#4f5a70",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              {/* DELETE */}
              <button
                type="button"
                onClick={handleConfirmClear}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  border: "none",
                  borderRadius: "9px",
                  background:
                    "linear-gradient(135deg, #e85d5d, #d94747)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow:
                    "0 5px 12px rgba(217,71,71,0.20)"
                }}
              >
                Delete History
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default SpeechHistory;