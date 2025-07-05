
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Chat Assistant
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience seamless real-time conversations with our AI assistant. 
            Powered by Socket.IO for instant messaging and built with a modern, 
            ChatGPT-inspired interface.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Chat</h3>
            <p className="text-gray-400 text-sm">
              Instant messaging with Socket.IO for seamless communication
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <ArrowUp className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Modern Interface</h3>
            <p className="text-gray-400 text-sm">
              Clean, responsive design inspired by ChatGPT's user experience
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Conversation History</h3>
            <p className="text-gray-400 text-sm">
              Keep track of all your conversations with organized chat history
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link to="/chat">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-xl"
            >
              Start Chatting
              <ArrowUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-gray-400">
            Make sure your backend server is running on{" "}
            <code className="bg-white/10 px-2 py-1 rounded text-blue-300">
              http://localhost:3000
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
