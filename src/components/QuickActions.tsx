'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  LogOut,
  Loader2,
} from 'lucide-react';

type QuickActionsProps = {
  onLogout: () => void | Promise<void>;
  busy?: boolean;
  compact?: boolean;
};

const QuickActions = ({
  onLogout,
  busy = false,
  compact = false,
}: QuickActionsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Abrir ações"
            className="rounded-lg border-border/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-between rounded-lg border-border/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <span className="inline-flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Conta
            </span>

            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border border-border/60 bg-background p-1 shadow-lg focus-visible:outline-none data-[state=open]:outline-none"
      >
        <DropdownMenuLabel className="px-2">Configurações</DropdownMenuLabel>

        {/* separador com “inset” */}

        <DropdownMenuSeparator className="mx-2 my-1 bg-border/60" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md">
            <Sun className="h-4 w-4" />
            Tema
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-40 rounded-lg border border-border/60 bg-background shadow-sm">
            <DropdownMenuRadioGroup
              onValueChange={(v) => setTheme(v)}
              value={(theme as 'light' | 'dark' | 'system') ?? 'system'}
            >
              <DropdownMenuRadioItem
                value="light"
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Claro
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="dark"
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Escuro
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="system"
                className="flex items-center gap-2"
              >
                <Laptop className="h-4 w-4" />
                Sistema
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* separador com “inset” */}

        <DropdownMenuSeparator className="mx-2 my-1 bg-border/60" />

        <DropdownMenuItem
          onClick={() => !busy && onLogout()}
          className="flex items-center gap-2 rounded-md text-destructive focus:text-destructive"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}

          {busy ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { QuickActions };
