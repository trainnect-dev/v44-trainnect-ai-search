// Type declarations for modules without type definitions

declare module 'sonner' {
  export const Toaster: React.FC<{
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    [key: string]: any;
  }>;
  export function toast(message: string, options?: any): void;
  export namespace toast {
    function error(message: string, options?: any): void;
    function success(message: string, options?: any): void;
    function warning(message: string, options?: any): void;
    function info(message: string, options?: any): void;
  }
}

declare module 'geist/font/sans' {
  const GeistSans: {
    variable: string;
    [key: string]: any;
  };
  export { GeistSans };
}

declare module 'geist/font/mono' {
  const GeistMono: {
    variable: string;
    [key: string]: any;
  };
  export { GeistMono };
}

declare module 'framer-motion' {
  export const motion: {
    [key: string]: any;
    div: any;
    span: any;
  };
}

declare module 'lucide-react' {
  export const LayoutDashboard: React.FC<{ size?: number; className?: string }>;
  export const Search: React.FC<{ size?: number; className?: string }>;
  export const MessageSquare: React.FC<{ size?: number; className?: string }>;
  export const Bot: React.FC<{ size?: number; className?: string }>;
  export const PlusCircle: React.FC<{ size?: number; className?: string }>;
  export const MoreVertical: React.FC<{ size?: number; className?: string }>;
  export const History: React.FC<{ size?: number; className?: string }>;
  export const Trash2: React.FC<{ size?: number; className?: string }>;
  export const Copy: React.FC<{ size?: number; className?: string }>;
  export const Clock: React.FC<{ size?: number; className?: string }>;
  export const Menu: React.FC<{ size?: number; className?: string }>;
  export const X: React.FC<{ size?: number; className?: string }>;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

// Extend JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
