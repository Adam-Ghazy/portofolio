'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataListProps {
  items: any[];
  selectedId?: number | string;
  onSelect: (item: any) => void;
  onDelete: (item: any) => void;
  getTitle: (item: any) => string;
  getSubtitle: (item: any) => string;
  getIcon?: (item: any, index: number) => string;
  loading?: boolean;
}

export function DataList({
  items,
  selectedId,
  onSelect,
  onDelete,
  getTitle,
  getSubtitle,
  getIcon,
  loading
}: DataListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-16">
        <div className="text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm font-medium text-foreground">Belum ada data</p>
          <p className="text-xs text-muted-foreground mt-1">Klik "Tambah Baru" untuk membuat item pertama</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isSelected = (item.id || item.key) === selectedId;
        return (
          <Card
            key={item.id || item.key}
            className={cn(
              "group cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary shadow-md"
            )}
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center gap-3 p-4">
              {/* Icon/Avatar */}
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-mono font-bold text-primary shrink-0">
                {getIcon ? getIcon(item, index) : String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-foreground">
                  {getTitle(item)}
                </div>
                <div className="text-xs truncate text-muted-foreground mt-0.5">
                  {getSubtitle(item)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
