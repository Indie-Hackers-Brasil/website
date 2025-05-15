import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

export function ProjectMarquee() {
  // Use spotlight projects for the marquee
  const spotlightProjects = projects.filter(project => project.spotlight);
  
  return (
    <div className="w-full overflow-hidden bg-muted/30 py-4">
      <Marquee
        gradient={false}
        speed={40}
        pauseOnHover={true}
        className="py-2"
      >
        <div className="flex gap-4 px-4">
          {spotlightProjects.map((project) => (
            <Link
              key={project.id}
              href={project.url}
              className="group transition-all hover:no-underline"
            >
              <Card className="w-[300px] overflow-hidden border-2 border-muted-foreground/10 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                      {project.mrr && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          {project.mrr}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Marquee>
    </div>
  );
}

export default ProjectMarquee; 
