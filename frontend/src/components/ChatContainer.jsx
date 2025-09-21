import React, { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useAuthStore } from "../store/useAuthStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  console.log(messages);
  
  const { authUser } = useAuthStore();
  const MessageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, unsubscribeFromMessages, subscribeToMessages]);

  useEffect(() => {
    if (MessageEndRef.current && messages) {
      MessageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div>
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );

  const timeConv = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Open or download a media URL. For data URLs we convert to blob and trigger download to avoid browser restrictions.
  const openOrDownload = async (url, name) => {
    try {
      if (!url) return;
      if (typeof url === 'string' && url.startsWith('data:')) {
        // convert data url to blob
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = name || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        return;
      }

      // For normal URLs, open in new tab. For some resources you may want to force download.
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error('Failed to open/download media', e);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ width: '50vw' }}>
      <ChatHeader />

      <div className="flex-1 flex-col overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          return (
            <div
              key={msg._id}
              className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      msg.senderId === authUser._id
                        ? authUser.pfp || "/avatar.png"
                        : selectedUser.pfp || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {timeConv(msg.createdAt)}
                </time>
              </div>
              <div className="flex-col">
                <div className="chat-bubble flex-col">
                  {/* Render media attachments (msg.media is an array of URLs) */}
                  {Array.isArray(msg.media) && msg.media.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {msg.media.map((url, i) => {
                        const isDataUrl = typeof url === 'string' && url.startsWith('data:');
                        const isVideo = isDataUrl ? url.startsWith('data:video') : String(url).includes('/video/upload/') || /\.(mp4|webm|mov|mkv)(\?|$)/i.test(url);
                        const isImage = isDataUrl ? url.startsWith('data:image') : /\.(gif|jpe?g|tiff?|png|webp|bmp)(\?|$)/i.test(String(url)) || String(url).includes('/image/upload/');

                        const mediaElement = isVideo ? (
                          <video key={i} src={url} className="max-w-[240px] rounded-md" controls />
                        ) : isImage ? (
                          <img key={i} src={url} alt={`attachment-${i}`} className="sm:max-w-[240px] rounded-md" />
                        ) : (
                          <a key={i} href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 underline">
                            Download file
                          </a>
                        );

                        // Wrap media element so we can show an overlay download/open button
                        return (
                          <div key={i} className="relative inline-block">
                            {mediaElement}
                            {url && (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-1 right-1 bg-base-300 rounded-full p-1 shadow-md"
                                title="Open / Download"
                              >
                                <Download size={14} />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={MessageEndRef} />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatContainer;
