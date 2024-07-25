"use client";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./navbar-menu";
import { cn } from "../../utils/cn";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("absolute top-10 inset-x-0 w-full md:left-1 z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/home/welcome">Welcome</HoveredLink>
            <HoveredLink to="/home/about">About</HoveredLink>
          </div>
        </MenuItem>

        {/* <MenuItem setActive={setActive} active={active} item="Docs">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/docs/prjmanager">PrJManager</HoveredLink>
            <HoveredLink to="/docs/prjextension">PrJExtension</HoveredLink>
            <HoveredLink to="/docs/prjconsole">PrJConsole</HoveredLink>
          </div>
        </MenuItem> */}

        <MenuItem setActive={setActive} active={active} item="Auth">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/auth/login">Login</HoveredLink>
            <HoveredLink to="/auth/register">Registration</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
