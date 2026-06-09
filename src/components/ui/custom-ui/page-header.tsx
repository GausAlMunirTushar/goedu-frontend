import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-bold">{title}</h1>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
