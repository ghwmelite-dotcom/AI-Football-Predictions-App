import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export function ChatPanel() {
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [messageText, setMessageText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef<any[]>([]);
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isGuest = loggedInUser?.isAnonymous === true;
  const messages = useQuery(api.chat.getMessages, { roomId: selectedRoom, limit: 50 });
  const onlineUsers = useQuery(api.chat.getOnlineUsers, { roomId: selectedRoom });
  const sendMessage = useMutation(api.chat.sendMessage);
  const deleteMessage = useMutation(api.chat.deleteMessage);
  const updatePresence = useMutation(api.chat.updatePresence);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle new message notifications
  useEffect(() => {
    if (!messages || messages.length === 0) {
      prevMessagesRef.current = [];
      return;
    }

    // Check for new messages
    if (prevMessagesRef.current.length > 0 && messages.length > prevMessagesRef.current.length) {
      const newMessages = messages.slice(prevMessagesRef.current.length);
      
      newMessages.forEach((msg) => {
        // Only show notification if it's not from the current user and chat is not expanded
        if (msg.userId !== loggedInUser?._id && !isExpanded) {
          toast.info(`💬 ${msg.userName}: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`, {
            duration: 4000,
          });
          setUnreadCount(prev => prev + 1);
        }
      });
    }

    prevMessagesRef.current = messages;
  }, [messages, loggedInUser?._id, isExpanded]);

  // Reset unread count when chat is expanded
  useEffect(() => {
    if (isExpanded) {
      setUnreadCount(0);
    }
  }, [isExpanded]);

  // Reset unread count when room changes
  useEffect(() => {
    setUnreadCount(0);
    prevMessagesRef.current = [];
  }, [selectedRoom]);

  // Update presence every 30 seconds when chat is open
  useEffect(() => {
    if (!isExpanded || isGuest) return;
    
    updatePresence({ roomId: selectedRoom });
    const interval = setInterval(() => {
      updatePresence({ roomId: selectedRoom });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isExpanded, selectedRoom, isGuest, updatePresence]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    if (isGuest) {
      toast.error("Please create an account to send messages");
      return;
    }

    try {
      await sendMessage({ roomId: selectedRoom, content: messageText });
      setMessageText("");
      setShowEmojiPicker(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage({ messageId: messageId as any });
      toast.success("Message deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete message");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button with Notification Badge */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl transition-shadow relative"
      >
        {isExpanded ? "✕" : "💬"}
        
        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && !isExpanded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation for New Messages */}
        {unreadCount > 0 && !isExpanded && (
          <motion.div
            className="absolute inset-0 bg-red-500 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 w-[500px] h-[500px] bg-white rounded-2xl shadow-2xl flex overflow-hidden border"
          >
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">💬 Community Chat</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-colors flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {onlineUsers?.length || 0} online
                    </button>
                  </div>
                </div>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-sm bg-white/20 border border-white/30 text-white outline-none"
                >
                  <option value="general" className="text-gray-800">General Chat</option>
                  <option value="predictions" className="text-gray-800">Predictions Discussion</option>
                  <option value="tips" className="text-gray-800">Tips & Strategies</option>
                </select>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {!messages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <span className="text-4xl mb-2">💬</span>
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Be the first to say something!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwnMessage = message.userId === loggedInUser?._id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-semibold ${isOwnMessage ? 'text-blue-100' : 'text-gray-600'}`}>
                                {isOwnMessage ? 'You' : message.userName}
                              </span>
                              {isOwnMessage && (
                                <button
                                  onClick={() => handleDeleteMessage(message._id)}
                                  className="text-xs text-blue-100 hover:text-white ml-2"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <p className={`text-sm ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
                              {message.content}
                            </p>
                            <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'} mt-1 block`}>
                              {formatTime(message._creationTime)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                {isGuest ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-2">
                      🔒 Create an account to chat
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-xs bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Sign Up Free
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Emoji Picker */}
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full mb-2 right-0 z-50"
                        >
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={320}
                            height={400}
                            searchDisabled={false}
                            skinTonesDisabled={false}
                            previewConfig={{ showPreview: false }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                        title="Add emoji"
                      >
                        😊
                      </button>
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onFocus={() => setShowEmojiPicker(false)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        maxLength={500}
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Online Users Sidebar */}
            <AnimatePresence>
              {showOnlineUsers && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l bg-gray-50 overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-1 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online Users
                    </h4>
                    {!onlineUsers ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : onlineUsers.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">
                        No users online
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {onlineUsers.map((user) => (
                          <motion.div
                            key={user.userId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                              {user.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {user.userId === loggedInUser?._id ? "You" : user.userName}
                              </p>
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Online
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
