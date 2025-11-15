import { useState } from "react";
import { toast } from "sonner@2.0.3";
async function onSubmit(submission: any): Promise<Response> {
  try {
    const response = await fetch(
      "https://speedrun.koyot.digital/api/v1/submit/",
      {
        // API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission), // Convert your data object to a JSON string
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to send data",
      );
    }
    const data: Response = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error; // Re-throw the error for handling in the calling component
  }
}
const submission = {
      id: Date.now().toString(),
      userID: String,
      category: String,
      score: Float64Array,
      proofUrl: String,
      avatarColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      avatarURL: String,
      submissionDate: new Date(),
      status: "pending",
    };
type SubmitFormProps = {
  isDarkMode: boolean;
  onSubmit: any;
};

export function SubmitForm({
  isDarkMode,
  onSubmit,
}: SubmitFormProps) {
  const [userID, setUserID] = useState("");
  const [category, setCategory] = useState("Meltdown%");
  const [score, setScore] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const categories = ["Meltdown%", "Eff%", "Die%", "Startup%"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userID || !score) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submission = {
      id: Date.now().toString(),
      userID: Number,
      category: String,
      score: String,
      proofUrl: String,
      avatarURL: String,
      submissionDate: new Date(),
      status: "pending",
    };

    onSubmit(submission);
    toast.success("Submission sent for review!");

    // Reset form
    setUserID("");
    setScore("");
    setProofUrl("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl mb-5 sm:mb-6">
        Submit Your Score
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6"
      >
        <div>
          <label
            className={`block mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#CAC4D0]" : "text-gray-700"}`}
          >
            User ID *
          </label>
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="12345678"
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
              isDarkMode
                ? "bg-[#2B2930] border-[#4A4458] text-[#E6E0E9]"
                : "bg-white border-gray-300 text-gray-900"
            } border outline-none focus:ring-2 focus:ring-purple-500`}
            required
          />
        </div>

        <div>
          <label
            className={`block mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#CAC4D0]" : "text-gray-700"}`}
          >
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
              isDarkMode
                ? "bg-[#2B2930] border-[#4A4458] text-[#E6E0E9]"
                : "bg-white border-gray-300 text-gray-900"
            } border outline-none focus:ring-2 focus:ring-purple-500`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#CAC4D0]" : "text-gray-700"}`}
          >
            Time Or Score *
          </label>
          <input
            type="text"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="2:33 or 190%"
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
              isDarkMode
                ? "bg-[#2B2930] border-[#4A4458] text-[#E6E0E9]"
                : "bg-white border-gray-300 text-gray-900"
            } border outline-none focus:ring-2 focus:ring-purple-500`}
            required
          />
        </div>

        <div>
          <label
            className={`block mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#CAC4D0]" : "text-gray-700"}`}
          >
            Proof Video/Livestream
          </label>
          <input
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://..."
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
              isDarkMode
                ? "bg-[#2B2930] border-[#4A4458] text-[#E6E0E9]"
                : "bg-white border-gray-300 text-gray-900"
            } border outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-3 rounded-lg ${
            isDarkMode
              ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#E8DEF8]"
              : "bg-purple-600 text-white hover:bg-purple-700"
          } transition-colors`}
        >
          Submit Score
        </button>
      </form>

      <div
        className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg ${isDarkMode ? "bg-[#2B2930]" : "bg-gray-50"}`}
      >
        <p
          className={`text-xs sm:text-sm ${isDarkMode ? "text-[#938F99]" : "text-gray-600"}`}
        >
          Your submission will be reviewed by an admin before
          appearing on the leaderboard.
        </p>
      </div>
    </div>
  );
}