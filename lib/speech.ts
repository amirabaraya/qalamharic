export function speakText(text: string, lang = "am-ET", rate = 0.82) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function scoreTranscript(transcript: string, expected: string) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();

  const heard = normalize(transcript);
  const target = normalize(expected);
  if (!heard || !target) return 0;
  if (heard === target) return 100;

  const heardParts = new Set(heard.split(/\s+/));
  const targetParts = target.split(/\s+/);
  const matched = targetParts.filter((part) => heardParts.has(part)).length;

  return Math.round((matched / targetParts.length) * 100);
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  return Recognition ? new Recognition() : null;
}
