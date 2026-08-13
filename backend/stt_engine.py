import os
import tempfile
from faster_whisper import WhisperModel

# Use the smallest model that works well for English physics questions.
# "tiny.en" is ~39 MB and runs on CPU in under 1 second per utterance.
# It is automatically downloaded on first startup and cached locally forever.
MODEL_SIZE = "tiny.en"

print("[STT] Loading offline Whisper model (tiny.en)...")
_model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
print("[STT] Whisper model loaded successfully.")


def transcribe_audio(audio_bytes: bytes, file_extension: str = "webm") -> str:
    """
    Transcribe raw audio bytes to text using the locally cached Whisper model.

    Parameters
    ----------
    audio_bytes : bytes
        Raw audio data received from the frontend MediaRecorder.
    file_extension : str
        File extension hint for the temporary file (e.g. 'webm', 'wav', 'ogg').

    Returns
    -------
    str
        The transcribed text, or an empty string if nothing was detected.
    """
    # Write audio to a temp file because faster-whisper needs a file path
    suffix = f".{file_extension}"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        segments, _ = _model.transcribe(tmp_path, language="en")
        text = " ".join(segment.text.strip() for segment in segments).strip()
        print(f"[STT] Transcribed: '{text}'")
        return text
    finally:
        # Always clean up the temp file
        try:
            os.remove(tmp_path)
        except OSError:
            pass
