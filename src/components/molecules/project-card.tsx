import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  creator: string;
  category: string;
  url: string;
  mrr?: string;
}

export function ProjectCard({
  title,
  description,
  creator,
  category,
  url,
  mrr,
}: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Criador:</span>
            <span className="font-medium">{creator}</span>
          </div>
          {mrr && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">MRR:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{mrr}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm" asChild>
          <Link href={url} target="_blank" rel="noopener noreferrer">
            Visitar Projeto
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard; 
