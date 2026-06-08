import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ToolTip({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}
