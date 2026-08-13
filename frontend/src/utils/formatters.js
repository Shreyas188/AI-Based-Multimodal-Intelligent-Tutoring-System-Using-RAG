/**
 * Recognized headings in the study materials.
 */
export const RECOGNIZED_HEADINGS = [
  "Simple Explanation",
  "What is happening in the image",
  "Real-life Examples",
  "Important Points",
  "Board Exam Tip",
  "Quick Recap",
  "Formula",
  "Meaning of Symbols",
  "Example",
  "Applications",
  "Common Mistake",
  "Video Reference Link"
];

/**
 * Parses study material content string into formatted sections.
 * Finds headings and structures paragraphs/lists under them.
 */
export function parseStudyContent(rawContent) {
  if (!rawContent) return [];

  const lines = rawContent.split("\n");
  const sections = [];
  let currentSection = null;

  const isHeading = (line) => {
    const cleanLine = line.trim().replace(/:+$/, "").toLowerCase();
    return RECOGNIZED_HEADINGS.some(
      h => h.toLowerCase() === cleanLine
    );
  };

  const getHeadingTitle = (line) => {
    const cleanLine = line.trim().replace(/:+$/, "").toLowerCase();
    return RECOGNIZED_HEADINGS.find(
      h => h.toLowerCase() === cleanLine
    ) || line.trim();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isHeading(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: getHeadingTitle(line),
        content: [],
      };
    } else {
      if (!currentSection) {
        // Fallback for content before any heading
        currentSection = {
          title: "Introduction",
          content: [],
        };
      }
      currentSection.content.push(lines[i]);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Refine sections by joining paragraphs and formatting details
  return sections.map(sec => {
    const rawText = sec.content.join("\n").trim();
    
    // Recognize lists or bullet points
    let items = [];
    const listLines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
    
    // Check if the lines are numbered or bulleted
    const isBulletList = listLines.every(line => 
      line.startsWith("-") || 
      line.startsWith("*") || 
      /^\d+[\.\)]/.test(line)
    );

    if (isBulletList && listLines.length > 0) {
      items = listLines.map(line => line.replace(/^[\-\*\d+\.\)]\s*/, ""));
    } else if (sec.title === "Important Points" || sec.title === "Applications" || sec.title === "Real-life Examples") {
      // Split by paragraphs or common list characters as fallback
      items = listLines;
    }

    return {
      title: sec.title,
      rawText,
      items,
      isList: items.length > 0
    };
  });
}

/**
 * Strips markdown symbols like **, ###, \(, \), etc.,
 * and cleans up spacing for the doubt chatbot.
 */
export function cleanDoubtAnswer(answer) {
  if (!answer) return "";

  let cleaned = answer
    // Remove headers markdown (### Heading)
    .replace(/^#+\s+/gm, "")
    // Remove bold markdown (**text**)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    // Remove italic markdown (*text*)
    .replace(/\*(.*?)\*/g, "$1")
    // Remove inline math symbols like \( ... \)
    .replace(/\\\(|\\\)/g, "")
    // Remove display math symbols like \[ ... \]
    .replace(/\\\[|\\\]/g, "")
    // Remove latex equation tags if any
    .replace(/\$\$(.*?)\$\$/g, "$1")
    .replace(/\$(.*?)\$/g, "$1")
    // Remove bullet points if any
    .replace(/^-\s+/gm, "• ")
    // Remove backticks for code inline
    .replace(/`(.*?)`/g, "$1")
    // Clean up multiple line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned;
}
