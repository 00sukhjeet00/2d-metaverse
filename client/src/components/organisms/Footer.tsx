import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          © 2025 Metaverse 2D. Built with ❤️ by Sukhjeet Singh
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/00sukhjeet00"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
          >
            <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Github size={18} />
            </div>
            <span className="text-sm font-medium">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/00sukhjeet00/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
          >
            <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Linkedin size={18} />
            </div>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
