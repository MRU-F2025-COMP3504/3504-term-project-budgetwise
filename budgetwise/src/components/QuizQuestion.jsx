/**
 * QuizQuestion Component
 *
 * Renders a single question for the quiz.
 * It handles different input types (like text boxes or dropdown menus).
 *
 * Props:
 * - question: The question object (id, text, type, options)
 * - value: The current answer the user has typed/selected
 * - onChange: Function to update the answer
 * - disabled: Whether the input should be locked (e.g., while loading)
 */
export default function QuizQuestion({ question, value, onChange, disabled }) {
  if (!question) return null;
  const { text, inputType, options } = question;

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-center">{text}</p>

      <div className="max-w-sm w-full mx-auto">
        {inputType === "select" && Array.isArray(options) && (
          <select
            className="bw-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select...</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
        {/* Default to text input for 'text' and 'number' types */}
        {inputType !== "select" && (
          <input
            type="text"
            className="bw-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer"
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
