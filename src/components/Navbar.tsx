import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <HardHat className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold tracking-tight">
            Core<span className="text-primary">Konstruct</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-3">
          <a href="#features" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>How It Works</a>
          <Link to="/faq" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>FAQ</Link>
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Login</Button></Link>
            <Link to="/signup" className="flex-1"><Button className="w-full" size="sm">Sign Up</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
