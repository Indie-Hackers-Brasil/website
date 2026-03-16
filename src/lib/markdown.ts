import DOMPurify from "dompurify";
import { marked } from "marked";

export function renderMarkdown(content: string): string {
	const html = marked.parse(content, { async: false }) as string;
	return DOMPurify.sanitize(html);
}
