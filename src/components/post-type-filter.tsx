import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PostTypeFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export function PostTypeFilter({ value, onChange }: PostTypeFilterProps) {
	return (
		<Tabs value={value} onValueChange={onChange}>
			<TabsList>
				<TabsTrigger value="all">Todos</TabsTrigger>
				<TabsTrigger value="build_in_public">Build In Public</TabsTrigger>
				<TabsTrigger value="announcement">Comunicados</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
