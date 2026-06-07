import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'java' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const highlightCode = (code: string) => {
    let highlighted = code
      .replace(/(\/\/.*$)/gm, '<span class="text-dark-500">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|this|super|null|true|false)\b/g, '<span class="text-pink-400">$1</span>')
      .replace(/\b(int|long|short|byte|char|boolean|float|double|String|Integer|Long|Boolean|Double|Float|List|Map|Set|Object|StringBuilder|System|Math|Thread|Runnable|Callable|Future|Executor|ExecutorService|ThreadPoolExecutor|Lock|ReentrantLock|synchronized|volatile|transient|strictfp|native|abstract|enum|annotation|interface)\b/g, '<span class="text-cyan-400">$1</span>')
      .replace(/\b(\d+[LDF]?|0x[0-9a-fA-F]+)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/(@\w+)/g, '<span class="text-yellow-400">$1</span>');
    
    return highlighted;
  };

  return (
    <div className="code-block my-4">
      <div className="code-block-header flex items-center justify-between">
        <span className="uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              复制
            </>
          )}
        </button>
      </div>
      <div className="code-block-content">
        <pre className="m-0">
          <code
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>
    </div>
  );
}
