import { Badge } from "@/components/ui/badge";
import { INTEREST_LABELS, INTEREST_OPTIONS } from "@/lib/validations/profile";

interface InterestSelectorProps {
	value: string[];
	onChange: (value: string[]) => void;
}

export function InterestSelector({ value, onChange }: InterestSelectorProps) {
	const toggle = (interest: string) => {
		if (value.includes(interest)) {
			onChange(value.filter((i) => i !== interest));
		} else {
			onChange([...value, interest]);
		}
	};

	return (
		<div className="flex flex-wrap gap-2">
			{INTEREST_OPTIONS.map((interest) => {
				const selected = value.includes(interest);
				return (
					<button key={interest} type="button" onClick={() => toggle(interest)}>
						<Badge variant={selected ? "default" : "outline"}>
							{INTEREST_LABELS[interest]}
						</Badge>
					</button>
				);
			})}
		</div>
	);
}
