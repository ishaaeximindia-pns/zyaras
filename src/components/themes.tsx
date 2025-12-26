
'use client';

import * as React from 'react';
import {Paintbrush} from 'lucide-react';
import {useTheme} from 'next-themes';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Themes() {
  const {setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('default')}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('red')}>Red</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('blue')}>
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('green')}>
          Green
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
