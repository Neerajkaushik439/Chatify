import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [previews, setPreviews] = useState([]); // [{ name, type, data }]
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          name: file.name,
          type: file.type,
          data: reader.result,
        });
        if (newPreviews.length === files.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && previews.length === 0) return;

    try {
      await sendMessage({
        text: text.trim(),
        mediaFiles: previews.map((p) => ({
          data: p.data,
          type: p.type,
          name: p.name,
        })),
      });

      // Clear form
      setText("");
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* File Previews */}
      {previews.length > 0 && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          {previews.map((p, idx) => (
            <div key={idx} className="relative">
              {p.type.startsWith("image/") ? (
                <img
                  src={p.data}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
              ) : p.type.startsWith("video/") ? (
                <video
                  src={p.data}
                  className="w-28 h-20 rounded-lg border border-zinc-700"
                  controls
                />
              ) : (
                <div className="w-28 h-20 rounded-lg border border-zinc-700 flex items-center justify-center p-2">
                  <span className="text-sm text-zinc-400 truncate">{p.name}</span>
                </div>
              )}
              <button
                onClick={() => removePreview(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input + Actions */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*,video/*,application/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFilesChange}
          />

          {/* File upload button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              previews.length > 0 ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && previews.length === 0}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
