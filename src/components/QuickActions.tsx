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
  /** Se true, o botão de abrir menu será ícone-only (bom para headers compactos) */
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
          <Button variant="outline" size="icon" aria-label="Abrir ações">
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Conta
            </span>

            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="text-sm font-medium">Configurações</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Tema
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-40">
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => !busy && onLogout()}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
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
