import * as React from 'react';
import Select, { Props as SelectProps, MenuListProps } from 'react-select';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface SelectMultiProps extends SelectProps {
  error?: boolean;
}

function VirtualizedMenuList(props: MenuListProps<Option>) {
  const { children, maxHeight } = props;
  const parentRef = React.useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ maxHeight, overflowY: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SelectMulti({ className, error, ...props }: SelectMultiProps) {
  return (
    <Select
      isMulti
      components={{ MenuList: VirtualizedMenuList }}
      className={cn('react-select-container', className)}
      classNamePrefix="react-select"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '40px',
          borderRadius: '0.75rem', // rounded-xl
          backgroundColor: 'var(--background)',
          borderColor: error
            ? 'var(--destructive)'
            : state.isFocused
              ? 'var(--primary)'
              : 'var(--border)',
          boxShadow: state.isFocused
            ? error
              ? '0 0 0 2px var(--destructive)'
              : '0 0 0 2px var(--primary)'
            : 'none',
          '&:hover': {
            borderColor: error ? 'var(--destructive)' : 'var(--primary)',
          },
          transition: 'all 0.2s',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--popover)',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? 'var(--primary)'
            : state.isFocused
              ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
              : 'transparent',
          color: state.isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
          '&:active': {
            backgroundColor: 'var(--primary)',
          },
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
          borderRadius: '0.25rem',
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: 'var(--primary)',
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: 'var(--primary)',
          '&:hover': {
            backgroundColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          },
        }),
      }}
      {...props}
    />
  );
}
