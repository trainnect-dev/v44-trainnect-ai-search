"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search,
  MessageSquare,
  Menu,
  X,
  Bot
} from "lucide-react";
import { ChatHistoryDropdown } from "./chat-history/chat-history-dropdown";
import { UserProfile } from "./auth/user-profile";

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

interface SidebarBodyProps extends React.ComponentProps<typeof motion.div> {
  className?: string;
  children: React.ReactNode;
}

interface SidebarLinkComponentProps {
  link: SidebarLinkProps;
  className?: string;
}

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
} | null>(null);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen }: SidebarProps) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({ className, children, ...props }: SidebarBodyProps) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <>
      <motion.div
        {...props}
        animate={{
          width: open ? "240px" : "80px",
          transition: {
            duration: animate ? 0.2 : 0,
          },
        }}
        className={cn(
          "border-r border-border bg-background fixed h-screen flex flex-col p-3 gap-3",
          className
        )}
      >
        <div className="flex items-center justify-between h-12">
          <Logo />
          <button
            onClick={() => setOpen(!open)}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        {children}
        {/* Add user profile at the bottom of the sidebar */}
        <div className="mt-auto flex items-center justify-between px-2 py-2">
          {open && <span className="text-sm text-muted-foreground">Account</span>}
          <UserProfile />
        </div>
      </motion.div>
      <div
        style={{
          width: open ? "240px" : "80px",
          transition: animate ? "width 0.2s" : "none",
        }}
      />
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
}: SidebarLinkComponentProps) => {
  const { open } = useSidebar();

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          transition: { duration: 0.2 },
        }}
        className="text-sm whitespace-pre"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const Logo = () => {
  const { open } = useSidebar();
  
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-foreground whitespace-pre"
        >
          GKennedy AI
        </motion.span>
      )}
    </Link>
  );
};

// Export ChatHistoryDropdown for use in other components
export { ChatHistoryDropdown };
