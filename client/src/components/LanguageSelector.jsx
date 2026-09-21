function LanguageSelector({
  languages,
  selectedLanguage,
  onChange
}) {
  return (
    <div className="select-group">
      <label>
        Language
      </label>

      <select
        value={selectedLanguage}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >
        {languages.map(
          (language) => (
            <option
              key={language.code}
              value={language.code}
            >
              {language.name}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default LanguageSelector;