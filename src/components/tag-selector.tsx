import { Badge } from "@/components/ui/badge";
import { Muted } from "@/components/ui/typography";
import {
	TAG_CATEGORIES,
	TAG_CATEGORY_LABELS,
	TAG_LABELS,
	type TagOption,
} from "@/data/constants/tags";

interface TagSelectorProps {
	value: string[];
	onChange: (value: string[]) => void;
	max?: number;
}

export function TagSelector({ value, onChange, max = 10 }: TagSelectorProps) {
	const toggle = (tag: string) => {
		if (value.includes(tag)) {
			onChange(value.filter((t) => t !== tag));
		} else if (value.length < max) {
			onChange([...value, tag]);
		}
	};

	return (
		<div className="space-y-4">
			<Muted>
				{value.length}/{max} tags selecionadas
			</Muted>
			{(
				Object.keys(TAG_CATEGORIES) as Array<keyof typeof TAG_CATEGORIES>
			).map((categoryKey) => (
				<div key={categoryKey}>
					<p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
						{TAG_CATEGORY_LABELS[categoryKey]}
					</p>
					<div className="flex flex-wrap gap-2">
						{TAG_CATEGORIES[categoryKey].map((tag) => {
							const selected = value.includes(tag);
							const disabled = !selected && value.length >= max;
							return (
								<button
									key={tag}
									type="button"
									onClick={() => toggle(tag)}
									disabled={disabled}
									className="disabled:opacity-40 disabled:cursor-not-allowed"
								>
									<Badge variant={selected ? "default" : "outline"}>
										{TAG_LABELS[tag as TagOption] ?? tag}
									</Badge>
								</button>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
